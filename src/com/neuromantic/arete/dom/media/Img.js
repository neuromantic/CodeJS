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
        private_nativeWidth : null,
        private_nativeHeight: null,
        private_onload : function () {
            this.loaded = true;
            this._.nativeWidth = this._.tag.width;
            this._.nativeHeight = this._.tag.height;
            if (this._.height != null){
                this.height( this._.height );
            }
            if (this._.width != null){
                this.width( this._.width );
            }
            this._.notify( new LoadingEvent( LoadingEvent.LOADED ) );
        },
        Img : function ( atts ){
            this._super( 'img', atts );
            this.tag( { onload: this._.onload } );
        },
        loaded : false,
        get_aspect : function() {
            return this._.nativeWidth / this._.nativeHeight;
        },
        set_width : function ( value ) {
            if(this.loaded){
                this._super().width( value );
            }else{
                this._.width = value;
            }
        },
        set_height : function ( value ) {
            if(this.loaded){
                this._super().height( value );
            }else{
                this._.height = value;
            }
        }
    })
);