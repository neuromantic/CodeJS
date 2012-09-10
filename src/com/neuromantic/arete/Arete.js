/*!
 *
 * Test.js
 * Test
 *
 */
_package( 'com.neuromantic.arete',
	
	_import('com.neuromantic.arete.server.Server'),
	_import('com.neuromantic.arete.server.Static'),
	_import('com.neuromantic.arete.server.Logger'),
	_import('com.neuromantic.arete.server.App'),
	
	_class( 'Arete', {
		Arete : function(){
			var server = new Server( {host:'127.0.0.1', port:'2207'} );
			var app = new App();
			var files = new Static( {root:'/'}  );
			var logger = new Logger();
			server.connect( logger );
			logger.connect( app );
			app.connect( files );
			console.log( 'Arete running.' );
		}
	})
);
