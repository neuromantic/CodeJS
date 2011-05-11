/*!
 *
 * Effects.js
 * com.fasejs.display.Effects
 *
 * http://fasejs.com/
 *
 * Copyright 2011, Neuromantic Industries & For Sure, Rad!
 * Licensed under the MIT license.
 *
 */

(function() {
	_class('Effects')._extends('Event', {
		fadeIn : function(speed) {
			this.style.opacity = 100;
			fadeInterval = setInterval(function() {
				if (this.style.opacity > 1) {
					this.style.opacity -= 1;
				} else {
					clearInterval(fadeInterval);
				};
			}, 35);			
		}
	});
})();