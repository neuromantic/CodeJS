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
	_class( 'Input' )._extends( 'TextField', {
		Input : function( type ){
			this.element( document.createElement( 'input' ) );
			this.element().setAttribute( 'type', type );
			
		}//,
	}//,
);
