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
            if(video){
                this._.tag = video.tag();
            }
            this._.environmentVars = {
                maxWrapperLevels  : 5, // Maximum number of VAST wrapper redirects; default is 5.
                adTagTimeout      : 10, // Time in seconds to wait for the network to resolve the ad tag; default is 10s.
                videoTimeout      : 30, // Total in seconds time to wait for a video ad to show; default is 30s.
                videoSlot         : this._.tag // Id of existing HTML5 video player (in-stream case)
            };
            this._.ad = new __adaptv__.vpaid.VPAIDAd();
        },
        private_onAdLoaded : function() {
            this.ad.startAd();
        },
        private_onAdError : function(e) {
console.log( e.type + '! Error code: ' + e.data.errorCode + '. Error message: ' + e.data.errorMessage);
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
            this._.ad.subscribe('AdStarted', function(e) { console.log(e.type); });
            this._.ad.subscribe('AdLoaded', this._.onAdLoaded);
            this._.ad.subscribe('AdStopped', function() { console.log('Ad stopped.');});
            this._.ad.subscribe('AdError', this._.onAdError );
            this._.ad.initAd(this.width(), this.height(), -1, -1, creativeData, this._.environmentVars);
        }
    })
);
        