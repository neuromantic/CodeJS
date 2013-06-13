/*!
 *
 * VideoAd.js
 * com.grabnetworks.advertisement.VideoAd.js
 *
 */
_package( 'com.grabnetworks.advertisement',
    _import('tv.adap.jsvpaid'),
    _import('com.neuromantic.arete.dom.Document'),
    _import('com.neuromantic.arete.dom.elements.media.Video'),
    _class( 'VideoAd')._extends( 'Video', {
        private_ad : null,
        private_environmentVars : null,
        private_baseAdTagUrl : "http://ads.adap.tv/a/t/voxant",
        VideoAd : function ( video ) {
            this._super();
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
        play: function( video ){
            var customParams = {};
            var creativeData =  { 
                adTagUrl      : __adaptv__.vpaid.constructAdTag(baseAdTagUrl, params, customParams) // Helper method to append and encode all defined data
            };
            var params = {
                pageUrl      : Document.url(),
                id           : video.product_id,
                title        : video.title, // Video title.
                description  : video.description, // Video description.
                duration     : video.duration, // Video duration.
                categories   : video.categories // Categories, comma-separated.
            };
            this._.ad.subscribe('AdStarted', function(e) { console.log(e.type); });
            this._.ad.subscribe('AdLoaded', this._.onAdLoaded);
            this._.ad.subscribe('AdStopped', function() { console.log('Ad stopped.');});
            this._.ad.subscribe('AdError', function(e) {console.log(e.type + '! Error code: ' + e.data.errorCode + '. Error message: ' + e.data.errorMessage)});
            this._.ad.initAd(this.width(), this.height(), -1, -1, creativeData, environmentVars);
            this._.ad.startAd();
        }
    })
);
        