/*!
 *
 * VideoAd.js
 * com.grabnetworks.advertisement.VideoAd.js
 *
 */
_package( 'com.grabnetworks.advertisement',
    _import('tv.adap.jsvpaid'),
    _class( 'VideoAd')._extends( 'Video', {
        ad : null,
        VideoAd : function () {
            this._super();
            this.ad = new __adaptv__.vpaid.VPAIDAd();
            this.ad.subscribe
        }
    })
);
        