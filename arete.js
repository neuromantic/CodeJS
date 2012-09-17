require( './src/Code.js' );
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
_debug('\n ----------------------------------------------------------------- \n|       AA       RRRRRRRR    EEEEEEEEE  TTTTTTTTTTTT  EEEEEEEEEE  |\n|      AAAA      RR      RR  EE              TT       EE          |\n|     AA  AA     RR      RR  EE              TT       EE          |\n|    AAAAAAAA    RRRRRRRR    EEEEEE          TT       EEEEEE      |\n|   AA      AA   RR    RR    EE              TT       EE          |\n|  AA        AA  RR     RR   EE              TT       EE          |\n| AA          AA RR      RR  EEEEEEEEE       TT       EEEEEEEEEE  |\n ----------------------------------------------------------------- \nis running, motherfuckers.');
