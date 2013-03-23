/*!
 *
 * Test.js
 * com.neuromantic.arete.component.experiences.Test
 *
 */
_package( 'com.grabnetworks.vcl.experiences',
	_import( 'com.neuromantic.arete.component.widget.Experience'),
    _import( 'com.grabnetworks.vcl.components.Options' ),
    _import( 'com.grabnetworks.vcl.components.Content' ),
    _import( 'com.grabnetworks.vcl.components.widgets.InlinePlayer' ),
    _import( 'com.grabnetworks.vcl.components.widgets.Thumbstrip' ),
    _import( 'com.grabnetworks.vcl.components.layouts.Stack' ),
	_class( 'Test' )._extends( 'Experience', {
		Test : function( settings ){
			this._super( settings );
            delete settings.width;
            delete settings.height;
            var options = new Options( settings );
            var content = new Content( settings );
			var player = new InlinePlayer( settings );
            var strip = new Thumbstrip( settings );
            var layout = new Stack( [player, strip], this.width() );
            this.adopt( player );
            this.adopt( strip );
            layout.layout();
            options.connect( content );
            content.connect( strip );
            strip.connect( player );
            player.connect( this );
		}
	})
);