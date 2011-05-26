/*!
 *
 * Input.js
 * com.browser.js.dom.form.Input
 *
 * http://fasejs.com/
 *
 * Copyright 2011, Neuromantic Industries & For Sure, Rad!
 * Licensed under the MIT license.
 *
 */
// _package( 'com.browserjs.dom.form',
	// _import( 'com.fasejs.text.TextField' ),
	// _import( 'com.fasejs.events.FocusEvent' ),
	_class( 'Input' )._extends('TextField', {
		Input : function( type ){
			this.element( document.createElement( 'input' ) );
			this.element().setAttribute( 'type', type );
			
			_this = this;
			this.element().onfocus = function () { _this._dispatchEvent( new FocusEvent( FocusEvent.IN ), _this ) };
			this.element().onblur = function () { _this._dispatchEvent( new FocusEvent( FocusEvent.OUT ), _this ) };
			this.element().onchange = function () { _this._dispatchEvent( new Event( Event.CHANGE ), _this ) };
			
		}//,
	}//,
);
