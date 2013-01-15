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
		Thumbstrip : function (){
			this._super( { element: 'ul'} );
		},
		private_videos: [],
		private_thumbs: [],
		private_build : function ( config ){
			this.element.style.listStyleType = 'none';
			this.element.style.margin = 0;
			this.element.style.padding = 0;
			var videos = this._.videos;
			for( var n = 0; n < videos.length; n++ ){
				var video = videos[n].video;
				var thumb = new Thumbnail( { element: 'li' } ) 
				this.adopt( thumb );
				thumb.input( { video: video } );
				thumb.connect( this );
				this._.thumbs.push( thumb );
			}
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