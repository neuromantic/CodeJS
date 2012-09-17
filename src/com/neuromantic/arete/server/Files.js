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
		Files: function( config ) {
		},
		process : function ( message ){
			if( message.config && message.config.files ){
				var config = message.config.files;
				if ( config.root ){
					this._.root = config.root;
				}
				if ( config.types ) {
					this._.types = config.types;
				}
			}
			if( message.request ) {
				var request = message.request;
				var path = require( 'url' ).parse( request.req.url ).path;
				if( path.indexOf('/') === 0 ){
					path = path.substring(1);
				}
				var root = this._.root
				if( root.indexOf('/') === 0 ){
					root = root.substring(1);
				}
				
				if ( root === '' || path.indexOf( this._.root ) === 0 ){//in root
					var file = path.substring( path.lastIndexOf( '/' ) + 1 );
					if (file == ''){
						file = 'index.html';
						path+=file;
					}
					var ext = file.substring( file.lastIndexOf( '.' ) + 1 );
					var type = this._.types[ ext ];
					if( type ) {
						request.res.setHeader("Content-Type", type );
						try{
							var filePath = 'files/' + path;
_debug('>>>', filePath);
				       		var buffer = fs.readFileSync( filePath );
					        if( buffer ) {
						        if( type.indexOf ( 'text' ) >= 0 ){
						               buffer = buffer.toString();
						        }
								request.res.statusCode = 200;
								request.res.end( buffer );
					    	}
				        } catch ( error ) {
				        	request.res.statusCode = 404;
				        	request.res.end( error.message );
				        }
					}
				}
			}			
			this._super().process( message );
		}//,
	})
);