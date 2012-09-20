require( './src/Code.js' );
Code._.debugging = false;
_debug('\n ----------------------------------------------------------------\n|      AA      RRRRRRRR    EEEEEEEE    TTTTTTTTTT  EEEEEEEE      |\n|     AAAA     RRRRRRRRRR  EEEEEEEEE  TTTTTTTTTTTT EEEEEEEEE     |\n|    AA  AA     RR    RRR  EE              TTT      EE           |\n|    AA  AAA    RR   RRR   EEEEEE          TTT      EEEEEE       |\n|   AAAAAAAAA   RRRRRRRR    EE              TTT      EE          |\n|  AAA     AAA  RRR   RRR   EEEEEEEEE       TTT      EEEEEEEEE   |\n| AAA       AAA RRR    RRR  EEEEEEEE        TT       EEEEEEEE    |\n ----------------------------------------------------------------\n');
var path = require('path');
var fs = require('fs');
if( path.existsSync( 'bin/' ) ){
    var files = fs.readdirSync( 'bin/' );
	while( files.length ){
	var file = 'bin/' + files[0]
    	fs.unlinkSync(file );
    	files = fs.readdirSync( 'bin/' );
    }
    _debug('deleting bin/');
	fs.rmdirSync('bin')
}
Code.r('com.neuromantic.arete.Arete', { 
	server: { host: '127.0.0.1', port: 2207 }, 
	files: 	{ root: 'files' } 
});
console.log( '\nA R E T E | S E R V E R\n')

