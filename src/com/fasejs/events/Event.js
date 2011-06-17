/*!
 *
 * Event.js
 * com.fasejs.events.Event
 *
 * http://fasejs.com/
 *
 * Copyright 2011, Neuromantic Industries & For Sure, Rad!
 * Licensed under the MIT license.
 *
 */
 _package( 'com.fasejs.events',
	_class('Event', {
		static_ADDED_TO_STAGE : 'addedToStage',
		static_CHANGE : 'change',
	 	static_RESIZE : "resize",
		type : '',
		target : null,
		Event : function(type, target) {
			this.type = type;
			this.target = target;
		}//,
	})
);
