/*!
 *
 * EventDispatcher.js
 * com.fasejs.events.EventDispatcher
 *
 * http://fasejs.com/
 *
 * Copyright 2011, Neuromantic Industries & For Sure, Rad!
 * Licensed under the MIT license.
 *
 */
 
_class('EventDispatcher', {
	eventHandlers : {},
	addEventListener : function(eventType, eventHandler) {
		this.eventHandlers[eventType] = this.eventHandlers[eventType] || [];
		this.eventHandlers[eventType].push(eventHandler);
	},
	removeEventListener : function(eventType, eventHandler) {
		if (this.eventHandlers[eventType].length > 0) {
			var index = this.eventHandlers[eventType].indexOf(eventHandler);
			if (index > -1) {
				this.eventHandlers[eventType].splice(index,1);
			}
		}
	},
	dispatchEvent : function(event){
		if(this.eventHandlers[event.type]){
			event.target = this;
			for(index in this.eventHandlers[event.type]){
				this.eventHandlers[event.type][index](event)
			}
		}
	}
});
