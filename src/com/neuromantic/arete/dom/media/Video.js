/*!
 *
 * Video.js
 * com.neuromantic.arete.dom.media.Video
 *
 */
_package( 'com.neuromantic.arete.dom.media',
    _import( 'com.neuromantic.arete.dom.media.Media' ),
    _class( 'Video' )._extends( 'Media', {
        Video : function ( atts ){
            this._super( 'video', atts );
        },
        play : function () {
            this._.tag.play();
        },
        pause : function () {
            this._.tag.pause();
        },
        stop: function () {
            this.pause();
            this.load( null );
        },
        get_seek: function (){
            return this._.tag.currentTime * 1000;
        },
        set_seek: function( ms ){
            this._.tag.currentTime = ms * 0.001;  
        },
        duration : function (){
            return this._.tag.seekable.end() * 1000;
        }
    })
);