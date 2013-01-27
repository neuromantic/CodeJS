/*!
 *
 * MediaEvent.js
 * com.neuromantic.arete.events.MediaEvent
 *
 */
_package( 'com.neuromantic.arete.events',
    _import( 'com.neuromantic.arete.events.Event'),
    _class( 'MediaEvent' )._extends( 'Event', {
        LOAD_START: 'loadstart',// The user agent begins looking for media data, as part of the resource selection algorithm.	networkState equals NETWORK_LOADING
        PROGRESS: 'progress',// The user agent is fetching media data.	networkState equals NETWORK_LOADING
        SUSPEND: 'suspend',// The user agent is intentionally not currently fetching media data.	networkState equals NETWORK_IDLE
        ABORT: 'abort',// The user agent stops fetching the media data before it is completely downloaded, but not due to an error.	error is an object with the code MEDIA_ERR_ABORTED. networkState equals either NETWORK_EMPTY or NETWORK_IDLE, depending on when the download was aborted.
        ERROR: 'error',// An error occurs while fetching the media data.	error is an object with the code MEDIA_ERR_NETWORK or higher. networkState equals either NETWORK_EMPTY or NETWORK_IDLE, depending on when the download was aborted.
        EMPTIED: 'emptied',// A media element whose networkState was previously not in the NETWORK_EMPTY state has just switched to that state (either because of a fatal error during load that's about to be reported, or because the load() method was invoked while the resource selection algorithm was already running).	networkState is NETWORK_EMPTY; all the IDL attributes are in their initial states.
        STALLED: 'stalled',// The user agent is trying to fetch media data, but data is unexpectedly not forthcoming.	networkState is NETWORK_LOADING.
        LOADED_METADATA: 'loadedmetadata',// The user agent has just determined the duration and dimensions of the media resource and the text tracks are ready.	readyState is newly equal to HAVE_METADATA or greater for the first time.
        LOADED_DATA: 'loadeddata',// The user agent can render the media data at the current playback position for the first time.	readyState newly increased to HAVE_CURRENT_DATA or greater for the first time.
        CAN_PLAY: 'canplay',//The user agent can resume playback of the media data, but estimates that if playback were to be started now, the media resource could not be rendered at the current playback rate up to its end without having to stop for further buffering of content.	readyState newly increased to HAVE_FUTURE_DATA or greater.
        CAN_PLAY_THROUGH: 'canplaythrough',// The user agent estimates that if playback were to be started now, the media resource could be rendered at the current playback rate all the way to its end without having to stop for further buffering.	readyState is newly equal to HAVE_ENOUGH_DATA.
        PLAYING: 'playing',// Playback is ready to start after having been paused or delayed due to lack of media data.	readyState is newly equal to or greater than HAVE_FUTURE_DATA and paused is false, or paused is newly false and readyState is equal to or greater than HAVE_FUTURE_DATA. Even if this event fires, the element might still not be potentially playing, e.g. if the element is blocked on its media controller (e.g. because the current media controller is paused, or another slaved media element is stalled somehow, or because the media resource has no data corresponding to the media controller position), or the element is paused for user interaction or paused for in-band content.
        WAITING: 'waiting',// Playback has stopped because the next frame is not available, but the user agent expects that frame to become available in due course.	readyState is equal to or less than HAVE_CURRENT_DATA, and paused is false. Either seeking is true, or the current playback position is not contained in any of the ranges in buffered. It is possible for playback to stop for other reasons without paused being false, but those reasons do not fire this event (and when those situations resolve, a separate playing event is not fired either): e.g. the element is newly blocked on its media controller, or playback ended, or playback stopped due to errors, or the element has paused for user interaction or paused for in-band content.
        SEEKING: 'seeking',// The seeking IDL attribute changed to true.	
        SEEKED: 'seeked',// The seeking IDL attribute changed to false.	
        ENDED: 'ended',// Playback has stopped because the end of the media resource was reached.	currentTime equals the end of the media resource; ended is true.
        DURATION_CHANGE: 'durationchange',// The duration attribute has just been updated.	
        TIME_UPDATE: 'timeupdate',// The current playback position changed as part of normal playback or in an especially interesting way, for example discontinuously.	
        PLAY: 'play',// The element is no longer paused. Fired after the play() method has returned, or when the autoplay attribute has caused playback to begin.	paused is newly false.
        PAUSE: 'pause',// The element has been paused. Fired after the pause() method has returned.	paused is newly true.
        RATE_CHANGE: 'ratechange',// Either the defaultPlaybackRate or the playbackRate attribute has just been updated.	
        VOLUME_CHANGE: 'volumechange'//, Either the volume attribute or the muted attribute has changed. Fired after the relevant attribute's setter has returned.	
    } )
);