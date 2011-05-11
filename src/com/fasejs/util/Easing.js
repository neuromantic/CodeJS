/*!
 *
 * Easing.js
 * com.fasejs.util.Easing
 *
 * http://fasejs.com/
 *
 * Copyright 2011, Neuromantic Industries & For Sure, Rad!
 * Licensed under the MIT license.
 *
 */
_class('Easing')._extends('EventDispatcher', {
	to : function(item, prop, propStartVal, propFinishVal) {
		var speed = 12;
		var propCurrentVal = propStartVal;
		var propsInterval = setInterval(function() { 
			var propChange = (propFinishVal - propCurrentVal);
			propCurrentVal += (propChange/speed);
			if (prop == 'x') {
				item.x(propCurrentVal);
			} else if (prop == 'y') {
				item.y(propCurrentVal);
			} else {
			};
			if (propCurrentVal > propFinishVal - 0.5) {
				clearInterval(propsInterval);
			};
		}, 10);
	}
});