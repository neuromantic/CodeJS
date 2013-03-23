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
                console.log( 'APP index', loc.indexOf( 'app' ) );
                var pathArray = loc.split( '/' );

				if( loc.indexOf('/') === 0 ){
					loc = loc.substring(1);
				}//if
				var classPath;
				if ( pathArray[1] == 'app' ){
_debug( 'app requested')
					classPath = pathArray[2].split('.js?')[0];
_debug( 'compiling', classPath );
					message.request.res.setHeader( 'Content-Type', 'text/javascript' );
                    var init = '( function (){\n';
                    var code;
					try{
_debug( 'getting Code.js from file system' );
						code = Code();
					}catch (error){
_error( 'src/Code.js could not be read:\n'+ error.message );
						message.request.res.statusCode = 500;
						message.request.res.write( '{ "error" : "src/Code.js could not be read:\n'+ error.message+'}' );
				    }
					var app;
					try{
_verbose( 'compiling', classPath , 'from source files' );
							app =  Code.c( classPath );
			        } catch ( error ) {//try
_error( classPath + ' could not be compiled:\n'+ error.message );
                        message.request.res.statusCode = 500;
                        message.request.res.write( '{ "error" : "'+classPath + ' could not be compiled:\n'+ error.message+"}" );
					}
_verbose( 'creating exec statement' );
					var exec = 	'var scripts = document.getElementsByTagName( "script" );\n'+
								'var script = scripts[ scripts.length - 1 ];\n'+
								'var query = script.src.split("?")[1];\n'+
                                'if( query.length > 0 ){\n'+
								'\tvar settings = {};\n'+
								'\tvar list = query.split( "&");\n'+
								'\tfor (var i = 0; i < list.length; i++ ){\n'+
								'\t\tvar pair = list[i].split("=");\n'+
								'\t\tsettings[pair[0]] = pair[1];\n'+
								'\t};\n'+
								'\tsettings.parent = script.parentNode;\n'+
								'\tCode.x("' + classPath + '",settings);\n'+
                                '}\n'+
                                '})();';
_debug( 'Code.js:', code.length, 'bytes' );
_debug( 'init statement:', init.length, 'bytes' );
_debug( 'App:', app.length, 'bytes' );
_debug( 'exec statement:', exec.length, 'bytes');
			        if( init && app && code && exec ) {
_debug( 'sending app to client');
			        	message.request.res.statusCode = 200;
    					message.request.res.write( code );
        				message.request.res.write( init );
						message.request.res.write( app );
						message.request.res.end( exec );
			        }else{//if
_error( 'incomplete app, not sending.' );
                        message.request.res.statusCode = 500;
                        message.request.res.end( 'Error  ' + classPath + ' not found.' );
                    }//else
				}else{// if app    
                    this._super().process( message );
				}
			}// if message.request
		}//,process
	})//class
);//package
	