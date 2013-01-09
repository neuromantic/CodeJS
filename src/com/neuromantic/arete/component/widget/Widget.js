/*!
 *
 * Widget.js
 * com.neuromantic.arete.component.widget.Widget
 *
 */
_package( 'com.neuromantic.arete.component.widget',
	
 	_import( 'com.neuromantic.arete.component.Component' ),
 	
	_class( 'Widget' )._extends( 'Component', {
		Widget: function ( settings ){
			settings = settings || { tag: 'div' };
			settings.tag = settings.tag || 'div';
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
		config : function ( settings ){
			if( settings.tag ) {
				this.element = document.createElement( settings.tag );
				this.element.id = this._className + Math.random().toString().slice(2,12);
				this.element.className = this._className;
			}
			if(settings.parent){
				settings.parent.appendChild( this.element );
				delete settings.parent;
			}
			this._super().config( settings );
            this.render( settings );
		},
		input : function ( message ){
			if(message.render){
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