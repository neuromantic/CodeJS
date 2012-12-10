/*!
 *
 * Test.js
 * com.neuromantic.arete.component.experiences.Arete
 *
 */
_package( 'com.neuromantic.arete.component.experiences',

	_import( 'com.neuromantic.arete.component.widget.Experience'),
	_import( 'com.grabnetworks.vcl.components.Content'),
	_import( 'com.grabnetworks.vcl.components.widgets.Thumbstrip'),
	_import( 'com.grabnetworks.vcl.components.widgets.InlinePlayer' ),
	
	_class( 'Test' )._extends( 'Experience', {
		Test : function( settings ){
			this._super( settings );
			var player = new InlinePlayer();
			this.adopt( player );
			player.connect( this );
			this.connect( player );
		}
	})
);