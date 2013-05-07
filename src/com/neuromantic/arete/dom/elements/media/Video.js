/*!
 *
 * Video.js
 * com.neuromantic.arete.dom.elements.media.Video
 *
 */
_package( 'com.neuromantic.arete.dom.elements.media',
    _import( 'com.neuromantic.arete.dom.elements.Media' ),
    _class( 'Video' )._extends( 'Media', {
        static_TYPE : 'video',
        Video : function ( atts ){
            this._super( Video.TYPE, atts );
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