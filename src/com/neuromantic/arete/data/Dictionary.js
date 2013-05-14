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
				return this._values[ this._values.indexOf( key ) ]; // get
			}
			var index = this._keys.indexOf( key );
			if ( index < 0 ) { // new key
				index = this._.keys.length;
				this._keys[index] =  key ;
			}
			if ( value === null ) { // null value (delete)
				this._keys.splice( index, 1 );
				this._values.splice( index, 1 );
			}else{
				this._values[ index ] = value; // set
			}
		},
    	_keys : [],
		_values : [],
		Dictionary : function () {
		},
		toString : function () {
			return 'Dictionary with ' + this._.keys.length + ' keys and ' + this._values.length + ' values.';
		}//,
	})
);