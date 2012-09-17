_package( 'com.neuromantic.www',

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
	_import( 'com.neuromantic.proto.Site' ),
	
	_class( 'Neuromantic' )._extends( 'Site', {	
		private_bg : null,
		private_form : null,
		private_header : null,
		private_subhead : null,
		private_email : null,
		private_sender : null,
		private_message : null,
		private_submit : null,
		private_thanks : null,
		private_feedback : null,
		private_graphic : null,
		private_footer : null,

		_setup : function () {
			this._super()._setup();
			Tween.defaultEasing = Easing.easeOutCubic;
		},
		_build : function () {
			this._super()._build();
			this._.bg = new Sprite();
			this._.bg.name( 'bg' );
			this.addChild( this._.bg );
			this._.form = new Sprite();
			this._.form.name( 'form' );
			this.addChild( this._.form );
			this._.header = new TextField( 'Neuromantic makes software.' );// 'Code.js'
			this._.header.name( 'header' );
			this._.subhead = new TextField( 'Contact us:' );//'Class / Object : Development Environment.'
			this._.subhead.name( 'subhead' );
			this._.email = new EmailInput( 'enter your email.' );
			this._.email.name( 'email' );
			this._.sender = new TextInput( 'tell us your name' );
			this._.sender.name( 'sender' );
			this._.message = new TextArea( 'type your message' );
			this._.message.name( 'message' );
			this._.submit = new SubmitButton( 'send' );
			this._.submit.name( 'submit' );
			this._.feedback = new TextField( 'feedback readout' );
			this._.feedback.name( 'feedback' );
			this._.graphic = new Loader( 'img/diagonal.png' );
			this.addChild( this._.graphic );
			this._.footer = new TextField( '&copy; 2011 Neuromantic LLC. All rights reserved.' );
			this.addChild( this._.footer );
			this._.footer.name( 'footer' );
		},
		private_onInputValid : function ( event ) {
			var inputs = [this._.email, this._.sender, this._.message, this._.submit ];
			var index = inputs.indexOf( event.target );
			var nextInput = inputs[ Number( index ) + 1 ];
			_debug('showing', nextInput)
			if ( nextInput ) {
				var animated = (! this._.form.contains( nextInput ) );
				this._.form.addChild( nextInput );
				this._layout( animated, function () {
					Tween.to( nextInput, 0.2, { alpha : 1, delay : 0.1 } );
				} );// layout
			};//if
		},
		
		_addEvents : function () {
			this._super()._addEvents();
			this.stage().addEventListener( Event.RESIZE, this._.onStageResize );
			var inputs = [this._.email, this._.sender, this._.message, this._.submit ];
			for ( var index in inputs ) {
				var input = inputs[ index ];
				var nextInput = inputs[ Number( index ) + 1 ];
				if ( nextInput ) {
					input.addEventListener( ValidationEvent.VALID, this._.onInputValid );
				};//if
			};//for
			this._.submit.addEventListener(  MouseEvent.CLICK, this._.onSubmitClick );
		},
		
		private_onStageResize : function( event ) { 
			this._layout( false );
		},
		private_onSubmitClick : function ( event ) {
			event.target.removeEventListener(  MouseEvent.CLICK, this._.onSubmitClick );
			var variables = this._.validateForm();
			if (variables) {
				var varSend = new URLRequest("contactForm.php", 'POST', variables );
				var varLoader = new URLLoader();
				// varLoader.dataFormat = URLLoaderDataFormat.VARIABLES;
				varLoader.addEventListener(LoadingEvent.COMPLETE, this._.onLoaderComplete, this );
				varLoader.load(varSend);
			};
		},
		 private_onLoaderComplete : function( event ) {
			event.target.removeEventListener( LoadingEvent.COMPLETE, this._.onLoaderComplete );
			this._.feedback.text( ( event.data == 'win' ) ? 'We\'ll be in touch.' : 'Something went wrong.<br>Please try <a href = "mailto:info@neuromantic.com">info@neuromantic.com</a>.' );
			this._layout( false );
			Tween.to( this._.submit, 0.2, { x : this._.submit.x() +  this._.message.width() - this._.submit.width() - 5, onComplete  : this._.hideForm,  } );
			Tween.delayedCall( 0.5,  this._.endFrame);
		},
		private_endFrame : function(){
				var components = [ this._.header, this._.subhead, this._.email, this._.message, this._.submit, this._.sender ];
				for( var index in components ){
					index = Number( index );
					var component = components[ index ];
					this._.form.removeChild( component );
				};
				this.addChild( this._.feedback )
				this._layout( false );
				Tween.to( this._.feedback, 0.2, { alpha : 1 } );
		},
		private_hideForm : function( event ) {
				var components = [ this._.header, this._.subhead, this._.email, this._.sender, this._.message, this._.submit  ];
				for( var index in components ){
					index = Number( index );
					var component = components[ index ];
					( function ( index, component ) { Tween.to( component, 0.2, { delay : ( index * 0.02 ), alpha : 0 } ) } )( index, component );
				};
		},
		private_validateForm : function () {
			var variables = {};
			if (! this._.email.valid() ) return false;
			variables.senderEmail = this._.email.text();
			if (! this._.sender.valid() ) return false;
			variables.senderName = this._.sender.text();
			if (! this._.message.valid() ) return false;
			variables.senderMessage = this._.message.text();
			return variables;
		},
		_init : function () {
			this._super()._init();
			var components = [ this._.header, this._.subhead, this._.email, this._.message, this._.submit, this._.graphic, this._.sender, this._.feedback ];
			for( var index in components ) {
				index = Number( index );
				var component = components[ index ];
				component.alpha( 0 );
			};
		},
		_layout : function ( animated , callback ) {
			this._super()._layout();
			this._.bg.x( 10 );
			this._.bg.y( 10 );
			this._.form.width( 280 );
			var textInputs = [this._.email, this._.sender, this._.message ];
			for( var index in textInputs ) {
				var textInput = textInputs[ index ];
				textInput.width( 270 ); // (padding) 
			}
			this._.message.height( 270 );
			this._.bg.width(  Math.max( this.width() - 20, 300 ) );
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
			this._.form.x( Math.max( 20, ( this.width() - 300 ) * 0.5 ) );
			this._.feedback.x( ( this.width() - this._.feedback.width() ) * 0.5 );
			this._.graphic.x( this._.bg.x() + this._.bg.width() - this._.graphic.width() );
			this._.footer.x(  this._.bg.x() + this._.bg.width() - this._.footer.width() - 10 );
			var bgH = Math.max( this.height() - 20, this._.form.height() + this._.graphic.height() + 20 );
			if ( animated ){ 
				Tween.to( this._.bg, 0.1, {
					height     : bgH,
					onComplete : function() { 
						callback ? callback() : 0;
					}//, 
				} );
				Tween.to( this._.form, 0.1, { 
					y			: Math.max( 20, ( this.height() - this._.form.height() - this._.graphic.height() ) * 0.5 ) 
				} );
				Tween.to( this._.graphic, 0.1, {
					y          : this._.bg.y() + bgH - this._.graphic.height() 
				} );
				Tween.to( this._.footer, 0.1, {
					y          : this._.bg.y() + bgH - this._.footer.height() - 5 
				} );
			
			}else{
				this._.bg.height( bgH );
				this._.form.y( Math.max( 20, ( this.height() - this._.form.height() - this._.graphic.height() ) * 0.5 ) );
				this._.feedback.y( ( this.height() - this._.graphic.height() ) * 0.5 );
				this._.graphic.y( this._.bg.y() + bgH - this._.graphic.height() );
				this._.footer.y( this._.bg.y() + bgH - this._.footer.height() - 5 );
				callback ? callback() : 0;
			}
		},
		
		_start : function () {
			this._super()._start();
			var _this = this;
			_this._layout(false);
			Tween.to( _this._.graphic , 0.5, { alpha : 1, delay : 0.1, onComplete : function () { 
//			window.scrollTo(0,1);
				_this.addChild( _this._.form );
				_this._.form.addChild( _this._.header );
				_this._layout( true, function() {
					Tween.to( _this._.header  , 0.5, { alpha : 1, onComplete : function () {
						_this._.form.addChild( _this._.subhead);
						_this._layout( true, function() {
							Tween.to( _this._.subhead , 0.5, { alpha : 1, onComplete : function () {
								_this._.form.addChild( _this._.email );
								_this._layout( true, function() {
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
