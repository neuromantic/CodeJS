/*!
 *
 * Container.js
 * com.neuromantic.arete.component.Container
 *
 */
_package( 'com.neuromantic.arete.component',
	
 	_import( 'com.neuromantic.arete.component.Widget' ),
 	
	_class( 'Container' )._extends( 'Widget', {
		private_container: null,
		adopt : function ( widget ) {
			widget.parent = this;
			this._.container.appendChild(widget.element);
		},
		Container : function () {
			this._super();
			this._.container = this.element.appendChild( document.createElement('div') );
			this.style = this.element.style;
			this.addClass( this._className );
		}//,
	} )
);