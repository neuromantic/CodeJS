/*!
 *
 * AdEvent.js
 * com.grabnetworks.advertisement.AdEvent
 *
 */

  _package( 'com.grabnetworks.advertisement',
    _import( 'com.neuromantic.arete.events.Event' ),
    _class('AdEvent')._extends('Event', { 
        static_LOADED: 'AdLoaded',// The event is sent by the ad to notify that the ad has finished any loading of assets and is ready for display.
        static_STARTED: 'AdStarted',// The event is sent by the ad to notify that the ad is displaying.
        static_STOPPED: 'AdStopped',// The event is sent by the ad to notify that the ad has stopped displaying, and all ad resources have been cleaned up.
        static_IMPRESSION: 'AdImpression',// The event is used to notify that the user-visible phase of the ad has begun.
        static_VIDEO_START: 'AdVideoStart',
        static_FIRST_QUARTILE: 'AdVideoFirstQuartile',
        static_MIDPOINT: 'AdVideoMidpoint',
        static_THIRD_QUARTILE: 'AdVideoThirdQuartile',
        static_VIDEO_COMPLETE: 'AdVideoComplete',// These five quartile events are sent by the ad to notify the ad’s video progress.
        static_CLICK_THRU: 'AdClickThru',// The event is sent by the ad when a click thru on the click thru object after video ad occurs.
        static_PAUSED: 'AdPaused',
        static_PLAYING: 'AdPlaying',// These events are sent by the ad to notify the pause/resume status change of the ad's video.
        static_ERROR: 'AdError'// The event is sent when the ad has experienced a fatal error.
	})
);