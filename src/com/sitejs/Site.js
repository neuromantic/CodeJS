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
		_trace( 'starting site.')
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
				Tween.defaultEasing = Easing.linearTween
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
				form.addChild( header );
				subhead = new TextField( 'Contact us:' );//'Class / Object : Development Environment.'
				subhead.name( 'subhead' );
				form.addChild( subhead );
				email = new EmailInput( 'enter your email' );
				email.name( 'email' );
				form.addChild( email );
				message = new TextArea( 'type a message' );
				message.name( 'message' );
				form.addChild( message );
				submit = new SubmitButton( 'send')
				submit.name( 'submit' );
				form.addChild( submit );
				graphic = new Loader( 'img/diagonal.png' );
				stage.addChild( graphic );
				graphic.name( 'graphic' );
				footer = new TextField( '&copy; 2011 Neuromantic LLC. All rights reserved.' );
				stage.addChild( footer );
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
					Tween.to( message, 0.5, { alpha : 1 } );
				} );
				email.addEventListener( FocusEvent.BLUR, function () { 
					message.textColor = 0x666666;
				} );
				message.addEventListener( FocusEvent.FOCUS, function () { 
					var animated = (! submit.visible() );
					submit.visible( true );
					_this.layout( animated, function () { 
						Tween.to( submit, 0.5, { alpha : 1 } );
					} );
				} );
				submit.addEventListener(  MouseEvent.CLICK, submit_clickHandler );
				function submit_clickHandler ( event ) {
					submit.removeEventListener(  MouseEvent.CLICK, submit_clickHandler );
					Tween.to( event.target, 0.25, { x : submit.x() +  message.width() - submit.width() - 5, onComplete  : hideForm  } );
					function hideForm( event ) {
						var components = [ subhead, email, message, submit ];
						for( var index in components ){
							index = Number( index );
							var component = components[ index ];
							Tween.to( component, 0.5, { alpha : 0 } );
						};
						Tween.delayedCall( 0.5, this.layout, this )
					};
				};
			};
			
			init = function () {
				var components = [ header, subhead, email, message, submit, footer, graphic ];
				for( var index in components ){
					index = Number( index );
					var component = components[ index ];
					component.alpha( 0 );
				}
				message.visible( false );
				submit.visible( false );
			}
			layout = function ( animated , callback ) {
// _trace( 'layout' );
				bg.x( 10 );
				bg.y( 10 );
				email.width( 270 ); // (padding) 
				message.width( 270 );
				message.height( 270 );
				bg.width(  Math.max( stage.width() - 20, form.width() + 20 ) );
				var y = 0
				var bottom = y;
				var components = [ header, subhead, email, message, submit ];
				for( var index in components ){
					index = Number( index );
					var component = components[ index ];
					component.y( y );
					y += component.height() + 5;
					 if( component.visible() ) {
					 	bottom += component.height() + 5;
					 }
				}
				submit.x( 5 );
				form.x( Math.max( 20, ( stage.width() - form.width() ) * 0.5 ) );
				graphic.x( bg.x() + bg.width() - graphic.width() );
				footer.x(  bg.x() + bg.width() - footer.width() - 10 );
				var bgH = Math.max( stage.height() - 20, form.height() + graphic.height() + 20 );
				
				if ( animated ){ 
					Tween.to( bg, 0.25, {
						height     : bgH,
						onComplete : callback 
					} );
					Tween.to( form, 0.25, { 
						y			: Math.max( 20, ( stage.height() - form.height() - graphic.height() ) * 0.5 ) 
					} );
					Tween.to( graphic, 0.25, {
						y          : bg.y() + bgH - graphic.height(), 
					} );
					Tween.to( footer, 0.25, {
						y          : bg.y() + bgH - footer.height() - 5 ,
					} );
				}else{
					bg.height( bgH);
					form.y( Math.max( 20, ( stage.height() - form.height() - graphic.height() ) * 0.5 ) );
					graphic.y( bg.y() + bgH - graphic.height() );
					footer.y( bg.y() + bgH - footer.height() - 5 );
					
					callback ? callback() : 0;
				}	
			};
			
			start = function () {
				Tween.to( header  , 0.5, { alpha : 1, delay : 0    } );
				Tween.to( graphic , 0.5, { alpha : 1, delay : 0  } );
				Tween.to( subhead , 0.5, { alpha : 1, delay : 0.25 } );
				Tween.to( email   , 0.5, { alpha : 1, delay : 0.5  } );
				Tween.to( footer  , 0.5, { alpha : 1, delay : 0.5  } );
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
