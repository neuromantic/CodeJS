/*!
 *
 * Test.js
 * Test
 *
 */
_package( 'com.neuromantic.arete',
	
	_import( 'com.neuromantic.arete.server.Server' ),
	_import( 'com.neuromantic.arete.server.Static' ),
	_import( 'com.neuromantic.arete.server.Logger' ),
	_import( 'com.neuromantic.arete.server.Apps' ),
	_import( 'com.neuromantic.arete.server.Sockets' ),
	
	_class( 'Arete' )._extends( 'Server', {
		Arete : function(){
			var server = new Server( { host: '127.0.0.1', port: 2207 } );
			var sockets = new Sockets( {http: server._.http});
			var logger = new Logger();
			var app = new Apps();
			var files = new Static( { root: '/' }  );
			server.connect( logger );
			logger.connect( app );
			app.connect( files );
			console.log( 'Arete running.' );
		}
	})
);