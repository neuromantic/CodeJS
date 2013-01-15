/*!
 *
 * Apps.js
 * com.neuromantic.arete.Apps
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
				if( loc.indexOf('/') === 0 ){
					loc = loc.substring(1);
				}//if
				var classPath;
				if ( loc.indexOf( 'app' ) === 0 ){
					classPath = loc.split('/')[1].split('.js?')[0];
					message.request.res.setHeader("Content-Type", 'text/javascript' );
_verbose( 'compiling', classPath );
                    var code;
					try{
_debug( 'getting Code.js from file system' );
						code = Code();
_debug( ':::', code.length, 'bytes');
					}catch (error){
_error( 'src/Code.js could not be read:\n'+ error.message);
						message.request.res.statusCode = 500;
						message.request.res.write( '{ "error" : "src/Code.js could not be read:\n'+ error.message+'}' );
				    }
					var app;
					try{
_verbose( 'compiling', classPath , 'from source files' );
							app =  Code.c( classPath );
			        } catch ( error ) {//try
_verbose( classPath + ' could not be compiled:\n'+ error.message);
                        message.request.res.statusCode = 500;
                        message.request.res.write( '{ "error" : "'+classPath + ' could not be compiled:\n'+ error.message+"}" );
					}
_verbose( 'creating exec statement');
					var exec = 	'( function (){\n'+
                                'var scripts = document.getElementsByTagName( "script" );\n'+
								'var script = scripts[ scripts.length - 1 ];\n'+
								'var query = script.src.split("?")[1];\n'+
								'var settings = {};\n'+
								'var list = query.split( "&");\n'+
								'for (var i in list){\n'+
									'var pair = list[i].split("=");\n'+
									'settings[pair[0]] = pair[1];\n'+
								' };\n'+
								'settings.parent = script.parentNode;\n'+
								'Code.x("' + classPath + '",settings);\n'+
                                '})();';
_debug( 'Code.js:', code.length, 'bytes' );
_debug( 'App:', app.length, 'bytes' );
_debug( 'exec statement:', exec.length, 'bytes');
			        if( app && code && exec ) {
_debug( 'sending app to client');
			        	message.request.res.statusCode = 200;
						message.request.res.write( code );
						message.request.res.write( app );
						message.request.res.end( exec );
			        }else{//if
_error( 'incomplete app, not sending.');
                        message.request.res.statusCode = 404;
                        message.request.res.end( 'App ' + classPath + ' not found.' );
                    }//else
				}// if
			}// if message.request
			this._super().process( message );
		}//,process
	})//class
);//package
	