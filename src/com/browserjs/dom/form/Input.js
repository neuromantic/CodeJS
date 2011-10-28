/*!
 *
 * Input.js
 * com.browser.js.dom.form.Input
 *
 * https://github.com/neuromantic/CodeJS/
 *
 * Copyright 2011, Neuromantic Industries & For Sure, Rad!
 * Licensed under the MIT license.
 *
 */
_package( 'com.browserjs.dom.form',
	_import( 'com.fasejs.text.TextField' ),
	_import( 'com.fasejs.events.Event' ),
	
	_class( 'Input' )._extends( 'TextField', {
		get_type : function () {
			return this.element().setAttribute( 'type' );
		},
		set_type : function ( value ){
			this.element().setAttribute( 'type', value );
			this.element().onchange = (function ( _this ){ return function ( event ){
				 _this._dispatchEvent( new Event( Event.CHANGE, _this ) ); }
			})( this );
		},
		
		Input : function( type ){
//_debug( this, 'Input', type );
			this._super();
			this.element( document.createElement( 'input' ) );
			this.type( type );
		},
	})
);
