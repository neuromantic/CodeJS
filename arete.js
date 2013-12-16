#!/usr/local/bin/node
require( './src/Code.js' );
// Code._.debugging = DebugLevels.VERBOSE;
var path = require('path');
var fs = require('fs');

var args = process.argv;
var applicationClassPath = args[ 3 ];
switch ( args[ 2 ] ){
	case '-x':
_trace( '\nA R E T E | P A C K A G E R\n');
        clearDirs();
		var applicationFileName = args[ 4 ];
		var dirName = 'app';
		fs.mkdirSync( dirName );
		var fileName = (applicationFileName || applicationClassPath + '.js' );
		var destination = dirName + '/' + fileName;
		fs.writeFileSync( destination, Code.x( applicationClassPath ) );
_trace( 'Wrote compiled application', applicationClassPath, 'to', destination,'\n'); 
		break;
    case '-s':
_trace( '\nA R E T E | S E R V E R\n');
        clearDirs();
        Code.r('com.neuromantic.arete.server.Arete', { 
            http: { host: process.env.IP, port: process.env.PORT },
            files: { root: 'files' },
            src: { root: 'src' }
        });
        break;
	default:
		_trace( 'arete.js USAGE___________________________________________________');
        _trace( 'PACKAGER: arete.js -x applicationClassPath [ applicationFileName ]');
    	_trace( 'compiles an executable for the provided application class and saves it in ./app/' );
		_trace( 'optional: provide a file name for the resultant script, default is the full class path plus `.js`\n')
        _trace( 'SERVER: arete.js -s');
    	_trace( 'run the Code.js library as a Web server. requests to /app/applicationClassPath(.js) will return the app as a script in a 200 response\n' );
}
function clearDirs(){
	clearDir('bin');
	clearDir('lib');
	clearDir('app');
}
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