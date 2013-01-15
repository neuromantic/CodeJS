/*!
 *
 * Files.js
 * com.neuromantic.arete.server.Files
 *
 */
_package( 'com.neuromantic.arete.server',
 	_import( 'com.neuromantic.arete.component.Component' ),
	_class( 'Files' )._extends( 'Component', {
		private_root: '/',
		private_types: { 
			html : 'text/html',
			js: 'text/javascript',
			txt: 'text/plain',
			css: 'text/css',
			jpeg: 'image/jpeg',
			jpg: 'image/jpeg',
			png: 'image/png',
			ico: 'image/vnd.microsoft.icon'
		},
        Files : function ( settings ) {
            this._super( {files: settings });
        },
		config: function ( config ){
			if( config.files ){
				config = config.files;
				if ( config.root ){
					this._.root = config.root;
				}
				if ( config.types ) {
					this._.types = config.types;
				}
			}
		},
		process : function ( message ){
			if( message.request ) {
				var request = message.request;
				var path = require( 'url' ).parse( request.req.url ).path;
				var root = this._.root;
				if( root.indexOf('/') === 0 ){
					root = root.substring(1);
				}
				var file = path.substring( path.lastIndexOf( '/' ) + 1 );
				if (file === ''){
					file = 'index.html';
					path+=file;
				}
				var ext = file.substring( file.lastIndexOf( '.' ) + 1 );
				var type = this._.types[ ext ];
				if( type ) {
					try{
						var filePath = root + path;
                        var fs = require('fs');
                        var buffer = fs.readFileSync( filePath );
                        if( buffer ) {
                            if( type.indexOf ( 'text' ) >= 0 ){
                                buffer = buffer.toString();
                            }
                            request.res.setHeader("Content-Type", type );
							request.res.statusCode = 200;
							request.res.end( buffer );
                        }
                    } catch ( error ) {
_error( error );
                        request.res.statusCode = 404;
                        request.res.end( error.message );
                    }
				}
			}			
			this._super().process( message );
		}//,
	})
);