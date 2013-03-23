/*!
 *
 * ImageBox.js
 * com.grabnetworks.vcl.elements.ImageBox
 *
 */
_package( 'com.grabnetworks.vcl.elements',
    _import( 'com.neuromantic.arete.dom.media.Img' ),
    _import( 'com.neuromantic.arete.fx.Tween' ),
    _import( 'com.neuromantic.arete.events.LoadingEvent' ),
    _import( 'com.neuromantic.arete.dom.Div' ),
    _class( 'ImageBox')._extends( 'Div', {
        private_img : null,
        private_onLoaded : function ( event ){
            this._.layout();
            Tween.to( this._.img, 0.25, { autoAlpha: 1 } );
        },
        private_layout : function () {
            if( this._.img.loaded() ){
                if( this._.img.aspect() > 1 ){
                    if( this._.width !== null ){
                        this._.img.width( this._.width );
                    }
                    if(this._.height !== null ){
                        this._.img.height( this._.width / this._.img.aspect() );
                        this._.img.y( ( this._.height - this._.img.height() ) * 0.5 );
                    }
                }else{
                    if( this._.height !== null ){
                        this._.img.height( this._.height );
                    }
                    if(this._.width !== null ){
                        this._.img.height( this._.height * this._.img.aspect() );
                    }
                    this._.img.x( ( this._.width - this._.img.width() ) * 0.5 );
                }
            }
        },
        ImageBox : function ( atts ) {
            this._super( atts );
            this._.img = new Img();
            this._.img.on( LoadingEvent.LOADED, this._.onLoaded );
            this._.img.autoAlpha( 0 );
            this.append( this._.img );
            this._expose( this._.img );
            this.style( { backgroundColor : '#000000', overflow: 'hidden' } );
        },
        set_width : function ( value ) {
            this._super().width( value );
            this._.layout();
        },
        set_height : function ( value ) {
            this._super().height( value );
            this._.layout();
        }
    } )
);
        