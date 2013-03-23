/*!
 *
 * Thumbnail.js
 * com.grabnetworks.vcl.components.widgets.Thumbnail
 *
 */
_package( 'com.grabnetworks.vcl.components.widgets',
    _import( 'com.neuromantic.arete.component.widget.Widget' ),
    _import( 'com.grabnetworks.vcl.elements.ImageBox' ),
	_class( 'Thumbnail' )._extends( 'Widget', {
		private_data: null,
        private_img : null,
		private_onClick: function (){
_trace( 'click thumb');
			this.emit( { video: this._.data } );
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
        private_layout : function () {
            this._.img.width( this._.width);
            this._.img.height( this._.height );
        },
        private_onLoaded : function ( event ) {
             this._.layout();
        },
		private_addEvents : function(){
			this.element.on( MouseEvent.CLICK, this._.onClick );
		},
        Thumbnail : function ( config ){
            this._super( config );
        },
        
		process : function ( message ) {
			if( message.video ){
				return this.render( message );
			}
			this._super().process( message );
		}
	} )
);