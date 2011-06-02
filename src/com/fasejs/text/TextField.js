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
// _package( 'com.fasejs.text', 
	// _import( 'com.fasejs.display.DisplayObject' ),
	
	
	
_class( 'TextField' )._extends( 'DisplayObject', {
	TextField : function( text ) {
		this._super();
		this.text( text );
	},
	text : function( value ) {
		if ( value === undefined ) {
			return this.element().innerHTML;
		}
		this.element().innerHTML = value;
	},
	textColor : function( value ) {
		if ( value === undefined ) {
// eHow.com http://www.ehow.com/how_7378382_identify-text-font-color-javascript.html#ixzz1NmJ9OS6Q
		 	var element = this.element();
			var textColor = element.style.color;
			if ( element.currentStyle ) {
				textColor = element.currentStyle.color;
			} else if ( window.getComputedStyle ) {
				textColor = document.defaultView.getComputedStyle( element, null ).getPropertyValue( 'color' );
			};
			return Graphics.unrgba( textColor );
		 };
		 _trace('changing text color of', this, 'from', this.textColor(), 'to', value)
		 this.element().style.color = Graphics.rgba( value, 1 );
	}//,
});