/*!
 *
 * Apps.js
 * com.neuromantic.arete.server.Apps
 *
 */
_package( 'com.neuromantic.arete.server',
    _import( 'com.neuromantic.arete.component.Component' ),
	_class( 'Apps' )._extends( 'Component', {
		Apps : function( ) {
		},
		process : function ( message ) {
			var url = require( 'url' );
			if( message.request ) {
				var route = url.parse( message.request.req.url, true );
				var loc = route.path;
_debug( 'APP index', loc.indexOf( 'app' ) );
                var pathArray = loc.split( '/' );

				if( loc.indexOf('/') === 0 ){
					loc = loc.substring(1);
				}//if
				var applicationClassPath;
				if ( pathArray[1] == 'app' ){
_debug( 'app requested')
					applicationClassPath = pathArray[2].split('.js')[0];
_debug( 'compiling', applicationClassPath );
					message.request.res.setHeader( 'Content-Type', 'text/javascript' );
					var app;
					try{
_verbose( 'compiling', applicationClassPath , 'from source files' );
							app =  Code.x( applicationClassPath );
			        } catch ( error ) {//try
_error( applicationClassPath + ' could not be compiled:\n'+ error.message );
                        message.request.res.statusCode = 500;
                        message.request.res.write( '{ "error" : "'+applicationClassPath + ' could not be compiled:\n'+ error.message+"}" );
					}
			        if( app ) {
                        var fs = require('fs');
                        var dirName = 'app';
                        if( !fs.existsSync( dirName ) ){
                            fs.mkdirSync( dirName );
                        }//if
		                var fileName = applicationClassPath + '.js';
		                var destination = dirName + '/' + fileName;
		                fs.writeFileSync( destination, app );
		                _trace( 'saving compiled application', applicationClassPath, 'to', destination,'\n'); 
			        	message.request.res.statusCode = 200;
_debug( 'sending',app.length,'bytes to client');
						message.request.res.end( app );
			        }else{//if
_error( 'incomplete app, not sending.' );
                        message.request.res.statusCode = 500;
                        message.request.res.end( 'Error  ' + applicationClassPath + ' not found.' );
                    }//else
				}else{// if app    
                    this._super().process( message );
				}
			}// if message.request
		}//,process
	})//class
);//package
	