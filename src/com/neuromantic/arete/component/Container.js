/*!
 *
 * Container.js
 * com.neuromantic.arete.component.Container
 *
 */
_package( 'com.neuromantic.arete.component',
	
 	_import( 'com.neuromantic.arete.component.Container' ),
 	
	_class( 'Experience' )._extends( 'Container', {
		adopt : function ( widget ) {
			widget.parent = this;
			this._.container.appendChild(widget.element);
		},
		Container : function () {
			this._super();
			this._.container = this.element.appendChild( document.createElementByTagName('div') );
			this.style = this.element.style;
			this.addClass( this._className );
		}//,
	} )
);