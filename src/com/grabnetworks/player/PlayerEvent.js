/*!
 *
 * PlayerEvent.js
 * com.grabnetworks.player.PlayerEvent
 *
 */
_package('com.grabnetworks.player',
	
	_class('PlayerEvent',{
	    static_PLAYER_READY: "PlayerSWFReady",
	    static_VIDEO_KEYFRAME: "VideoKeyFrameUpdate",
	    static_CONTENT_LOADED: "ContentLoaded",
	    static_CONTENT_ERROR: "ContentError",
	    static_VIDEO_ENDED: "VideoPlaybackEnded",
	    static_VIDEO_PAUSED: "VideoPlaybackPaused",
	    static_VIDEO_STARTED: "VideoPlaybackStarted",
		static_VIDEO_PLAYING: "VideoPlaybackPlayed",
		static_PREROLL_ENDED: "PreRollPlaybackEnded",
		static_PREROLL_STARTED: "PreRollPlaybackStarted",
		static_PREROLL_CLICKED: "PreRollSelected"
	 })
 )