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
		Arete : function( settings ){
			this._super( settings );
			var server = new Server();
			var sockets = new Sockets();
			var apps = new Apps();
			var files = new Files();
			var logger = new Logger();
			server.connect( apps );
			apps.connect( files );
			files.connect( logger);
			this.connect( server )
			this.emit( { log: 'Arete running.' } );
		}
	})
);