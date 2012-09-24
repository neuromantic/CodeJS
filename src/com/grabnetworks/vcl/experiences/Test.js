/*!
 *
 * Test.js
 * com.neuromantic.arete.component.experiences.Arete
 *
 */
_package( 'com.neuromantic.arete.component.experiences',

	_import( 'com.neuromantic.arete.component.Experience'),
	_import( 'com.grabnetworks.vcl.components.Content'),
	_import( 'com.grabnetworks.vcl.components.widgets.Thumbstrip'),
	_import( 'com.grabnetworks.vcl.components.widgets.InlinePlayer' ),
	
	_class( 'Test' )._extends( 'Experience', {
		Test : function( config ){
			this._super( config );
			var content = new Content();
			var thumbstrip = new Thumbstrip();
			var player = new InlinePlayer();
			player.style.height = '360px';
			player.style.width = '640px';
			this.adopt( player );
			this.adopt( thumbstrip );
			content.connect( thumbstrip );
			thumbstrip.connect( player );
			player.connect( this );
			this.connect( content );
		}
	})
);