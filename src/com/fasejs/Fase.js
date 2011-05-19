/*!
 *
 * Fase.js
 * http://fasejs.com/
 *
 * Copyright 2011, Neuromantic Industries & For Sure, Rad!
 * Licensed under the MIT license.
 *
 */

//temporary

(function() {
	console.log('fase loaded.');
	window.Fase = function () {
		return [
			//test
			//core
				// 'com.fasejs.core.Debug',
			//events
				'com.fasejs.events.Event',
				'com.fasejs.events.MouseEvent',
				'com.fasejs.events.FocusEvent',
				'com.fasejs.events.EventDispatcher',
				'com.fasejs.events.TimerEvent',
				'com.fasejs.util.Timer',
			//display
				'com.fasejs.display.Graphics',
				'com.fasejs.display.DisplayObject',
				'com.fasejs.display.Bitmap',
				'com.fasejs.display.Loader',
				'com.fasejs.display.Sprite',
				'com.fasejs.display.Stage',
			//text
				'com.fasejs.text.TextField',
				'com.fasejs.text.TextFormat',
			//animation
				'com.fasejs.fs.transitions.Easing',
				'com.fasejs.fs.transitions.Tween',
			//net
				'com.fasejs.net.URLLoader',
				'com.fasejs.events.LoadingEvent',
			//browser
				'com.fasejs.browser.Address',
				'com.browserjs.dom.form.Input',
				'com.browserjs.dom.form.TextArea',
				'com.browserjs.dom.form.EmailInput',
				'com.browserjs.dom.form.SubmitButton'
		];
	};
})();

