/*!
 *
 * Processor.js
 * com.grabnetworks.arete.component.Processor
 *
 */
_package( 'com.grabnetworks.arete.component',
	
	_import('com.grabnetworks.arete.component.Receiver'),
	
	_class( 'Processor' )._extends( 'Receiver', {
		process : function( message ){
			this.output( message );
		},
		output : function () {}
	})
)
		