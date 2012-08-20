/*!
 *
 * TextArea.js
 * com.browser.js.dom.TextArea
 *
 * https://github.com/neuromantic/CodeJS/
 *
 * Copyright 2011, Neuromantic Industries & For Sure, Rad!
 * Licensed under the MIT license.
 *
 */
_package( 'com.browserjs.dom.form',

	_import( 'com.browserjs.dom.form.Input' ),
	
	_class('TextArea')._extends('TextInput', {
		TextArea : function( placeholder ){
			this._super(placeholder, 'textarea');
		},
		multiline : function ( value ) {
			if (value === undefined){
				return this._.element.wrap == 'soft' || 'hard' ;
			}
			this._.element.wrap = value ? 'soft' : '';
		}
	})
);
