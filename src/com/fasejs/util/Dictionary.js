/*!
 *
 * Dictionary.js
 * com.fasejs.util.Dictionary
 *
 * http://fasejs.com/
 *
 * Copyright 2011, Neuromantic Industries & For Sure, Rad!
 * Licensed under the MIT license.
 *
 */

 _package( 'com.fasejs.util',
	_class('Dictionary', {
		Dictionary : function () {
		},
		_ :  function ( key, value ) {
			var o = this;
			if ( value === undefined ) {
				return o._value( key ) // get
			}
			var index = o._keyIndex( key );
			if ( index < 0 ) { // new key
				index = o._keys.length;
				o._keys.push( key );
			}
			if ( value === null ) { // null value (delete)
				o._keys.splice( index, 1 );
				o._values.splice( index, 1 );
			}else{
				o._values[ index ] = value; // set
			}
		},
		_keys : [],
		_values : [],
		_keyIndex : function( key ){
			return this._keys.indexOf( key );
		},
		_key : function( value ) {
			return this._keys[ this._values.indexOf( value ) ];
		},
		_value : function( key ) {
			return this._values[ this._keyIndex( key ) ];
		},
		toString : function () {
			return 'Dictionary with ' + this._keys.length + ' keys and ' + this._values.length + ' values.';
		}//,
	})
);