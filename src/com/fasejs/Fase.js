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

(function ( window ) {
	console.log('fase.');
	window.Fase = function () {
		return [
			//core
				'com.fasejs.util.Dictionary',
				// 'com.fasejs.core.Debug',
			//events
				'com.fasejs.events.Event',
				'com.fasejs.events.MouseEvent',
				'com.fasejs.events.KeyboardEvent',
				'com.fasejs.events.FocusEvent',
				'com.fasejs.events.EventDispatcher',
				'com.fasejs.events.TimerEvent',
				'com.fasejs.fs.events.TweenEvent',
				'com.fasejs.util.Timer',
			//jquery
				'com.jquery.JQuery',
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
				'com.fasejs.net.URLRequest',
				'com.fasejs.net.URLLoader',
				'com.fasejs.events.LoadingEvent',
			//browser
				'com.fasejs.browser.Address',
				'com.browserjs.dom.form.Input',
				'com.browserjs.dom.form.events.ValidationEvent',
				'com.browserjs.dom.form.TextInput',
				'com.browserjs.dom.form.EmailInput',
				'com.browserjs.dom.form.TextArea',
				'com.browserjs.dom.form.SubmitButton'
		];
	};
})( window );

