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
				if ( loc.indexOf( 'App.js' ) === 0 ){
					classPath = route.query.src
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
					var app;
					var bin = 'bin/'+classPath;
					try{
						if(! path.existsSync( 'bin/')){
							fs.mkdirSync('bin/');
						}
						if( path.existsSync( bin ) ){
							app = fs.readFileSync( bin ).toString();
_debug( 'using bin:', bin );
						}else{
							app =  Code.c( classPath );
_debug( 'compiling', classPath , 'from source files' );
						}
			        } catch ( error ) {//try
_debug( classPath + ' could not be compiled:\n'+ error.message);
						message.http.res.statusCode = 500;
						message.http.res.write( '{ "error" : "'+classPath + ' could not be compiled:\n'+ error.message+"}" );
					}
_debug( 'creating exec statement');
					var exec = 'Code.x("' + classPath + '");';
			        if( app && code && exec ) {
						message.http.res.statusCode = 200;
						var ast = require("uglify-js").parser;
						var ugg = require("uglify-js").uglify;

						
_debug( 'compressing code:', code.length, 'bytes raw' );	
						code = ast.parse(code); // parse code and get the initial AST
						code = ugg.ast_mangle(code); // get a new AST with mangled names
						code = ugg.ast_squeeze(code); // get an AST with compression optimizations
						code = ugg.gen_code(code); // compressed code here		
_debug( 'adding code:', code.length, 'bytes');
						message.http.res.write( code );
_debug( 'adding app:', app.length, 'bytes');
						message.http.res.write( app );		
_debug( 'adding exec' );
						message.http.res.write( exec );
			        }//if
				}// if
			}// if message.http
			this.output( message );
		}//,process
	})//class
)//package
	