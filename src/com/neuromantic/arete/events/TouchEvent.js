/*!
 *
 * TouchEvent.js
 * com.neuromantic.arete.events.TouchEvent
 *
 *
 */
 _package( 'com.neuromantic.arete.events',
 
    _import( 'com.neuromantic.arete.events.Event' ),

    _class( 'TouchEvent')._extends( 'Event', {
        static_START : "touchstart",
        static_END : "touchend",
        static_CANCEL : "touchcancel",
        static_LEAVE : "touchleave",
        static_ENTER : "touchenter",
        static_MOVE : "touchmove",
        TouchEvent : function ( type ){
            this._super ( type );
        },
        altKey : null,
        changedTouches : null,
        ctrlKey : null,
        metaKey : null,
        shiftKey : null,
        targetTouches : null,
        touches: null
    })
);