/*!
 *
 * TextField.js
 * com.fasejs.text.TextField
 *
 * https://github.com/neuromantic/CodeJS/
 *
 * Copyright 2011, Neuromantic Industries & For Sure, Rad!
 * Licensed under the MIT license.
 *
 */
_package( 'com.fasejs.text', 
	_import( 'com.fasejs.display.DisplayObject' ),
	_import( 'com.fasejs.display.Graphics' ),
	
	
	
	_class( 'TextField' )._extends( 'DisplayObject', {
		TextField : function( text ) {
//_debug( this, 'TextField', text );
			this._super();
			this.text( text );
		},
		get_text : function () {
			return this.element().innerHTML;
		},
		set_text : function( value ) {
			this.element().innerHTML = value;
		},
		get_textColor : function () {
	// eHow.com http://www.ehow.com/how_7378382_identify-text-font-color-javascript.html#ixzz1NmJ9OS6Q
			 	var element = this.element();
				var textColor = element.style.color;
				if ( element.currentStyle ) {
					textColor = element.currentStyle.color;
				} else if ( window.getComputedStyle ) {
					textColor = document.defaultView.getComputedStyle( element, null ).getPropertyValue( 'color' );
				};
				return Graphics.unrgba( textColor );
		},
		set_textColor : function( value ) {
			 this.element().style.color = Graphics.rgba( value, 1 );
		}//,
		//TODO: text selection
		// cursorPosition : function( position ) {
			// if ( position === undefined ){
				 // var caretPos = 0;
			    // // IE Support
			    // if ( document.selection ) {
			        // this.element().focus();
			        // var sel = document.selection.createRange();
// 			
			        // sel.moveStart ('character', -this.text().length);
// 			
			        // caretPos = sel.text.length;
			    // }
			    // // Firefox support
			    // else if (this.element().selectionStart || this.element().selectionStart == '0') {
			        // caretPos = ctrl.selectionStart;
			    // }
			    // return (caretPos);
			// }
		    // if(this.element().setSelectionRange)
		    // {
		        // this.element().focus();
		        // this.element().setSelectionRange( position, position );
		    // }
		    // else if (this.element().createTextRange) {
		        // var range = this.element().createTextRange();
		        // range.collapse(true);
		        // range.moveEnd('character', position);
		        // range.moveStart('character', position);
		        // range.select();
		    // }
		// },
	})
);