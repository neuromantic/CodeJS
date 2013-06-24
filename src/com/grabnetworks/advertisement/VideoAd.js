/*!
 *
 * VideoAd.js
 * com.grabnetworks.advertisement.VideoAd.js
 *
 */
_package( 'com.grabnetworks.advertisement',
    _import('tv.adap.vpaid.jsvpaid'),
    _import('com.neuromantic.arete.dom.Document'),
    _import('com.neuromantic.arete.dom.elements.media.Video'),
    _class( 'VideoAd')._extends( 'Video', {
        private_ad : null,
        private_environmentVars : null,
        private_baseAdTagUrl : "http://ads.adap.tv/a/t/voxant",
        VideoAd : function ( video ) {
            this._super();
            this._.tag = video;
            this._.environmentVars = {
                maxWrapperLevels  : 5, // Maximum number of VAST wrapper redirects; default is 5.
                adTagTimeout      : 10, // Time in seconds to wait for the network to resolve the ad tag; default is 10s.
                videoTimeout      : 30, // Total in seconds time to wait for a video ad to show; default is 30s.
                videoSlot         : this._.tag // Id of existing HTML5 video player (in-stream case)
            };
            this._.ad = new __adaptv__.vpaid.VPAIDAd();
        },
        private_onadloaded : function( e ) {
            this._.notify( new AdEvent( AdEvent.LOADED ) );
            this._.ad.startAd();
        },
        private_onadstarted : function( e ) {
            this._.notify( new AdEvent( AdEvent.STARTED ) );
        },
        private_onadstopped : function( e ) {
            this._.notify( new AdEvent( AdEvent.STOPPED ) );
        },
        private_onaderror : function( e ) {
            this._.notify( e );
        },
        play: function( content ){
            var customParams = {};
            var params = {
                pageUrl      : Document.url(),
                id           : 'V'+content.video.video_product_id,
                title        : content.video.title, // Video title.
                description  : content.video.summary, // Video description.
                duration     : content.video.duration, // Video duration.
                categories   : content.video.categories // Categories, comma-separated.
            };
            var creativeData =  { 
                adTagUrl      : __adaptv__.vpaid.constructAdTag(this._.baseAdTagUrl, params, customParams) // Helper method to append and encode all defined data
            };
            this._.ad.subscribe(AdEvent.STARTED, this._.onadstarted );
            this._.ad.subscribe(AdEvent.STOPPED, this._.onadstopped );
            this._.ad.subscribe(AdEvent.LOADED, this._.onadloaded);
            this._.ad.subscribe(AdEvent.ERROR, this._.onaderror);
            this._.ad.initAd(this.width(), this.height(), -1, -1, creativeData, this._.environmentVars);
            // this._.ad.startAd();
        }
    })
);
        