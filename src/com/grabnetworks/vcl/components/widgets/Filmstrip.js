/*!
 *
 * Filmstrip.js
 * com.grabnetworks.vcl.components.widgets.Filmstrip
 *
 */
_package( 'com.grabnetworks.vcl.components.widgets',

 	_import( 'com.neuromantic.arete.component.Widget' ),
 	
	_class( 'Filmstrip' )._extends( 'Widget', {
		Filmstrip : function (){
			this._super( { element: 'ul'} );
		},
		private_render : function ( videos ){
			this.element.style.listStyleType = 'none';
			for( var n = 0; n < videos.length; n++ ){
				var video = videos[n].video;
				var li = document.createElement( 'li' );
				var img = document.createElement( 'img' );
				var title = document.createElement( 'span' );
				img.src = video.media.thumbnail.url;
				li.appendChild( img );
				title.innerHTML = video.title;
				li.appendChild( title);
				this.element.appendChild( li );
			}
		},
		process : function ( message ) {
			if(message.videos){
				this._.render(message.videos);
			}
			this._super().process( message );
		}
	} )
);