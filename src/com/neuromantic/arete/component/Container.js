/*!
 *
 * Container.js
 * com.neuromantic.arete.component.Container
 *
 */
_package( 'com.neuromantic.arete.component',
	
 	_import( 'com.neuromantic.arete.component.Widget' ),
 	
	_class( 'Container' )._extends( 'Widget', {
		adopt : function ( widget ) {
			widget.parent = this;
			this.element.appendChild( widget.element );
		}
	} )
);