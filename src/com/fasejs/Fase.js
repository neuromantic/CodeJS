/*!
 *
 * Fase.js
 * http://fasejs.com/
 *
 * Copyright 2011, Neuromantic Industries & For Sure, Rad!
 * Licensed under the MIT license.
 *
 */

(function() {
	console.log('fase loaded.');
	window.Fase = function () {
		return [
			//core
				// 'com.fasejs.core.Debug',
			//events
				'com.fasejs.events.Event',
				'com.fasejs.events.EventDispatcher',
			//display
				'com.fasejs.display.Graphics',
				'com.fasejs.display.DisplayObject',
				'com.fasejs.display.Sprite',
				'com.fasejs.display.Stage',
				'com.fasejs.display.Effects',
			//text
				'com.fasejs.text.TextField',
				'com.fasejs.text.TextFormat',
			//browser
				'com.fasejs.browser.Address',
				'com.browserjs.dom.Input',
				'com.browserjs.dom.EmailInput',
				'com.browserjs.dom.Header',
				'com.browserjs.dom.Section',
				'com.browserjs.dom.TextArea',
			//net
				'com.fasejs.net.URLLoader',
				'com.fasejs.events.LoadingEvent',
			//animation
				'com.fasejs.util.Easing',
		];
	}
})();

