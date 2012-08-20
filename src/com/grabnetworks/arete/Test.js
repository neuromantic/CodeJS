/*!
 *
 * Test.js
 * com.grabnetworks.arete.Test
 *
 */
_package( 'com.grabnetworks.arete',
	
	_import('com.grabnetworks.arete.Metronome'),
	_import('com.grabnetworks.arete.Logger'),
	
	_class( 'Test', {
		Test:function(){
			var logger = new Logger();
			var metronome = new Metronome( 500 );
			metronome.connect( logger );
			metronome.start();
		}
	})
);