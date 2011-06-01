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
	
_class( 'EmailInput' )._extends( 'TextInput', {
	private_valid : false,
	valid : function() {
		return this._.valid;
	},
	EmailInput : function( placeholder ) {
		this._super( placeholder, 'email' );
		this.addEventListener( KeyboardEvent.UP, function( event ) {
			var str = this.text();
			var filter = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
			if (! this._.valid ) {
				if ( filter.test( str ) ) {
					this._.valid = true;
					event.target._dispatchEvent( new ValidationEvent( ValidationEvent.VALID ), this );
				};
			} else {
				if (! filter.test( str ) ) {
					this._.valid = false;
					event.target._dispatchEvent( new ValidationEvent( ValidationEvent.VOID ), this );
				};
			};
		}, this );
	},//,
} );
