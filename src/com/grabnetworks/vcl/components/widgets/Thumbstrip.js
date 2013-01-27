/*!
 *
 * Thumbstrip.js
 * com.grabnetworks.vcl.components.widgets.Thumbstrip
 *
 */
_package( 'com.grabnetworks.vcl.components.widgets',
	
	_import( 'com.grabnetworks.vcl.components.widgets.Thumbnail' ),
 	_import( 'com.neuromantic.arete.component.widget.Container' ),
 	
	_class( 'Thumbstrip' )._extends( 'Container', {
		Thumbstrip : function ( settings ){
			this._super( settings );
		},
		private_videos: [],
		private_thumbs: [],
		private_build : function ( config ){
			var videos = this._.videos;
			for( var n = 0; n < videos.length; n++ ){
				var video = videos[n].video;
				var thumb = new Thumbnail( { video : video } );
				this.adopt( thumb );
				thumb.connect( this );
				this._.thumbs.push( thumb );
			}
		},
        private_layout : function (){
            for (var i in this._.thumbs){
                var thumb = this._.thumbs[ i ];
                if( this._.width > this._.height){//horizontal
                    thumb.height( this._.height );
                    thumb.width( this._.height / 0.75 );
                }else{
                    thumb.height( this._.width * 0.75 );
                    thumb.width( this._.width );
                }
            }
            this._super()._.layout();
        },
		process : function ( message ) {
			if ( message.videos ) {
				this._.videos = message.videos;
                this.render();
			}
			this._super().process( message );
		}
	} )
);