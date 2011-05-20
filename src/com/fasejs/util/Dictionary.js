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
		private_values : [],
		private_objects : [],
		Dictionary : function( key, value ) {
			if(value === undefined ) {
				return this._.values[ this.index( key ) ];
			}
			this._.values[ this.index( key ) ] = value;
		},
		index : function( key ) {
			var index = this._.objects.indexOf( key );
			return ( index >= 0  ) ? index :  null;
	
		}//,
	}//,
));