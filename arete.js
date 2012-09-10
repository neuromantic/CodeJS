require( './src/Code.js' );
_debug('|||||||||||||||||||||||ARETE SERVER|||||||||||||||||||||||||||');
var path = require('path');
var fs = require('fs');
if( path.existsSync( 'bin/' ) ){
    var files = fs.readdirSync( 'bin/' );
	while( files.length ){
	var file = 'bin/' + files[0]
_debug('deleting', file);
    	fs.unlinkSync(file );
    	files = fs.readdirSync( 'bin/' );
    }
    _debug('deleting bin/');
	fs.rmdirSync('bin')
}
Code.r('com.neuromantic.arete.Arete');