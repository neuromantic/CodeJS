/*!
 *
 * Widget.js
 * com.neuromantic.arete.component.widget.Widget
 *
 */
_package( 'com.neuromantic.arete.component.widget',
	
     _import( 'com.neuromantic.arete.component.Component' ),
     _import( 'com.neuromantic.arete.dom.Div' ),
 	
	_class( 'Widget' )._extends( 'Component', {
        private_width : null,
        private_height : null,
		Widget: function ( settings ){
            this.element = new Div();
            this.element.style( { position: 'absolute' } );
			this._super( settings );
		},
		element : null,
        get_style : function(){
            return this._.tag.style;   
		},
        set_style : function( value ){
            for ( var key in value){
                this._.tag.style[key] = value[ key ];
            }
		},
        set_width : function ( value ){
            this._.width = value;
            this._.layout();
        },
        get_width : function () {
            return this._.width;
        },
        set_height : function ( value ){
            this._.height = value;
            this._.layout();
        },
        get_height : function () {
            return this._.height;
        },
        on: function ( eventName, handler ){
			switch (eventName){
				case 'click':
					this.element.onclick = handler;
			}
		},
		add : function ( element ) {
			this.element.append( element );
		},
		config : function ( settings ){
			if(settings.parent){
				new Element(settings.parent).append( this.element );
				delete settings.parent;
			}
            if(settings.width){
                this._.width = settings.width;
            }
            if(settings.height){
                this._.height = settings.height;
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
            this._.layout( config );
		},
		private_build : function () {
		},
		private_addEvents : function () {
		},
        private_layout : function () {
            if(this.element){
                this.element.width( this._.width );
                this.element.height( this._.height);
            }
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