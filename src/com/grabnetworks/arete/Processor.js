/*!
 *
 * Processor.js
 * com.grabnetworks.arete.Processor
 *
 */
_package( 'com.grabnetworks.arete',
	
	_import('com.grabnetworks.arete.Receiver'),
	
	_class( 'Processor' )._extends( 'Receiver', {
		process : function( message ){
			this.output( message  );
		},
		output : function () {}
	})
)
		