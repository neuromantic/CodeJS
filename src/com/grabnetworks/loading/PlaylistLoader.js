/*!
 *
 * PlaylistLoader.js
 * com.grabnetworks.loading.PlaylistLoader
 *
 */
_package( 'com.grabnetworks.loading',
    _import( 'com.neuromantic.arete.events.Notifier'),
    _import( 'com.neuromantic.arete.events.LoadingEvent'),
    _import( 'com.grabnetworks.loading.ContentLoader'),
    _import( 'com.grabnetworks.loading.CatalogLoader'),
     
    _class( 'PlaylistLoader' )._extends( 'Notifier', {
        private_environment : 'production',
        private_onCatalogLoaded : function ( event ) {
            var data = { id : 0, videos : event.data.response.results };
            if( data.videos.length > 0){
                this._.notify( new LoadingEvent( LoadingEvent.COMPLETE, data ) );
            }else{
_trace( 'No video results found.')
            }
        },
        private_onContentLoaded : function ( event ) {
            var data;
            if( event.data.videos){
                data = event.data;
            }else{
                data = {id: 0, videos: [{video : event.data.video }]};
            }
            this._.notify( new LoadingEvent( LoadingEvent.COMPLETE, data ) );
        },
        PlaylistLoader : function( environment ){
            if( environment){
                this._.environment = environment;
            }
        },
        load : function ( contentID ){
            var loader;
            if( contentID){
                switch (contentID){
                    case 'MATCH':
_trace( 'Retreiving matching video...' );
                        loader = new CatalogLoader(/*'test'*/ );
                        loader.on( LoadingEvent.COMPLETE, this._.onCatalogLoaded );
                        loader.loadMatch();
                        break;
                    case 'RELATED':
_trace( 'Retreiving related video...' );
                        loader = new CatalogLoader( this._.environment );
                        loader.on( LoadingEvent.COMPLETE, this._.onCatalogLoaded );
                        loader.loadRelated();
                        break;
                    default:
_trace( 'Using embedded video.' );
                        loader = new ContentLoader( this._.environment );
                        loader.on( LoadingEvent.COMPLETE, this._.onContentLoaded );
                        loader.loadContent( contentID );
                } 
            }
        }
    })
);
        