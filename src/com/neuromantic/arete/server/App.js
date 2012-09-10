/*!
 *
 * App.js
 * com.neuromantic.arete.Logger
 *
 */
_package( 'com.neuromantic.arete.server',
 	_import( 'com.neuromantic.arete.component.Component' ),
	_class( 'App' )._extends( 'Component', {
		App : function( ) {
		},
		process : function ( message ) {
			var url = require( 'url' );
			var fs = require( 'fs');
			var path = require( 'path');
			var route = url.parse( message.http.req.url, true )
			if( message.http ) {
				var loc = route.path;
				if( loc.indexOf('/') === 0 ){
					loc = loc.substring(1);
				}//if
				var classPath;
				if ( loc.indexOf( 'app' ) === 0 ){
					classPath = loc.split('/')[1].split('.js?')[0];
					console.log('app')
					message.http.res.setHeader("Content-Type", 'text/javascript' );
_debug( 'compiling', classPath);
					try{
_debug( 'getting Code from file system');
						var code = Code();
					}catch (error){
	_debug( 'src/Code.js could not be read:\n'+ error.message);
						message.http.res.statusCode = 500;
				        message.http.res.write( '{ "error" : "src/Code.js could not be read:\n'+ error.message+'}' );
				    }
					var app;
					var bin = 'bin/'+classPath;
					try{
_debug( 'compiling', classPath , 'from source files' );
							app =  Code.c( classPath );
			        } catch ( error ) {//try
_debug( classPath + ' could not be compiled:\n'+ error.message);
						message.http.res.statusCode = 500;
						message.http.res.write( '{ "error" : "'+classPath + ' could not be compiled:\n'+ error.message+"}" );
					}
_debug( 'creating exec statement');
					var exec = 'Code.x("' + classPath + '",'+JSON.stringify(route.query)+');';
			        if( app && code && exec ) {
						message.http.res.statusCode = 200;
_debug( 'adding code:', code.length, 'bytes');
						message.http.res.write( code );
_debug( 'adding app:', app.length, 'bytes');
						message.http.res.write( app );		
_debug( 'adding exec:', exec );
						message.http.res.end( exec );
			        }//if
				}// if
			}// if message.http
			this._super.process( message );
		}//,process
	})//class
)//package
	