/*!
 *
 * Widget.js
 * com.neuromantic.arete.component.Widget
 *
 */
_package( 'com.neuromantic.arete.component',
	
 	_import( 'com.neuromantic.arete.component.Component' ),
 	
	_class( 'Widget' )._extends( 'Component', {
		Widget: function ( settings ){
			settings = settings || {element: 'div'};
			settings.element = settings.element || 'div';
			this._super( settings );
		},
		element : null,
		style :null,
		on: function ( eventName, handler ){
			switch (eventName){
				case 'click':
					this.element.onclick = handler;
			}
		},
		add : function ( elementType ) {
			var element = document.createElement( elementType );
			this.element.appendChild( element );
			return element;
		},
		input : function ( message ){
			if(message.render){
_debug (this, 'received render', Code._.util.stringify( message.render ))
				this.render( message.render );
			}
			this._super().input(message);
		},
		render : function ( config ){
			this._.build( config );
			this._.addEvents( config );
		},
		private_build : function( config ){
		},
		private_addEvents : function( config ){
		},
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
		}
	} )
);