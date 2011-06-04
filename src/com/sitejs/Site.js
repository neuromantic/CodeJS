 /*!
 *
 * Site.js
 * http://fasejs.com/
 *
 * Copyright 2011, Neuromantic Industries & For Sure, Rad!
 * Licensed under the MIT license.
 *
 */
(function() {
	window.onload = function () {
		_trace( 'starting site.');
		window.scroll( 0, 1 );
		Code( [ Fase ], function () { // Fase
		// // _import( 'com.fasejs.fs.transitions.Tween');
		// // _import( 'com.fasejs.fs.transitions.Easing');
		// // _import( 'com.fasejs.display.Stage' );
		// // _import( 'com.fasejs.display.Sprite' );
		// // _import( 'com.fasejs.text.TextField' );
		// // _import( 'com.fasejs.events.Event' );
		// // _import( 'com.fasejs.events.MouseEvent' );
		// // _import( 'com.browserjs.dom.form.EmailInput' );
		// // _import( 'com.browserjs.dom.form.TextArea' );
		
			setup = function () {
				Tween.defaultEasing = Easing.easeOutCubic;
			};
			build = function () {
				stage = new Stage( document.body ) ;
				bg = new Sprite();
				bg.name( 'bg' );
				stage.addChild( bg );
				form = new Sprite();
				form.name( 'form' );
				stage.addChild( form );
				header = new TextField( 'Neuromantic makes software.' );// 'Code.js'
				header.name( 'header' );
				subhead = new TextField( 'Contact us:' );//'Class / Object : Development Environment.'
				subhead.name( 'subhead' );
				email = new EmailInput( 'enter your email' );
				email.name( 'email' );
				sender = new TextInput( 'tell us your name' );
				sender.name( 'sender' );
				message = new TextArea( 'type your message' );
				message.name( 'message' );
				submit = new SubmitButton( 'send' );
				submit.name( 'submit' );
				feedback = new TextField( 'feedback Message' );
				feedback.name( 'feedback' );
				graphic = new Loader( 'img/diagonal.png' );
				stage.addChild( graphic );
				footer = new TextField( '&copy; 2011 Neuromantic LLC. All rights reserved.' );
				stage.addChild( footer );
				footer.name( 'footer' );
			};
			addEvents = function () {
				stage.addEventListener( Event.RESIZE, this.layout, this );
				email.addEventListener( ValidationEvent.VALID, function () { 
					var animated = (! form.contains(sender) );
					form.addChild( sender );
					layout( animated, function () {
						Tween.to( sender, 0.2, { alpha : 1, delay : 0.1 } );
					} );
				} );
				var inputs = [sender, message, submit ];
				for ( var index in inputs ) {
					var input = inputs[ index ];
					var nextInput = inputs[ Number( index ) + 1 ];
					if ( nextInput ) {
						input.addEventListener( ValidationEvent.VALID, (function( nextInput ){
							return function () { 
								var animated = (! form.contains( nextInput ) );
								form.addChild( nextInput );
								this.layout( animated, function () { 
									Tween.to( nextInput, 0.2, { alpha : 1, delay : 0.1 } ); 
								} );//layout
							};
						} )( nextInput ), this );//event
					};//if
				};//for
				
				function input_onKeyUp(){
					this._validateForm();
				};
				function validateForm() {
					var variables = {};
					if (! email.valid() ) return false;
					variables.senderEmail = email.text();
					if (! sender.valid() ) return false;
					variables.senderName = sender.text();
					if (! message.valid() ) return false;
					variables.senderMessage = message.text();
					return variables;
				};
				submit.addEventListener(  MouseEvent.CLICK, submit_clickHandler, this );
				function submit_clickHandler ( event ) {
					submit.removeEventListener(  MouseEvent.CLICK, submit_clickHandler );
					var variables = validateForm();
					if (variables) {
						var varSend = new URLRequest("contactForm.php", 'POST', variables );
						var varLoader = new URLLoader();
						// varLoader.dataFormat = URLLoaderDataFormat.VARIABLES;
						varLoader.addEventListener(LoadingEvent.COMPLETE, varLoader_completeHandler, this );
						varLoader.load(varSend);
					};
				};
				function varLoader_completeHandler( event ) {
					feedback.text( ( event.data == 'win' ) ? 'We\'ll be in touch.' : 'Something went wrong.<br>Please try <a href = "mailto:info@neuromantic.com">info@neuromantic.com</a>.' );
					this.layout( false );
					Tween.to( submit, 0.2, { x : submit.x() +  message.width() - submit.width() - 5, onComplete  : hideForm  } );
					Tween.delayedCall( 0.5, endFrame, this );
					function hideForm( event ) {
						var components = [ header, subhead, email, sender, message, submit  ];
						for( var index in components ){
							index = Number( index );
							var component = components[ index ];
							( function ( index ) { Tween.to( component, 0.2, { delay : ( index * 0.02 ), alpha : 0 } ) } )( index );
						};
					};
					function endFrame(){
						var components = [ header, subhead, email, message, submit, sender ];
						for( var index in components ){
							index = Number( index );
							var component = components[ index ];
							form.removeChild( component );
						};
						stage.addChild( feedback )
						this.layout( false );
						Tween.to( feedback, 0.2, { alpha : 1 } );
					};
				};
			};
			
			init = function () {
				var components = [ header, subhead, email, message, submit, graphic, sender, feedback ];
				for( var index in components ) {
					index = Number( index );
					var component = components[ index ];
					component.alpha( 0 );
				};
			};
			layout = function ( animated , callback ) {
				bg.x( 10 );
				bg.y( 10 );
				form.width( 280 );
				var textInputs = [email, sender, message ];
				for( var index in textInputs ) {
					var textInput = textInputs[ index ];
					textInput.width( 270 ); // (padding) 
				}
				message.height( 270 );
				bg.width(  Math.max( stage.width() - 20, 300 ) );
				var y = 0
				var bottom = y;
				var components = [ header, subhead, email, sender, message, submit ];
				for( var index in components ){
					index = Number( index );
					var component = components[ index ];
					component.y( y );
					y += component.height() + 5;
					 if( component.visible() ) {
					 	bottom += component.height() + 5;
					 }
				}
				form.height( bottom );
				form.x( Math.max( 20, ( stage.width() - 300 ) * 0.5 ) );
				feedback.x( ( stage.width() - feedback.width() ) * 0.5 );
				graphic.x( bg.x() + bg.width() - graphic.width() );
				footer.x(  bg.x() + bg.width() - footer.width() - 10 );
				var bgH = Math.max( stage.height() - 20, form.height() + graphic.height() + 20 );
				if ( animated ){ 
					Tween.to( bg, 0.1, {
						height     : bgH,
						onComplete : callback 
					} );
					Tween.to( form, 0.1, { 
						y			: Math.max( 20, ( stage.height() - form.height() - graphic.height() ) * 0.5 ) 
					} );
					Tween.to( graphic, 0.1, {
						y          : bg.y() + bgH - graphic.height() 
					} );
					Tween.to( footer, 0.1, {
						y          : bg.y() + bgH - footer.height() - 5 
					} );
				
				}else{
					bg.height( bgH);
					form.y( Math.max( 20, ( stage.height() - form.height() - graphic.height() ) * 0.5 ) );
					feedback.y( ( stage.height() - graphic.height() ) * 0.5 );
					graphic.y( bg.y() + bgH - graphic.height() );
					footer.y( bg.y() + bgH - footer.height() - 5 );
					
					callback ? callback() : 0;
				}
				
			};
			
			start = function () {
				layout(false);
				Tween.to( graphic , 0.5, { alpha : 1, delay : 0.1, onComplete : function () { 
				window.scrollTo(0,1);
					stage.addChild( form );
					form.addChild( header )
					layout( true, function() {
						Tween.to( header  , 0.5, { alpha : 1, onComplete : function () {
							form.addChild(subhead);
							layout( true, function() {
								Tween.to( subhead , 0.5, { alpha : 1, onComplete : function () {
									form.addChild( email );
									layout( true, function() {
										Tween.to( email   , 0.5, { alpha : 1 } );
									});
								}});
							});
						}});
					});
				} } );									
			};
			setup();
			build();
			addEvents();
			init();
			layout();
			start();
		});
	};//,
	_trace('site ready.')
})();
