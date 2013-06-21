 /*!
 *
 * GrabApp.js
 * com.grabnetworks.proto.GrabApp
 *
 */
_package('com.grabnetworks.proto', 
    _import( 'com.neuromantic.arete.proto.App'),
    _import( 'com.neuromantic.arete.dom.Element'),
    _import( 'com.neuromantic.arete.events.LoadingEvent'),

    _import( 'com.grabnetworks.loading.PlaylistLoader'),
    _import( 'com.grabnetworks.loading.ContentLoader'),

    _class( 'GrabApp')._extends( 'App', {
        id: null,
        private_options : null,
        private_playlist : null,
        private_media : null,
        private_onOptionsLoadingComplete : function ( event ){
            this._.configWithOptions( event.data );
        },
        private_configWithOptions : function ( options ){
            var contentID;
            this._.options = options;
            if( this._.settings.content === false){
                delete this._.settings.content;
            }else{
                 contentID = this._.settings.content || this._.options.grabnetworks.content;
            }
            this.id = this._.options.grabnetworks.id;
            delete this._.settings.id;
            if(contentID){
                this._.loadPlaylist( contentID );
            }else{
                this.exec();
            }
        },
        private_onPlaylistLoadingComplete : function ( event ){
            this.renderPlaylist( event.data);
        },
        private_loadPlaylist : function( contentID ){
            var playlistLoader = new PlaylistLoader( this._.settings.environment );
            playlistLoader.on( LoadingEvent.COMPLETE, this._.onPlaylistLoadingComplete );
            playlistLoader.load( contentID );
        },
        private_loadOptions : function( embedID ){
            var optionsLoader = new ContentLoader( this._.settings.environment);
            optionsLoader.on( LoadingEvent.COMPLETE, this._.onOptionsLoadingComplete );
            optionsLoader.loadOptions( embedID );
        },
        GrabApp : function ( settings ){
            this._super( settings );
            if( settings.config ){
                switch( typeof settings.config ){
                case 'string':
                    settings.config = JSON.parse( settings.config );//fall through
                case 'object':
                    this._.configWithOptions( settings.config );
                }
            }else if( settings.id ){
                this._.loadOptions( settings.id );
            }
        },
        exec : function () {
            if( this._.options && this._.playlist ){
                this._super().exec();
            }
        },
        renderPlaylist : function ( playlist ) {
            this._.playlist = playlist;
            this.exec();
        }
    })
);