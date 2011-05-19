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
			stage = new Stage( document.getElementById( 'stage' ) ) ;
			header = new TextField( 'Neuromantic makes software.' );// 'Code.js'
			header.name( 'header' );
			stage.addChild( header );
			subhead = new TextField( 'Contact us:' );//'Class / Object : Development Environment.'
			subhead.name( 'subhead' );
			stage.addChild( subhead );
			email = new EmailInput( 'enter your email' );
			subhead.name( 'email' );
			stage.addChild( email );
			message = new TextArea( 'type a message' );
			subhead.name( 'message' );
			stage.addChild( message );
			submit = new SubmitButton( 'send')
			subhead.name( 'submit' );
			stage.addChild( submit );
			submit.addEventListener( MouseEvent.CLICK, function( event ) { _trace( event.type ); Tween.to( submit, 1, { x : event.mouseX } ); } );
			footer = new TextField( '&copy; 2011 Neuromantic Industries. All rights reserved.' )
			stage.addChild( footer );
			footer.name('footer');
			var components = [ header, subhead, email, message, submit, footer ];
			var delay = 0;
			for( var index in components ){
				var component = components[ index ];
				component.alpha( 0 );
				Tween.to( component, 0.5, { alpha : 1, delay : delay } );
				delay = ( (index + 1) * 0.5 ) - 0.4;
			}
			
		 });
	};
})();
