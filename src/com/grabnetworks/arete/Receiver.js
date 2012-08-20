/*!
 *
 * Receiver.js
 * com.grabnetworks.arete.Receiver
 *
 */
_package( 'com.grabnetworks.arete',
	_class( 'Receiver', {
		input : function ( message ) {
			this.process ( message );
		},
		process : function ( message ) {}
	})
)
		