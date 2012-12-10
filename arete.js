console.log( '\n========================================\n')
require( './src/Code.js' );
// Code._.debugging = true;
var path = require('path');
var fs = require('fs');
clearDir('bin');
clearDir('lib');
Code.r('com.neuromantic.arete.server.Arete', { 
	http: { host: '127.0.0.1', port: 2207 }, 
	files: 	{ root: 'files' } 
});
console.log( '\nA R E T E | S E R V E R\n');
function clearDir ( dir ) {
	var dirPath = dir + '/'
	if( path.existsSync( dir ) ){
	    var files = fs.readdirSync( dirPath );
console.log('clearing', dir);
		while( files.length ){
			var file = dirPath + files[0]
	    	fs.unlinkSync( file );
	    	files = fs.readdirSync( dirPath );
	    }
console.log('deleting', dir);
		fs.rmdirSync( dir )
	}
}

