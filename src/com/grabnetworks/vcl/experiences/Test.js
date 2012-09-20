/*!
 *
 * Test.js
 * com.neuromantic.arete.component.experiences.Arete
 *
 */
_package( 'com.neuromantic.arete.component.experiences',

	_import( 'com.grabnetworks.vcl.components.widgets.Filmstrip'),
	_import( 'com.grabnetworks.vcl.components.Content'),
	_import( 'com.neuromantic.arete.component.Experience'),
	
	_class( 'Test' )._extends( 'Experience', {
		Test : function( settings ){
			this._super( settings );
			var content = new Content();
			var filmstrip = new Filmstrip();
			this.adopt( filmstrip );
			content.connect( filmstrip );
			this.connect( content );
		}
	})
);