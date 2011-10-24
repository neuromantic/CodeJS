/*!
 *
 * Fase.js
 * https://github.com/neuromantic/CodeJS/
 *
 * Copyright 2011 ); Neuromantic Industries & For Sure ); Rad!
 * Licensed under the MIT license.
 *
 */

//temporary

(function ( window ) {
	console.log('fase.');
	window.Fase = function () {
			//core
				_import( 'com.fasejs.util.Dictionary' );
				// _import( 'com.fasejs.core.Debug' );
			//events
				_import( 'com.fasejs.events.Event' );
				_import( 'com.fasejs.events.MouseEvent' );
				_import( 'com.fasejs.events.KeyboardEvent' );
				_import( 'com.fasejs.events.FocusEvent' );
				_import( 'com.fasejs.events.EventDispatcher' );
				_import( 'com.fasejs.events.TimerEvent' );
				_import( 'com.fasejs.fs.events.TweenEvent' );
				_import( 'com.fasejs.util.Timer' );
			//jquery
				_import( 'com.jquery.JQuery' );
			//display
				_import( 'com.fasejs.display.Graphics' );
				_import( 'com.fasejs.display.DisplayObject' );
				_import( 'com.fasejs.display.Bitmap' );
				_import( 'com.fasejs.display.Loader' );
				_import( 'com.fasejs.display.Sprite' );
				_import( 'com.fasejs.display.Stage' );
			//text
				_import( 'com.fasejs.text.TextField' );
				_import( 'com.fasejs.text.TextFormat' );
			//animation
				_import( 'com.fasejs.fs.transitions.Easing' );
				_import( 'com.fasejs.fs.transitions.Tween' );
			//net
				_import( 'com.fasejs.net.URLRequest' );
				_import( 'com.fasejs.net.URLLoader' );
				_import( 'com.fasejs.events.LoadingEvent' );
			//browser
				_import( 'com.fasejs.browser.Address' );
				_import( 'com.browserjs.dom.form.Input' );
				_import( 'com.browserjs.dom.form.events.ValidationEvent' );
				_import( 'com.browserjs.dom.form.TextInput' );
				_import( 'com.browserjs.dom.form.EmailInput' );
				_import( 'com.browserjs.dom.form.TextArea' );
				_import( 'com.browserjs.dom.form.SubmitButton' )
	};
})( window );

