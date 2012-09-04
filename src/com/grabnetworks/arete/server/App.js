/*!
 *
 * App.js
 * com.grabnetworks.arete.Logger
 *
 */
_package( 'com.grabnetworks.arete.server',
 	_import( 'com.grabnetworks.arete.component.Component' ),
	_class( 'App' )._extends( 'Component', {
		App : function( ) {
		},
		process : function ( message ) {
			if( message.http ) {
				var url = require( 'url' ).parse( message.http.req.url, true );
				var path = url.path;
				if( path.indexOf('/') === 0 ){
					path = path.substring(1);
				}//if
				var classPath;
				if ( path.indexOf( 'App.js' ) === 0 ){
					classPath = url.query.src
					console.log('App.js')
					message.http.res.setHeader("Content-Type", 'text/javascript' );
_debug( 'compiling', classPath);
					try{
_debug( 'getting Code from file system');
						var code = require( 'fs' ).readFileSync( 'src/Code.js').toString();
					}catch (error){
	_debug( 'src/Code.js could not be read:\n'+ error.message);
						message.http.res.statusCode = 500;
				        message.http.res.write( '{ "error" : "src/Code.js could not be read:\n'+ error.message+'}' );
				    }
					try{
_debug( 'compiling App from file system');
						var app =  Code.c( classPath );
			        } catch ( error ) {//try
	_debug( classPath + ' could not be compiled:\n'+ error.message);
						message.http.res.statusCode = 500;
						message.http.res.write( '{ "error" : "'+classPath + ' could not be compiled:\n'+ error.message+"}" );
					}
_debug( 'creating exec statement');
					var exec = 'Code.x("' + classPath + '");';
			        if( app && code && exec ) {
						message.http.res.statusCode = 200;
_debug( 'adding Code');
						message.http.res.write( code );
_debug( 'adding App' );
						message.http.res.write( app );
_debug( 'adding exec' );
						message.http.res.write( exec );
			        }//if
				}// if
			}// if
			this.output( message );			
		}//,process
	})//class
)//package
	