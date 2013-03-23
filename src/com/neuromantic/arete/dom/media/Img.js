/*!
 *
 * Img.js
 * com.neuromantic.arete.dom.media.Img
 *
 */
_package( 'com.neuromantic.arete.dom.media',
    _import( 'com.neuromantic.arete.dom.media.Media' ),
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
            this._.nativeWidth = this._.tag.width;
            this._.nativeHeight = this._.tag.height;
            if (this._.height !== null){
                this.height( this._.height );
            }
            if (this._.width !== null){
                this.width( this._.width );
            }
            this._.notify( new LoadingEvent( LoadingEvent.LOADED ) );
        },
        Img : function ( atts ){
            atts = atts || {};
            atts.onload = this._.onload
            this._super( Img.TYPE, atts );
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