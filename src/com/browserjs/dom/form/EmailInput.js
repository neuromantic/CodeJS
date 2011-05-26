/*!
 *
 * EmailInput.js
 * com.browser.js.dom.EmailInput
 *
 * http://fasejs.com/
 *
 * Copyright 2011, Neuromantic Industries & For Sure, Rad!
 * Licensed under the MIT license.
 *
 */
// _package( 'com.browserjs.dom.form',

	// _import( 'com.fasejs.events.FocusEvent' ),
	
	_class('EmailInput')._extends('Input', {
		valid : false,
		EmailInput : function( placeholderText ){
			this._super('email');
			if( placeholderText !== undefined ){
				this.element().setAttribute( 'placeholder', placeholderText );
			};
			_this = this;
			this.addEventListener(KeyboardEvent.PRESS, _this._onPress );
		},
		 _onPress : function( event ) {
			var str = event.target.element().value;
			var filter = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i
			if(! this.valid ) {
				if (filter.test( str ) ) {
					event.target._dispatchEvent( new ValidationEvent( ValidationEvent.VALID ), this );
				}
			}else{
				if (! filter.test( str ) ) {
					event.target._dispatchEvent( new ValidationEvent( ValidationEvent.VOID ), this );
				}
			}

		}
	}//,
);
