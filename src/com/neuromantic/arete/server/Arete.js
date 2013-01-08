/*!
 *
 * Arete.js
 * com.neuromantic.arete.server.Arete
 *
 */
_package( 'com.neuromantic.arete.server',
	
	_import( 'com.neuromantic.arete.server.HTTP' ),
	_import( 'com.neuromantic.arete.server.Files' ),
	_import( 'com.neuromantic.arete.server.Logger' ),
	_import( 'com.neuromantic.arete.server.Apps' ),
	_import( 'com.neuromantic.arete.server.Sockets' ),
	_import( 'com.neuromantic.arete.component.App' ),
	
	_class( 'Arete' )._extends( 'App', {
		Arete : function( settings ){
			this._super( settings );
			var http = new HTTP( settings.http );
//			var sockets = new Sockets();
			var apps = new Apps();
			var files = new Files( settings.files );
            var src = new Files( settings.src );
			var logger = new Logger();
            http.connect( logger );
			http.connect( files );
			files.connect( src );
			src.connect( apps);
			this.connect( http );
			this.emit( { log: 'Arete running.' } );
		}
	})
);