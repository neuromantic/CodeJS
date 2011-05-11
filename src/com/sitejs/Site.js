 /*!
 *
 * Code.js
 * http://fasejs.com/
 *
 * Copyright 2011, Neuromantic Industries & For Sure, Rad!
 * Licensed under the MIT license.
 *
 */
(function() {
	window.onload = function () {
		Code( [ Fase, Browser, Site  ], function(){
			var site = new Site (window);
			site.stage = new Stage(document.body);
			header = new TextField( 'Code.js' );
			stage.addChild( header );
			subhead = new TextField('Class / Object : Development Environment.');
			stage.addChild( subhead );
			 email = new EmailInput( 'enter your email' );
			stage.addChild( email );
			 message = new TextArea( 'type your message' );
			stage.addChild( message );
			var traceLeaves = function( branch, leaves ) {
				var n = 0;
				leaf = function(branch, leaves ){return branch[ leaves ] };
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
