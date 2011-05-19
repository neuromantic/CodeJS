/*!
 *
 * Input.js
 * com.browser.js.dom.Input
 *
 * http://fasejs.com/
 *
 * Copyright 2011, Neuromantic Industries & For Sure, Rad!
 * Licensed under the MIT license.
 *
 */
_class('Input')._extends('TextField', {
	Input : function( type ){
		this.element( document.createElement( 'input' ) );
		this.element().setAttribute( 'type', type );
	},
	_addEvents : function(){
		this._super();
		_this = this;
		this.element().onfocus = function () { _this._dispatchEvent( new Event( Event.FOCUS_IN ), _this ) };
		this.element().onblur = function () { _this._dispatchEvent( new Event(Event.FOCUS_OUT), _this ) };
	}
});
