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
 
_class('Event', {
	static_ADDED_TO_STAGE : 'addedToStage',
	type : '',
	target : null,
	init : function(type, target) {
		this.type = type;
		this.target = target;
	}
});
