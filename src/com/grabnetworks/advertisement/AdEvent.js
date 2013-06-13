/*!
 *
 * AdEvent.js
 * com.grabnetworks.advertisement.AdEvent
 *
 */
_package('com.grabnetworks.advertisement',
    _import('com.neuromantic.arete.events.Event'),
    _class('PlayerEvent')._extends('Event', {
        static_PLAYER_READY: 'PlayerSWFReady',
        static_VIDEO_KEYFRAME: 'VideoKeyFrameUpdate',
        static_CONTENT_LOADED: 'ContentLoaded',
        static_CONTENT_ERROR: 'ContentError',
        static_VIDEO_ENDED: 'VideoPlaybackEnded',
        static_VIDEO_PAUSED: 'VideoPlaybackPaused',
        static_VIDEO_STARTED: 'VideoPlaybackStarted',
    	static_VIDEO_PLAYING: 'VideoPlaybackPlayed',
		static_PREROLL_ENDED: 'PreRollPlaybackEnded',
		static_PREROLL_STARTED: 'PreRollPlaybackStarted',
		static_PREROLL_CLICKED: 'PreRollSelected'
    })
 );        