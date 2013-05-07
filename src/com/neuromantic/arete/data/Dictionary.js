/*!
 *
 * Dictionary.js
 * com.neuromantic.arete.data.Dictionary
 *
 *
 */

 _package( 'com.neuromantic.arete.data',
	_class('Dictionary', {
    	_ :  function ( key, value ) {
			if ( value === undefined ) {
				return this._.values[ this._.values.indexOf( key ) ]; // get
			}
			var index = this._.keys.indexOf( key );
			if ( index < 0 ) { // new key
				index = this._.keys.length;
				this._.keys[index] =  key ;
			}
			if ( value === null ) { // null value (delete)
				this._.keys.splice( index, 1 );
				this._.values.splice( index, 1 );
			}else{
				this._.values[ index ] = value; // set
			}
		},
    	private_keys : [],
		private_values : [],
		Dictionary : function () {
		},
		toString : function () {
			return 'Dictionary with ' + this._.keys.length + ' keys and ' + this._.values.length + ' values.';
		}//,
	})
);