console.log( '\n========================================\n' );
require( './src/Code.js' );
Code._.debugging = DebugLevels.DEBUG;
var path = require('path');
var fs = require('fs');
clearDir('bin');
clearDir('lib');
Code.r('com.neuromantic.arete.server.Arete', { 
	http: { host: process.env.IP, port: process.env.PORT },
    files: {root:'files'},
    src: {root: 'src'}
});
_info( '\nA R E T E | S E R V E R\n');
function clearDir ( dir ) {
	var dirPath = dir + '/';
	if( path.existsSync( dir ) ){
        var files = fs.readdirSync( dirPath );
_verbose('clearing', dir);
		while( files.length ){
			var file = dirPath + files[0];
            fs.unlinkSync( file );
            files = fs.readdirSync( dirPath );
        }
_verbose('deleting', dir);
		fs.rmdirSync( dir );
	}

}