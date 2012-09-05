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
						var ast = require("uglify-js").parser;
						var ugg = require("uglify-js").uglify;

						
_debug( 'compressing code:', code.length, 'bytes raw' );	
						code = ast.parse(code); // parse code and get the initial AST
						code = ugg.ast_mangle(code); // get a new AST with mangled names
						code = ugg.ast_squeeze(code); // get an AST with compression optimizations
						code = ugg.gen_code(code); // compressed code here
_debug( 'compressing app:', app.length, 'bytes raw' );
						app = ast.parse(app); // parse code and get the initial AST
						app = ugg.ast_mangle(app); // get a new AST with mangled names
						app = ugg.ast_squeeze(app); // get an AST with compression optimizations
						app = ugg.gen_code(app); // compressed code here			
//						exec = ast.parse(exec); // parse code and get the initial AST
//						exec = ugg.ast_mangle(exec); // get a new AST with mangled names
//						exec = ugg.ast_squeeze(exec); // get an AST with compression optimizations
//						exec = ugg.gen_code(exec); // compressed code here
_debug( 'adding code:', code.length, 'bytes');
						message.http.res.write( code );
_debug( 'adding app:', app.length, 'bytes');
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
	