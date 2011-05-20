/*!
 *
 * TextField.js
 * com.fasejs.text.TextField
 *
 * http://fasejs.com/
 *
 * Copyright 2011, Neuromantic Industries & For Sure, Rad!
 * Licensed under the MIT license.
 *
 */
_package( 'com.fasejs.text', 
	_import( 'com.fasejs.display.DisplayObject' ),
	
	_class( 'TextField' )._extends( 'DisplayObject', {
		TextField : function(text) {
			this._super();
			this.text(text);
		},
		text : function(value) {
			if (value === undefined){
				return this.element().innerHTML;
			}
			this.element().innerHTML = value;
		},
		setTextFormat : function(textFormat) {
			var css = textFormat.CSS;
			for (var prop in css) {
				this.element().style[prop] = css[prop];
			};
		}
	}
));
