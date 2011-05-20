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
		_import( 'com.fasejs.fs.transitions.Tween');
		_import( 'com.fasejs.display.Stage' );
		_import( 'com.fasejs.text.TextField' );
		_import( 'com.fasejs.display.Stage' );
		_import( 'com.fasejs.display.Stage' );
		_import( 'com.fasejs.display.Stage' );
		Code(function () { // Fase
			setup = function () {
				Tween.defaultEasing = Easing.linearTween
			};
			build = function () {
				stage = new Stage( document.body ) ;
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
				graphic = new Loader( 'img/diagonal.png' );
				stage.addChild( graphic );
				graphic.name( 'graphic' );
				footer = new TextField( '&copy; 2011 Neuromantic LLC. All rights reserved.' );
				bg.addChild( footer );
				footer.name( 'footer' );
			};
			addEvents = function () {
				var _this = this;
				stage.addEventListener( Event.RESIZE, function () {
					_this.layout();
				} );
				email.addEventListener( FocusEvent.FOCUS, function () { 
					var animated = (! message.visible() );
					message.visible( true );
					_this.layout( animated, function () {
						Tween.to( message, 1, { alpha : 1 } );
					} );
				} );
				message.addEventListener( FocusEvent.FOCUS, function () { 
					var animated = (! submit.visible() );
					submit.visible( true );
					_this.layout( animated, function () { 
						Tween.to( submit, 1, { alpha : 1 } );
					} );
				} );
				submit.addEventListener(  MouseEvent.CLICK, function ( event ) { Tween.to( event.target, 0.5, { x : bg.width() - submit.width - 5 } ) } );
			};
			layout = function ( animated ,callback ) {
				var components = [ header, subhead, email, message, submit ];
				bg.x( 10 );
				bg.y( 10 );
				bg.width(  Math.max( stage.width() - 20, 300 ) );
				email.width( 270 ); // (padding) 
				message.width( 270 );
				message.height( 270 );
				var y = 10;
				var bottom = y;
				for( var index in components ){
					index = Number( index );
					var component = components[ index ];
					component.x( Math.max( 10, ( stage.width() - 300 ) * 0.5 ) );
					component.y( y );
					y += component.height() + 5;
					 if( component.visible() ) {
					 	bottom += component.height() + 5;
					 }
				}
				var duration = ( animated ) ? 0.5 : 0;
				Tween.to( bg, duration, {
					 height    : Math.max( stage.height() - 20, bottom + graphic.height() ), 
					 onUpdate  : function () {
						footer.y(  bg.y() + bg.height() - footer.height() - 20 );
						graphic.y( bg.y() + bg.height() - graphic.height() );
					},
					onComplete : callback 
				} );
				
				graphic.x( bg.x() + bg.width()  - graphic.width()  );
				footer.x( bg.x()  + bg.width()  - footer.width()   - 20 );
				
			};
			
			init = function () {
				var components = [ header, subhead, email, message, submit, footer ];
				for( var index in components ){
					index = Number( index );
					var component = components[ index ];
					component.alpha( 0 );
				}
				message.visible( false );
				submit.visible( false );
				this.layout()
			}
			start = function () {
				Tween.to( header , 0.5, { alpha : 1, delay : 0    } );
				Tween.to( subhead, 0.5, { alpha : 1, delay : 0.25 } );
				Tween.to( email  , 0.5, { alpha : 1, delay : 0.5  } );
				Tween.to( footer , 0.5, { alpha : 1, delay : 0.5  } );
			};
			setup();
			build();
			addEvents();
			layout();
			init();
			start();
		});
	};//,
})();
