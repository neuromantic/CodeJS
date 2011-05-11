/*!
 *
 * Address.js v0.0.1
 * com.fasejs.browser.Address
 *
 * http://fasejs.com/
 *
 * Copyright 2011, Neuromantic Industries & For Sure, Rad!
 * Licensed under the MIT license.
 *
 */
 
(function() {
	_class('Address')._extends('EventDispatcher', {
		configure : function(params) {
			this.config = params;
		},
		change : function(id) {
			var config = this.config;
			var stateObj = config[id]['pathname'];
			history.pushState(stateObj, config[id]['title'], config[id]['pathname']);
			titleAppend = config[id]['title'];
			document.title = config['title'] + titleAppend;
			if (this.currentState == config[id]['pathname']) {
				return false;
			} else {
				//FSR.movement.clear();
				this.currentState = config[id]['pathname'];
			}
			config[id]['fn'].apply(this);
		},	
		setPath : function() {
			var config = this.config;
			var pathname = window.location.pathname;
			for (property in config) {
				if (config[property]['pathname'] == pathname) {
					this.change(property);
				};
			}	
		}
	});
})()
