/*!
 *
 * Widget.js
 * com.neuromantic.arete.component.Widget
 *
 */
_package( 'com.neuromantic.arete.component',
	
 	_import( 'com.neuromantic.arete.component.Component' ),
 	
	_class( 'Widget' )._extends( 'Component', {
		Widget: function ( config ){
			config = config || {element: 'div'};
			config.element = config.element || 'div';
			this._super( config );
		},
		element : null,
		style :null,
		addClass : function ( className ) {
			var elementClass = this.element.className;
			if( elementClass.indexOf( className ) === -1 ){
				this.element.className +=  elementClass.length ? ' ' : '' +className ;
			}
		},
		removeClass : function ( className ) {
			var classes = this.element.className.split( ' ' );
			var index = classes.indexOf( className );
			index < 0 ? 0 : classes.splice( index, 1 );
			this.element.className = classes.join( ' ' );
		},
		config : function( config ){
			this.element = document.createElement( config.element );
			this.style = this.element.style;
			this.addClass(this._className);
		}
	} )
);