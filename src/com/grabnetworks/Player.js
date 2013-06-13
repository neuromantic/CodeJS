/*
 * Player.js
 * http://player.grabnetworks.com/js/Player.js
 *
 * 
 * GHANGELOG:
 * @version 0.1.0b28
 * first Code.js build, added SWF management to hide() and show()
 * ---------- A R E T E -----------
 * @version 0.0.4b27                                                                                                                                                                                                                                                         
 * add support for configWithOptions() API method to allow parsed options JSON to be processed directly without a new load.   
 * allow API consumers to declare the playback mode to report for content initiated via loadNewVideo or renderContent (ap/ctp)
 * @version 0.0.4b26
 * add support for renderContent() API method to allow parsed content/catalog JSON to be processed directly without a new load.
 * @version 0.0.4b25
 * playback HTML node (Player.swf Object tag or HTML5 video tag) now `consumes` the grabDiv in both cases, and no longer inherits any style attributes from it.
 * @version 0.0.4b24'
 * never overwrite Player._ (private static namespace) to support multiple loads of the script on the same page.
 * @version 0.0.4b23
 * support secret VCL param for loadNewVideo() 
 * @version 0.0.4b22
 * fix `square container` bug
 * @version 0.0.4b21''''
 * add PLAYER_READY event to HTML5 mode
 * apply deferral of API control methods to HTML5 mode
 * deferral queue
 * @version 0.0.3b20''''
 * add HTML5 video tag mode support of content=false
 * use content preview image in the "mobile format unavailable" screen
 * only pass authority of current page to content sever
 * pull close button from static CDN
 * @version 0.0.3b19
 * no longer require 'v' before guid
 * @version 0.0.3b18
 * add jsonp function
 * add local settings parameter to define local root path to Player SWF.
 * add calls to content server, with rudimentary "mobile format not found" handling
 * @version 0.0.2b17
 * environment auto-detect
 * allow for one-line, API and Modal embed styles.
 * @version 0.0.1b16
 * add context awareness, the script will inject the player into its parent node
 * add query parameters: instantiate a player with a single script tag
 * @version 0.0.1b15
 * add PREROLL_CLICKED Event
 * @version 0.0.1b14
 * Bridge Compatibility Fix
 * @version 0.0.1b13
 * Bug fixes
 * @version 0.0.1b12
 * new PlayerEvents naming convention, more PlayerEvents handler arguments
 * moved close button to http://player.grabnetworks.com/js/img/close.png
 * @version 0.0.1b11
 * modal hide resets player._.ready
 * @version 0.0.1b10.2
 * fixed _.swf assignment, scoping and timing issues
 * @version 0.0.1b10
 * auto-close modal on playback complete
 * @version 0.0.1b9.10
 * moved close button to http://player.grabnetworks.com/js/images/close.png
 * started changelog
 * 
 * com.grabnetworks.Player
 * legacy compatibility proxy library for Player.js
 */ 
_package( 'com.grabnetworks',
    _import( 'com.grabnetworks.player.Player'),
    _import( 'com.grabnetworks.PlayerEvent'),
    _import( 'com.grabnetworks.Modal'),
    _class( 'Player')._extends( 'com.grabnetworks.player.Player')
);