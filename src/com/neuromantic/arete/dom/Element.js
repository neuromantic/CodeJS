/*!
 *
 * Element.js
 * com.neuromantic.arete.dom.Element
 *
 */
_package( 'com.neuromantic.arete.dom',
_import('com.neuromantic.arete.events.Notifier' ),
    _class( 'Element' )._extends( 'Notifier', {
        static_byID :function ( id ){
            var el = document.getElementById( id );
            if( el ){
                return new Element( el );
            }
            return null;
        },
        static_byClassName :function ( className ){
            var els = document.getElementsByClassName( className );
            var list = [];
            if( els ){
                for ( var i in els){
                    list[i] = new Element( els[i] );
                }
            }
            return list;
        },
        private_tag: null,
        private_alpha : 1,
        private_visible : null,
        private_width : null,
        private_height : null,
        Element : function ( tag, atts ){
            if( tag ){
            if( typeof tag.nodeType === 'number' && tag.attributes && tag.childNodes && tag.cloneNode ){
                this._.tag = tag;
            }else if ( typeof tag === 'string'){
                try{
                    this._.tag = document.createElement( tag );
                }catch( error ){
                    throw new TypeError( 'Arete Elements require a valid HTML tag name');
                }
            }else{
                throw new TypeError( 'Arete Elements may only be instantiated with an HTML node or tag name string argument');
            }
                this.tag( atts );
            }else{
                throw new TypeError( 'Arete Elements require an argument on instantiation' );
            }
        },
        append : function ( child ){
            this._.tag.appendChild( child.tag() );
        },
        replace : function( newChild, oldChild){
            this._.tag.replaceChild( newChild.tag(), oldChild.tag() );
        },
        remove : function( child ){
            this._.tag.removeChild( child.tag() );
        },
        set_tag : function ( value ) {
            for ( var a in value){
                if(a === 'style'){
                    this.style( value.style );
                }else{
                    this._.tag[a] = value[a];
                }
            }
        },
        get_tag : function () {
            return this._.tag;
        },
        set_parent : function ( parent ){
            parent.append( this );
        },
        get_parent : function () {
            return new Element(this._.tag.parentNode);
        },
        set_text : function( value ){
            this.tag( { innerHTML : value } );
        },
        get_text : function (){
            return this._.tag.innerText || this._.tag.textContent;
        },
        set_style : function ( value ){
            for ( var s in value ){
                this._.tag.style[s] = value[s];
            }
        },
        get_style : function () {
            return this._.tag.style;
        },
        get_height : function( ) {
            this._.height = this._.height || this._.tag.offsetHeight || 'NA';
			return this._.height;
		},
		set_height : function( value ) {
            this._.height = value;
			this._.tag.style.height = value +'px';
		},
		get_width : function () {
                this._.width = this._.width || this._.tag.offsetWidth || 'NA';
				return this._.width;
		},
		set_width : function( value ) {
            this._.width = value;
			this._.tag.style.width = value + 'px';
		},
		get_alpha : function () {
				return this._.alpha;
		},
		set_alpha : function ( value ) {
			this._.tag.style.opacity = value;
            this._.tag.style.filter = 'alpha(opacity=' + value * 100 + ')';
            this._.alpha = value;
		},
		get_visible : function () {
				if(this._.visible === null){
					this._.visible = this._.tag.style.visible != 'hidden';
				}
				return this._.visible;
		},
		set_visible : function ( value ) {
			this._.visible = value;
			this._.element.tag.style.visible = this._.visible ? 'visible' : 'hidden';
			
		},
		get_autoAlpha : function () {
				return this._.alpha;
		},
		set_autoAlpha : function (value) {
			this.alpha( value );
			this.visible( this._.alpha > 0 );
		}
    })
);
    