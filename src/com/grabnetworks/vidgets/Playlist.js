/*!
 *
 * Playlist.js
 * com.grabnetworks.vidgets.Playlist
 *
 */
_package( 'com.grabnetworks.vidgets',
    _import( 'com.grabnetworks.player.Modal' ),
    _import( 'com.grabnetworks.ui.CloseButton' ),
    _import( 'com.grabnetworks.loading.ContentLoader' ),
    _import( 'com.grabnetworks.loading.CatalogLoader' ),
    _import( 'com.grabnetworks.tracking.Ping' ),
    _import( 'com.grabnetworks.tracking.PlaybackPinger' ),
    
    _import( 'com.neuromantic.arete.dom.Window' ),
    _import( 'com.neuromantic.arete.dom.Document' ),
    _import( 'com.neuromantic.arete.dom.Element' ),
    _import( 'com.neuromantic.arete.dom.elements.Div' ),
    _import( 'com.neuromantic.arete.dom.elements.media.Img' ),
    _import( 'com.neuromantic.arete.events.MouseEvent' ),
    _import( 'com.neuromantic.arete.events.LoadingEvent' ),
    _class( 'Playlist')._extends( 'Div', {
        private_listItems : [],
        private_modal : null,
        private_settings : {},
        private_options:null,
        private_guid : null,
        private_data : [],
        private_ready: false,
        private_onOptionsLoaded: function ( event ){
_trace( 'Received options.' );
            var options = event.data;
            new Ping( { p:'vf', e:'load', i:this._.settings.id, u: encodeURIComponent(Document.url()) });
            var loader;
            var content = options.grabnetworks.content;
            switch (content){
                case 'MATCH':
_trace( 'Retreiving matching video...' );
                    loader = new CatalogLoader( 'test' );
                    loader.on( LoadingEvent.COMPLETE, this._.onCatalogLoaded );
                    loader.loadMatch();
                    break;
                case 'RELATED':
_trace( 'Retreiving related video...' );
                    loader = new CatalogLoader();
                    loader.on( LoadingEvent.COMPLETE, this._.onCatalogLoaded );
                    loader.loadRelated();
                    break;
                default:
_trace( 'Using embedded video...' );
                    loader = new ContentLoader();
                    loader.on( LoadingEvent.COMPLETE, this._.onContentLoaded );
                    loader.loadContent( content );
            }
            this._.options = options;
        },
        private_onCatalogLoaded : function ( event ) {
_trace( 'Received search results.' );
            if ( event.data.response.results.length > 0 ){
_trace( 'Found content candidates.');
                if(! event.data.trigger){
_trace( 'Ignoring trigger recommendation.');
                }
                this._.data = event.data.results;
                this._.render();
            }else{
_trace( 'No candidates.');
            }
        },
        private_onContentLoaded : function ( event ) {
_trace( 'Received content' );
            this._.data = event.data.videos || [ event.data ];
            this._.render();
        },
        private_render : function () {
            for ( var i = 0; i < this._.data.length; i++ ) {
                var video = this._.data[ i ].video;
                var item = new Div({className:'ListItem'});
                var img = new Img( { src: video.media.preview.url } );
                var title = new Element( 'h3');
                title.text( video.title );
                var description = new Element( 'p' );
                description.text( video.description );
                item.append( title );
                item.append( img );
                item.append( description );
                this.append( item );
            }
            new Element( this._.settings.parent ).append( this );
        },
        Playlist : function( settings ){
            this._super( );
            settings.id = settings.id || 1720202;
            this._.settings = settings;
            var loader = new ContentLoader();
            loader.on( LoadingEvent.COMPLETE, this._.onOptionsLoaded );
            loader.loadOptions( settings.id );
        },
    })
);
    