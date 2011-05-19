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
		Code([ Fase ], function () { // Fase
			setup = function () {};
			build = function () {
				stage = new Stage( document.getElementById( 'Site' ) ) ;
				bg = new Sprite();
				bg.name( 'bg' );
				stage.addChild( bg );
				header = new TextField( 'Neuromantic makes software.' );// 'Code.js'
				header.name( 'header' );
				bg.addChild( header );
				subhead = new TextField( 'Contact us:' );//'Class / Object : Development Environment.'
				subhead.name( 'subhead' );
				bg.addChild( subhead );
				email = new EmailInput( 'enter your email' );
				subhead.name( 'email' );
				bg.addChild( email );
				message = new TextArea( 'type a message' );
				subhead.name( 'message' );
				bg.addChild( message );
				submit = new SubmitButton( 'send')
				subhead.name( 'submit' );
				bg.addChild( submit );
				submit.addEventListener( MouseEvent.CLICK, function( event ) { _trace( event.type ); Tween.to( submit, 1, { x : event.mouseX } ); } );
				graphic = new Loader( 'img/diagonal.png' );
				bg.addChild( graphic );
				graphic.name( 'graphic' );
				footer = new TextField( '&copy; 2011 Neuromantic Industries. All rights reserved.' );
				bg.addChild( footer );
				footer.name( 'footer' );
			};
			addEvents = function () {
				email.addEventListener(   FocusEvent.FOCUS, function () { Tween.to( message, 0.5, { alpha : 1, delay : 0, easing : Easing.linearTween } ); } );
				message.addEventListener( FocusEvent.FOCUS, function () { Tween.to( submit,  0.5, { alpha : 1, delay : 0, easing : Easing.linearTween } ); } );
			};
			layout = function () {
				var components = [ header, subhead, email, message, submit, footer ];
				bg.x( 10 );
				bg.y( 10 );
				email.width( 280 );
				message.width( 280 );
				message.height( 280 );
				for( var index in components ){
					index = Number( index );
					var component = components[ index ];
					component.alpha( 0 );
					component.x( 10 );
				}
				bg.width( stage.width() - 20 );
				bg.height( stage.height() - 20 );
			};
			
			init = function () {
				var components = [ header, subhead, email, message, submit, footer ];
				for( var index in components ){
					index = Number( index );
					var component = components[ index ];
					component.alpha( 0 );
					component.x( 10 );
				}
			};
			start = function () {
				Tween.to(  header, 0.5, { alpha : 1, delay : 0 } );
				Tween.to( subhead, 0.5, { alpha : 1, delay : 0.25 } );
				Tween.to(   email, 0.5, { alpha : 1, delay : 0.5 } );
				Tween.to(  footer, 0.5, { alpha : 1, delay : 0.5 } );
			};
			setup();
			build();
			addEvents();
			layout();
			init();
			start();
		});
	};
})();
