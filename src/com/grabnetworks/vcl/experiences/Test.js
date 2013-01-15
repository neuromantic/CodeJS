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
    _import( 'com.grabnetworks.vcl.components.widgets.ModalPlayer' ),
    _import( 'com.grabnetworks.vcl.components.widgets.Thumbstrip' ),
	_class( 'Test' )._extends( 'Experience', {
		Test : function( settings ){
			this._super( settings );
            var options = new Options( settings );
            var content = new Content( settings );
			var modal = new ModalPlayer( settings );
            var strip = new Thumbstrip( settings );
            this.adopt( strip );
            options.connect( content );
            content.connect( strip );
            strip.connect( modal );
            modal.connect( this );
		}
	})
);