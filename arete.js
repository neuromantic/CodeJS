
console.log( '\n========================================\n')
require( './src/Code.js' );
// Code._.debugging = true;
var path = require('path');
var fs = require('fs');
if( path.existsSync( 'bin/' ) ){
    var files = fs.readdirSync( 'bin/' );
console.log('clearing bin');
	while( files.length ){
	var file = 'bin/' + files[0]
    	fs.unlinkSync(file );
    	files = fs.readdirSync( 'bin/' );
    }
console.log('deleting bin');
	fs.rmdirSync('bin')
}
Code.r('com.neuromantic.arete.server.Arete', { 
	http: { host: '127.0.0.1', port: 2207 }, 
	files: 	{ root: 'files' } 
});
console.log( '\nA R E T E | S E R V E R\n')

