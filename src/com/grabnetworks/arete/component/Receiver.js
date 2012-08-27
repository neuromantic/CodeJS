/*!
 *
 * Receiver.js
 * com.grabnetworks.arete.component.Receiver
 *
 */
_package( 'com.grabnetworks.arete.component',
	_class( 'Receiver', {
		private_message : {},
		input : function ( message ) {
			this._.message = message;
			this.process ( message );
		},
		process : function ( message ) {
		}//,
	})
)
		