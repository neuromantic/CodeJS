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
		Code([ Fase ], function(){
			stage = new Stage( document.getElementById( 'stage' ) ) ;
			header = new TextField( 'Neuromantic makes software.' );// 'Code.js'
			stage.addChild( header );
			subhead = new TextField( 'Contact us:' );//'Class / Object : Development Environment.'
			// stage.addChild( subhead );
			// email = new EmailInput( 'enter your email' );
			// stage.addChild( email );
			// message = new TextArea( 'type a message' );
			// stage.addChild( message );
			// submit = new SubmitButton( 'send')
			// stage.addChild( submit );
			// footer = new TextField( '&copy; 2011 Neuromantic Industries. All rights reserved.' )
			// stage.addChild( footer );
			// footer.name('footer');
			// myButton = new MyButton();
			// stage.addChild( myButton );
			// myButton.visible(false);
			// email.addEventListener( MouseEvent.CLICK, function( event ){ _trace( '>', event.type ); } );
			// Tween.From( header , 1 , { alpha : 0 } );
		});
	};
})();
