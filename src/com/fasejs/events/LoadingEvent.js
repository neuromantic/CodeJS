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
 
_class('LoadingEvent')._extends('Event', {
	static_LOADED : 'loaded',
	data : {},
	init : function(type,data) {
		this.type = type;
		this.data = data;
	}
});