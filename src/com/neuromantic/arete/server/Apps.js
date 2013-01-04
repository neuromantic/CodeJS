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
					console.log('Apps');
					message.request.res.setHeader("Content-Type", 'text/javascript' );
_debug( 'compiling', classPath);
                    var code;
					try{
_debug( 'getting Code from file system');
						code = Code();
					}catch (error){
_debug( 'src/Code.js could not be read:\n'+ error.message);
						message.request.res.statusCode = 500;
						message.request.res.write( '{ "error" : "src/Code.js could not be read:\n'+ error.message+'}' );
				    }
					var app;
					try{
_debug( 'compiling', classPath , 'from source files' );
							app =  Code.c( classPath );
			        } catch ( error ) {//try
_debug( classPath + ' could not be compiled:\n'+ error.message);
			        	message.request.res.statusCode = 500;
			        	message.request.res.write( '{ "error" : "'+classPath + ' could not be compiled:\n'+ error.message+"}" );
					}
_debug( 'creating exec statement');
					var exec = 	'var scripts = document.getElementsByTagName( "script" );\n'+
								'var script = scripts[ scripts.length - 1 ];\n'+
								'var query = script.src.split("?")[1];\n'+
								'var settings = {};\n'+
								'var list = query.split( "&");\n'+
								'for (var i in list){\n'+
									'var pair = list[i].split("=");\n'+
									'settings[pair[0]] = pair[1];\n'+
								' };\n'+
								'settings.parent = script.parentNode;\n'+
								'Code.x("' + classPath + '",settings);';
			        if( app && code && exec ) {
			        	message.request.res.statusCode = 200;
_debug( 'adding code:', code.length, 'bytes');
						message.request.res.write( code );
_debug( 'adding app:', app.length, 'bytes');
						message.request.res.write( app );		
_debug( 'adding exec:', exec );

						message.request.res.end( exec );
			        }//if
				}// if
			}// if message.request
			this._super().process( message );
		}//,process
	})//class
);//package
	