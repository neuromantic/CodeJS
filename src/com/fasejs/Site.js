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
		console.log('site loaded');
		Code( [ Fase ], function(){
			_trace('site');
			var stage = window.document.getElementById( 'stage' );
			 stage = new Stage( stage );
			 header = new TextField();
			header.text( 'Neuromantic makes software.' )
			stage.addChild( header );
			subhead = new TextField();
			subhead.text( 'Contact us:' );
			stage.addChild( subhead );
			 email = new EmailInput( 'enter your email' );
			stage.addChild( email );
			 message = new TextArea( 'type your message' );
			stage.addChild( message );
			var traceLeaves = function( branch, leaves ) {
				var n = 0;
				leaf = function(branch, leaves ){return branch[leaves]}
				while( ( leaf =  branch[ leaves ] )  &&  n++ < branch[ leaves ].length ) {
					_trace( leaf );
					traceLeaves( leaf, leaves );
				} 
			}
			traceLeaves( stage, 'children' );
			// header.addEventListener( MouseEvent.CLICK, function( event ){ _trace( '>', event.type ); } );
		});
	};
})();
