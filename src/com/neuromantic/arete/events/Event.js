/*!
 *
 * Event.js
 * com.neuromantic.arete.events.Event
 *
 */
 _package( 'com.neuromantic.arete.events',
	_class('Event', {
		static_CHANGE : 'change',
        static_RESIZE : "resize",
		type : '',
        data: null,
		source : null,
		Event : function( type, data ) {
			this.type = type;
            this.data = data;
		}//,
	})
);
