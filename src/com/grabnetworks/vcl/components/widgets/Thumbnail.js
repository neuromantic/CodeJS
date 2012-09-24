/*!
 *
 * Thumbnail.js
 * com.grabnetworks.vcl.components.widgets.Thumbnail
 *
 */
_package( 'com.grabnetworks.vcl.components.widgets',

 	_import( 'com.neuromantic.arete.component.Widget' ),
 	
	_class( 'Thumbnail' )._extends( 'Widget', {
		private_video: null,
		private_onClick: function (){
			this.emit( { video: this._.video } );
		},
		private_build : function ( video ){
			var img = this.add( 'img' );
			img.src = video.media.thumbnail.url;
			this.element.video = video;
			var title = this.add( 'span' );
			title.innerHTML = video.title;
			this._.video = video
		
		},
		private_addEvents : function(){
			this.on( 'click', this._.onClick )	
		},
		process : function ( message ) {
			if(message.video){
				return this.render( message.video );
			}
			this._super().process( message );
		}
	} )
);