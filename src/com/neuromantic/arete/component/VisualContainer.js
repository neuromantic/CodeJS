/*!
 *
 * VisualComponent.js
 * com.neuromantic.arete.component.VisualComponent
 *
 */
_package( 'com.neuromantic.arete.component',
	
 	_import( 'com.neuromantic.arete.component.Component' ),
 	
	_class( 'VisualComponent' )._extends( 'Component', {
		element : null,
		parent : null,
		style :null,
		addClass : function ( className ) {
			var classes = this.element.className.split( ' ' );
			classes.push( className );
			this.element.className = classes.join( ' ' );
		},
		removeClass : function ( className ) {
			var classes = this.element.className.split( ' ' );
			var index = classes.indexOf( className );
			index < 0 ? 0 : classes.splice( index, 1 );
			this.element.className = classes.join( ' ' );
		},
		VisualComponent : function () {
			this.element = document.getElementByTagName( 'div' );
			this.style = this.element.style;
			this.addClass(this._className);
		}//,
	} )
);