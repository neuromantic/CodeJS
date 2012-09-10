/*!
 *
 * Receiver.js
 * com.neuromantic.arete.component.Receiver
 *
 */
_package( 'com.neuromantic.arete.component',
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
		