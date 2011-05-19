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
_class('Dictionary', {
	init : function( key, value ) {
		if(value === undefined ) {
			return this._.values[ this.index( key ) ];
		}
		this._.values[ this.index( key ) ] = value;
	},
	private_values : [],
	private_objects : [],
	index : function( key ) {
		var index = this._.objects.indexOf( key );
		return ( index >= 0  ) ? index :  null;

	}
});