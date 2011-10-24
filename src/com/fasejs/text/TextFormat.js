/*!
 *
 * TextFormat.js
 * com.fasejs.text.TextFormat
 *
 * https://github.com/neuromantic/CodeJS/
 *
 * Copyright 2011, Neuromantic Industries & For Sure, Rad!
 * Licensed under the MIT license.
 *
 */

(function() {
	_class('TextFormat', {
		CSS : [],
		font : function(value) {
			this.CSS['fontFamily'] = value;
		},
		fontSize : function(value) {
			this.CSS['fontSize'] = value + 'px'; 
			this.CSS['lineHeight'] = value + 'px'; 
		},
		fontWeight : function(value) {
			this.CSS['fontWeight'] = value;
		},
		textShadow : function(value) {
			this.CSS['textShadow'] = '0px 1px 0px ' + value;
			this.CSS['-moz-text-shadow'] = '0px 1px 0px ' + value;
			this.CSS['-webkit-text-shadow'] = '0px 1px 0px ' + value;
		},
		fontStyle : function(value) {
			this.CSS['fontStyle'] = value;
		},
		background : function(value) {
			this.CSS['background'] = value;
		},
		color : function(value) {
			this.CSS['color'] = value;
		},
		textTransform : function(value) {
			this.CSS['textTransform'] = value;
		},
		letterSpacing : function(value) {
			this.CSS['letterSpacing'] = value + 'px';
		}
	});
})();