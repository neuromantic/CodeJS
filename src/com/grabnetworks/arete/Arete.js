/*!
 *
 * Test.js
 * Test
 *
 */
_package( 'com.grabnetworks.arete',
	
	_import('com.grabnetworks.arete.server.Server'),
	_import('com.grabnetworks.arete.server.Static'),
	_import('com.grabnetworks.arete.server.Logger'),
	_import('com.grabnetworks.arete.server.App'),
	
	_class( 'Arete', {
		Arete : function(){
			var server = new Server( {host:'127.0.0.1', port:'2207'} );
			var app = new App();
			var files = new Static( {root:'/'}  );
			var logger = new Logger();
			server.connect( logger );
			logger.connect( app );
			app.connect( files );
			files.connect( server );
			console.log( 'Arete running.' );
		}
	})
);
