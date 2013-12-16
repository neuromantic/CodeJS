/*!
 *
 * Img.js
 * com.neuromantic.arete.dom.elements.media.Img
 *
 */
_package( 'com.neuromantic.arete.dom.elements.media',
    _import( 'com.neuromantic.arete.dom.elements.Media' ),
    _import( 'com.neuromantic.arete.events.LoadingEvent' ),
    _class( 'Img' )._extends( 'Media', {
        static_TYPE : 'img',
        static_all : function ( root ){
            return Element.all(Img, root);
        },
        private_nativeWidth : null,
        private_nativeHeight: null,
        private_loaded: false,
        private_onload : function () {
            this._.loaded = true;
            var parent = this.parent();
            this.remove();
            this._.nativeWidth = this._.tag.width;
            this._.nativeHeight = this._.tag.height;
            this.parent( parent );
            if (this._.height !== null){
                this.height( this._.height );
            }else{
                this.height( this._.nativeHeight );
            }
            if (this._.width !== null){
                this.width( this._.width );
            }else{
                this.width( this._.nativeWidth );
            }
            this._.tag.style.visibility = (this._.visible === false ) ? 'hidden' : 'visible';
            this._.notify( new LoadingEvent( LoadingEvent.COMPLETE ) );
        },
        Img : function ( atts ){
            atts = atts || {};
            var src = atts.src;
            delete atts.src;
            atts.onload = this._.onload;
            this._super( Img.TYPE, atts );
            if( src ){
                this.load( src );
            }
        },
        load : function ( url ){
            this._.tag.style.visibility = 'hidden';
            this._super().load( url );  
        },
        get_loaded : function () {
            return this._.loaded;
        },
        get_aspect : function() {
            return this._.nativeWidth / this._.nativeHeight;
        },
        set_width : function ( value ) {
            if(this._.loaded){
                this._super().width( value );
            }else{
                this._.width = value;
            }
        },
        set_height : function ( value ) {
            if(this._.loaded){
                this._super().height( value );
            }else{
                this._.height = value;
            }
        }
    })
);