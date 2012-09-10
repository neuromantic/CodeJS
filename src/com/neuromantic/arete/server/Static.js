/*!
 *
 * Static.js
 * com.neuromantic.arete.server.Static
 *
 */
_package( 'com.neuromantic.arete.server',
 	_import( 'com.neuromantic.arete.component.Component' ),
	_class( 'Static' )._extends( 'Component', {
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
		Static: function( config ) {
			if(config.root){
				this._.root = config.root;
			}
			if ( config.types ) {
				this._.types = config.types;
			}
		},
		process : function ( message ){
			if( message.http ) {
				var path = require( 'url' ).parse( message.http.req.url ).path;
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
						message.http.res.setHeader("Content-Type", type );
						try{
				       		var buffer = fs.readFileSync(path);
					        if( buffer ) {
						        if( type.indexOf ( 'text' ) >= 0 ){
						               buffer = buffer.toString();
						        }
								message.http.res.statusCode = 200;
						        message.http.res.end( buffer );
					    	}
				        } catch ( error ) {
							message.http.res.statusCode = 404;
					        message.http.res.end( error.message );
				        }
					}
				}
			}			
			this._super.process( message );
		}//,
	})
);