/*!
 *
 * Test.js
 * Test
 *
 */
_package( '',
	
	_import('com.grabnetworks.arete.server.Server'),
	_import('com.grabnetworks.arete.server.Static'),
	_import('com.grabnetworks.arete.server.Logger'),
	
	_class( 'Test', {
		Test:function(){
			var server = new Server( {host:'127.0.0.1', port:'2207'} );
			var files = new Static( {root:'/'}  );
			var logger = new Logger();
			server.connect( logger );
			logger.connect( files );
			files.connect( server );
			console.log( 'Test running.' );
		}
	})
);
