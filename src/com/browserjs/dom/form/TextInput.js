/*!
 *
 * TextInput.js
 * com.browser.js.dom.TextInput
 *
 * http://fasejs.com/
 *
 * Copyright 2011, Neuromantic Industries & For Sure, Rad!
 * Licensed under the MIT license.
 *
 */
// _package( 'com.browserjs.dom.form',

	// _import( 'com.fasejs.events.FocusEvent' ),
	
_class( 'TextInput' )._extends( 'Input', {
	private_placeholderText : null,
	placeholderText : function( value ) {
		if ( value === undefined ){
			return this._.placeholderText;
		};
		if( this._.placeholderText == null ) {
			this.addEventListener(FocusEvent.IN,  this._clearPlaceholder );
			this.addEventListener(FocusEvent.OUT, this._applyPlaceholder);
		};
		value == value || '';
		this._.placeholderText = value;
		this.element().setAttribute( 'placeholder', value );
		this._applyPlaceholder(); 
	},
	text : function ( value ) {
		if ( value === undefined ){
			return this.element().value
		}
		this.element().value = value;
	},
	private_placeholderColor : 0xCCCCCC,
	placeholderColor : function( value ) { 
		if( value === undefined ) {
			return this._.placeholderColor;
		}
		this._.placeholderColor = value;
		this._applyPlaceholder()
	},
	private_styleColor : 0,
	TextInput : function( placeholder, type ){
		type = type || 'text';
		this._super( type );
		if( placeholder ){
			this.placeholderText( placeholder );
		};
		this.element().onvalid = ( function( _this ){ 
			return function( e ) { 
				e.preventDefault(); 
				_this._dispatchEvent( new ValidationEvent( ValidationEvent.VALID, _this ) );
			}
		} )( this )
		this.element().oninvalid = ( function( _this ){ 
			return function( e ) {
				e.preventDefault();
				_this._dispatchEvent( new ValidationEvent( ValidationEvent.VOID, _this ) );
			}
		} )( this )
	},
	_applyPlaceholder : function() {
		if ( (! this.text() ) || ( this.text() == '' ) ) {
			if( this.placeholderText() !== undefined ){
				this._.styleColor = this.textColor();
				this.textColor( this.placeholderColor() );
				this.text( this.placeholderText() );
			};
		};
	},
	_clearPlaceholder : function() {
		if( this.text() == this.placeholderText() ){
			this.text('');
		};
		this.textColor( this._.styleColor );
	}//,
} );