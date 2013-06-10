/*!
 *
 * Playlist.js
 * com.grabnetworks.vidgets.Playlist
 *
 */
_package( 'com.grabnetworks.vidgets',
    _import( 'com.grabnetworks.player.Modal' ),
    _import( 'com.grabnetworks.proto.GrabApp' ),
    
    _import( 'com.neuromantic.arete.dom.Element' ),
    _import( 'com.neuromantic.arete.dom.elements.Div' ),
    _import( 'com.neuromantic.arete.dom.elements.media.Img' ),
    _import( 'com.neuromantic.arete.events.MouseEvent' ),
    
    _class( 'Playlist')._extends( 'GrabApp', {
        private_listItems : [],
        private_build : function () {
            for ( var i = 0; i < this._.playlist.videos.length; i++ ) {
                var video = this._.playlist.videos[ i ].video;
                // var listItem = new Div( {className:'ListItem'} );
                var listItem = new Img( { src: video.media.preview.url } );
                // var title = new Element( 'h3');
                // title.text( video.title );
                // var description = new Element( 'p' );
                // description.text( video.description );
                // listItem.append( title );
                // listItem.append( img );
                // listItem.append( description );
                this.append( listItem );
                this._.listItems.push( listItem );
            }
        },
        private_layout : function () {
            var x = 0;
            for( var i = 0; i < this._.listItems.length; i++ ){
                var listItem = this._.listItems[ i ];
                // listItem.height(this._.settings.height);
                listItem.x( x );
                x += listItem.width();
            }
        }
    })
);
    