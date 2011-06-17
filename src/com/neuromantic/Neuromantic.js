_package( 'com.neuromantic',
	_import( 'com.fasejs.fs.transitions.Tween'),
	_import( 'com.fasejs.fs.transitions.Easing'),
	_import( 'com.fasejs.display.Sprite' ),
	_import( 'com.fasejs.net.URLLoader' ),
	_import( 'com.fasejs.net.URLRequest' ),
	_import( 'com.fasejs.display.Loader' ),
	_import( 'com.fasejs.text.TextField' ),
	_import( 'com.fasejs.events.Event' ),
	_import( 'com.fasejs.events.MouseEvent' ),
	_import( 'com.fasejs.events.LoadingEvent' ),
	_import( 'com.browserjs.dom.form.EmailInput' ),
	_import( 'com.browserjs.dom.form.TextArea' ),
	_import( 'com.browserjs.dom.form.SubmitButton' ),
	_import( 'com.sitejs.Site' ),
	_class( 'Neuromantic' )._extends( 'Site', {
		private_bg : null,
		private_form : null,
		private_header : null,
		private_subhead : null,
		private_email : null,
		private_sender : null,
		private_message : null,
		private_submit : null,
		private_feedback : null,
		private_graphic : null,
		private_footer : null,
		
		setup : function () {
			Tween.defaultEasing = Easing.easeOutCubic;
		},
		build : function () {
			this._.bg = new Sprite();
			this._.bg.name( 'bg' );
			this.stage.addChild( this._.bg );
			this._.form = new Sprite();
			this._.form.name( 'form' );
			this.stage.addChild( this._.form );
			this._.header = new TextField( 'Neuromantic makes software.' );// 'Code.js'
			this._.header.name( 'header' );
			this._.subhead = new TextField( 'Contact us:' );//'Class / Object : Development Environment.'
			this._.subhead.name( 'subhead' );
			this._.email = new EmailInput( 'enter your this' );
			this._.email.name( 'email' );
			this._.sender = new TextInput( 'tell us your name' );
			this._.sender.name( 'sender' );
			this._.message = new TextArea( 'type your message' );
			this._.message.name( 'message' );
			this._.submit = new SubmitButton( 'send' );
			this._.submit.name( 'submit' );
			this._.feedback = new TextField( 'feedback readout' );
			this._.feedback.name( 'feedback' );
			this._.graphics = new Loader( 'img/diagonal.png' );
			this.stage.addChild( this._.graphics );
			this._.footer = new TextField( '&copy; 2011 Neuromantic LLC. All rights reserved.' );
			this.stage.addChild( this._.footer );
			this._.footer.name( 'footer' );
		},
		addEvents : function () {
			var _this = this;
			this._.email.addEventListener( ValidationEvent.VALID, function () { 
				var animated = (! this._.form.contains( _this._.sender ) );
				this._.form.addChild( _this._.sender );
				this.layout( animated, function () {
					Tween.to( _this._.sender, 0.2, { alpha : 1, delay : 0.1 } );
				} );
			} , this );
			var inputs = [ this._.sender, this._.message, this._.submit ];
			for ( var index in inputs ) {
				var input = inputs[ index ];
				var nextInput = inputs[ Number( index ) + 1 ];
				if ( nextInput ) {
					input.addEventListener( ValidationEvent.VALID, (function( nextInput ){
						return function () { 
_debug( this, 'is valid. Tweening', nextInput )
							var animated = (! this._.form.contains( nextInput ) );
							this._.form.addChild( nextInput );
							this.layout( animated, ( function ( nextInput ) { 
								return function () { 
_debug( this, 'layout complete. Ready to tween,', nextInput )
									Tween.to( nextInput, 0.2, { alpha : 1, delay : 0.1 } ); 
								} 
							} )( nextInput ) );//layout
						};
					} )( nextInput ), _this );//event
				};//if
			};//for
			
			this._.submit.addEventListener(  MouseEvent.CLICK, submit_clickHandler, this );
			function submit_clickHandler ( event ) {
				event.target.removeEventListener(  MouseEvent.CLICK, submit_clickHandler );
				var variables = this.validateForm();
				if (variables) {
					var varSend = new URLRequest("contactForm.php", 'POST', variables );
					var varLoader = new URLLoader();
					// varLoader.dataFormat = URLLoaderDataFormat.VARIABLES;
					varLoader.addEventListener(LoadingEvent.COMPLETE, varLoader_completeHandler, this );
					varLoader.load(varSend);
				};
			};
			function varLoader_completeHandler( event ) {
				event.target.removeEventListener(LoadingEvent.COMPLETE, varLoader_completeHandler);
				this._.feedback.text( ( event.data == 'win' ) ? 'We\'ll be in touch.' : 'Something went wrong.<br>Please try <a href = "mailto:info@neuromantic.com">info@neuromantic.com</a>.' );
				this.layout( false );
				Tween.to( this._.submit, 0.2, { x : this._.submit.x() +  this._.message.width() - this._.submit.width() - 5, onComplete  : this.hideForm, scope : this  } );
				Tween.delayedCall( 0.5, this.endFrame, this );
			};
		},
		endFrame : function(){
				var components = [ this._.header, this._.subhead, this._.email, this._.message, this._.submit, this._.sender ];
				for( var index in components ){
					index = Number( index );
					var component = components[ index ];
					this._.form.removeChild( component );
				};
				this.stage.addChild( this._.feedback )
				this.layout( false );
				Tween.to( this._.feedback, 0.2, { alpha : 1 } );
		},
		hideForm : function( event ) {
				var components = [ this._.header, this._.subhead, this._.email, this._.sender, this._.message, this._.submit  ];
				for( var index in components ){
					index = Number( index );
					var component = components[ index ];
					( function ( index, component ) { Tween.to( component, 0.2, { delay : ( index * 0.02 ), alpha : 0 } ) } )( index, component );
				};
		},
		validateForm : function () {
			var variables = {};
			if (! this._.email.valid() ) return false;
			variables.senderEmail = this._.email.text();
			if (! this._.sender.valid() ) return false;
			variables.senderName = this._.sender.text();
			if (! this._.message.valid() ) return false;
			variables.senderMessage = this._.message.text();
			return variables;
		},
		init : function () {
			var components = [ this._.header, this._.subhead, this._.email, this._.message, this._.submit, this._.graphics, this._.sender, this._.feedback ];
			for( var index in components ) {
				index = Number( index );
				var component = components[ index ];
				component.alpha( 0 );
			};
		},
		layout : function ( animated , callback ) {
			this._.bg.x( 10 );
			this._.bg.y( 10 );
			this._.form.width( 280 );
			var textInputs = [this._.email, this._.sender, this._.message ];
			for( var index in textInputs ) {
				var textInput = textInputs[ index ];
				textInput.width( 270 ); // (padding) 
			}
			this._.message.height( 270 );
			this._.bg.width(  Math.max( this.stage.width() - 20, 300 ) );
			var y = 0
			var bottom = y;
			var components = [ this._.header, this._.subhead, this._.email, this._.sender, this._.message, this._.submit ];
			for( var index in components ){
				index = Number( index );
				var component = components[ index ];
				component.y( y );
				y += component.height() + 5;
				 if( component.visible() ) {
				 	bottom += component.height() + 5;
				 }
			}
			this._.form.height( bottom );
			this._.form.x( Math.max( 20, ( this.stage.width() - 300 ) * 0.5 ) );
			this._.feedback.x( ( this.stage.width() - this._.feedback.width() ) * 0.5 );
			this._.graphics.x( this._.bg.x() + this._.bg.width() - this._.graphics.width() );
			this._.footer.x(  this._.bg.x() + this._.bg.width() - this._.footer.width() - 10 );
			var bgH = Math.max( this.stage.height() - 20, this._.form.height() + this._.graphics.height() + 20 );
			if ( animated ){ 
				Tween.to( this._.bg, 0.1, {
					height     : bgH,
					onComplete : function() { 
						callback()
					}//, 
				} );
				Tween.to( this._.form, 0.1, { 
					y			: Math.max( 20, ( this.stage.height() - this._.form.height() - this._.graphics.height() ) * 0.5 ) 
				} );
				Tween.to( this._.graphics, 0.1, {
					y          : this._.bg.y() + bgH - this._.graphics.height() 
				} );
				Tween.to( this._.footer, 0.1, {
					y          : this._.bg.y() + bgH - this._.footer.height() - 5 
				} );
			
			}else{
				this._.bg.height( bgH );
				this._.form.y( Math.max( 20, ( this.stage.height() - this._.form.height() - this._.graphics.height() ) * 0.5 ) );
				this._.feedback.y( ( this.stage.height() - this._.graphics.height() ) * 0.5 );
				this._.graphics.y( this._.bg.y() + bgH - this._.graphics.height() );
				this._.footer.y( this._.bg.y() + bgH - this._.footer.height() - 5 );
				callback ? callback() : 0;
			}
		},
		
		start : function () {
			var _this = this;
			_this.layout(false);
			Tween.to( _this._.graphics , 0.5, { alpha : 1, delay : 0.1, onComplete : function () { 
			window.scrollTo(0,1);
				_this.stage.addChild( _this._.form );
				_this._.form.addChild( _this._.header )
				_this.layout( true, function() {
					Tween.to( _this._.header  , 0.5, { alpha : 1, onComplete : function () {
						_this._.form.addChild( _this._.subhead);
						_this.layout( true, function() {
							Tween.to( _this._.subhead , 0.5, { alpha : 1, onComplete : function () {
								_this._.form.addChild( _this._.email );
								_this.layout( true, function() {
									Tween.to( _this._.email   , 0.5, { alpha : 1 } );
								});
							}});
						});
					}});
				});
			}});									
		}//,
	}
));
