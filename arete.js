#!/usr/local/bin/node
console.log( '\nA R E T E | P A C K A G E R\n');
require( './src/Code.js' );
//Code._.debugging = DebugLevels.DEBUG;
var path = require('path');
var fs = require('fs');

var args = process.argv;
var applicationClassPath = args[ 3 ];
switch ( args[ 2 ] ){
	case '-x':	
		clearDir('bin');
		clearDir('lib');
		clearDir('app');
		var applicationFileName = args[ 4 ];
		var dirName = 'app'
		fs.mkdirSync( dirName );
		var fileName = (applicationFileName || applicationClassPath + '.js' );
		var destination = dirName + '/' + fileName
		fs.writeFileSync( destination, Code.x( applicationClassPath ) );
		_trace( 'Compiled application', applicationClassPath, 'to', destination,'\n');less 
		break;
	default:
		_trace( 'usage: arete.js -x applicationClassPath [ applicationFileNamee ]');
		_trace( 'compiles an executable for the provided application class and saves it in ./app/' );
		_trace( 'optional: provide a file name for the resultant script, default is the full class path plus `.js`\n')
}
// Code.r('com.neuromantic.arete.server.Arete', { 
// 	http: { host: process.env.IP, port: process.env.PORT },
//     files: { root: 'files' },
//     src: { root: 'src' }
// });
function clearDir ( dir ) {
	var dirPath = dir + '/';
	if( path.existsSync( dir ) ){
        var files = fs.readdirSync( dirPath );
		while( files.length ){
			var file = dirPath + files[0];
            fs.unlinkSync( file );
            files = fs.readdirSync( dirPath );
        }
		fs.rmdirSync( dir );
	}

}