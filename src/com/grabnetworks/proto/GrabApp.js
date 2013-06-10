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
            this._.options = options;
            var contentID = this._.settings.content || this._.options.grabnetworks.content;
            this.id = this._.options.grabnetworks.id;
            delete this._.settings.id;
            if(contentID){
                this._.loadPlaylist( contentID );
            }else{
                this.exec();
            }
        },
        private_onPlaylistLoadingComplete : function ( event ){
            this._.playlist = event.data;
            delete this._.options.grabnetworks.content;
            this.exec();
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
            if( settings.config && typeof settings.config === 'object'){
                delete this._.settings.id;
                this._.configWithOptions( settings.config );
            }else if( settings.id ){
                this._.loadOptions( settings.id );
            }
        },
        exec : function () {
            if( this._.options && this._.playlist ){
                this._super().exec();
            }
        }
    })
);