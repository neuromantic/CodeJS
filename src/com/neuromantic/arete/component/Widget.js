/*!
 *
 * Widget.js
 * com.neuromantic.arete.component.Widget
 *
 */
_package( 'com.neuromantic.arete.component',
	
 	_import( 'com.neuromantic.arete.component.Component' ),
 	
	_class( 'Widget' )._extends( 'Component', {
		element : null,
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
		Widget : function () {
			this.element = document.createElement( 'div' );
			this.style = this.element.style;
			this.addClass(this._className);
		}//,
	} )
);