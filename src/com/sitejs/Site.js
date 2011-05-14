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
			_trace( header._get('name') );
			stage.addChild( header );
			subhead = new TextField( 'Contact us:' );//'Class / Object : Development Environment.'
			subhead.name( 'subhead' )
			stage.addChild( subhead );
			email = new EmailInput( 'enter your email' );
			stage.addChild( email );
			message = new TextArea( 'type a message' );
			stage.addChild( message );
			submit = new SubmitButton( 'send')
			stage.addChild( submit );
			submit.addEventListener( MouseEvent.CLICK, function( event ){ _trace( '>', event.type ); } );
			footer = new TextField( '&copy; 2011 Neuromantic Industries. All rights reserved.' )
			stage.addChild( footer );
			footer.name('footer');
			Tween.from( header, 1, { alpha : 0 } );
		 });
	};
})();
