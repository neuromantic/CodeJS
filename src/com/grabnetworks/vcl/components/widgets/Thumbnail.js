/*!
 *
 * Thumbnail.js
 * com.grabnetworks.vcl.components.widgets.Thumbnail
 *
 */
_package( 'com.grabnetworks.vcl.components.widgets',
    _import( 'com.neuromantic.arete.component.widget.Widget' ),
    _import( 'com.neuromantic.arete.dom.media.ImageBox' ),
	_class( 'Thumbnail' )._extends( 'Widget', {
		private_data: null,
        private_img : null,
		private_onClick: function (){
			this.emit( { video: this._.video } );
		},
		private_build : function ( message ){
            if( message.video ){
                var video = message.video;
                var img = new ImageBox();
                img.on( LoadingEvent.LOADED, this._.onLoaded );
                img.load( video.media.preview.url );
                this.add( img );
                this._.img = img;
                this._.data = video;
            }
		},
        private_onLoaded : function ( event ) {
             this._.layout();
        },
        private_layout : function(){
            if( this._.img.loaded ){
                if( this._.img.aspect() > 1 ){
                    if( this._.width !== null ){
                        this._.img.width( this._.width );
                    }
                    if(this._.height !== null ){
                        this._.img.height( this._.width / this._.img.aspect() );
                    }
                }else{
                    if( this._.height !== null ){
                        this._.img.height( this._.height );
                    }
                    if(this._.width !== null ){
                        this._.img.height( this._.height * this._.img.aspect() );
                    }
                }
            }
            this._super()._.layout();
        },
		private_addEvents : function(){
			this.on( 'click', this._.onClick );
		},
        Thumbnail : function ( config ){
            this._super( config );
            this.element.style( { backgroundColor : '#000000' } );
        },
		process : function ( message ) {
			if( message.video ){
				return this.render( message );
			}
			this._super().process( message );
		}
	} )
);