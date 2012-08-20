/*!
 *
 * EmailInput.js
 * com.browser.js.dom.EmailInput
 *
 * https://github.com/neuromantic/CodeJS/
 *
 * Copyright 2011, Neuromantic Industries & For Sure, Rad!
 * Licensed under the MIT license.
 *
 */
_package( 'com.browserjs.dom.form',

	_import( 'com.fasejs.events.FocusEvent' ),
	_import( 'com.browserjs.dom.form.TextInput' ),
	
	_class( 'EmailInput' )._extends( 'TextInput', {
		EmailInput : function( placeholder ) {
			this._super( placeholder, 'email', /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i );
		}//,
	} )//,
);
