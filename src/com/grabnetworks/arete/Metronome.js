/*!
 *
 * Metronome.js
 * com.grabnetworks.arete.Metronome
 *
 */
_package( 'com.grabnetworks.arete',
	
 	_import( 'com.grabnetworks.arete.Component' ),
 	
	_class( 'Metronome' )._extends( 'Component', {
		private_count : 0,
		private_rate : 1000,
		private_interval : null,
		Metronome : function( rate ) {
			this._.rate = rate 
		},
		start : function ( rate ) {
			rate = rate || this._.rate;
			this._.interval = setInterval( this._.emit, rate );
			this._.rate = rate;
		},
		stop : function () {
			clearInterval( this._.interval );
		},
		private_emit : function ( message ) {
		    this.emit( { count: this._.count++ } );
		}
	})
)
		