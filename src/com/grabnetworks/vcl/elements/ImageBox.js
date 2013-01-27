/*!
 *
 * ImageBox.js
 * com.grabnetworks.vcl.elements.ImageBox
 *
 */
_package( 'com.grabnetworks.vcl.elements',
    _import( 'com.neuromantic.arete.dom.media.Img' ),
    _import( 'com.neuromantic.arete.dom.Div' ),
    _class( 'ImageBox')._extends( 'Div', {
        private_img : null,
        on : null,//
        ImageBox : function ( atts ) {
            this._super( atts );
            this._.img = new Img();
            this.on = this._.img.on;//adapt events from img
        },
        set_width : function ( value ) {
            this._super().width( value );
            if(this._.img){
                this._.img.width( value );
                this._img.x( ( this._.width - this._.img.width) * 0.5 );
            }
        },
        set_height : function ( value ) {
            this._super().height( value );
            if(this._.img){
                this._.img.height( value );
                this._img.y( ( this._.width - this._.img.width) * 0.5 );
            }
        }
    } )
);
        