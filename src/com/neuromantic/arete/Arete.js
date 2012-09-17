/*!
 *
 * Arete.js
 * com.neuromantic.arete.Arete
 *
 */
_package( 'com.neuromantic.arete',
	
	_import( 'com.neuromantic.arete.server.Server' ),
	_import( 'com.neuromantic.arete.server.Files' ),
	_import( 'com.neuromantic.arete.server.Logger' ),
	_import( 'com.neuromantic.arete.server.Apps' ),
	_import( 'com.neuromantic.arete.server.Sockets' ),
	_import( 'com.neuromantic.arete.component.App' ),
	
	_class( 'Arete' )._extends( 'App', {
		Arete : function(){
_debug(this,'constructor');
			this._super( { 
				server: { host: '127.0.0.1', port: 2207 }, 
				files: 	{ root: '/' } 
			} );
			var server = new Server();
			var sockets = new Sockets();
			var logger = new Logger();
			var apps = new Apps();
			var files = new Files();
			server.connect( logger );
			logger.connect( apps );
			apps.connect( files );
			this.connect( server )
			console.log( 'Arete running.' );
		}
	})
);