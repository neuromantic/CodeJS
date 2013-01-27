/*!
 *
 * Container.js
 * com.neuromantic.arete.component.widget.Container
 *
 */
_package( 'com.neuromantic.arete.component.widget',
 	_import( 'com.neuromantic.arete.component.widget.Widget' ),
	_class( 'Container' )._extends( 'Widget', {
		adopt : function ( widget ) {
			widget.parent = this;
			this.element.append( widget.element );
		}
	})
);