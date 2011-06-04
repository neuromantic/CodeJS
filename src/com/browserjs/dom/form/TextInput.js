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
			this.addEventListener( FocusEvent.IN,  this._clearPlaceholder );
			this.addEventListener( FocusEvent.OUT, this._applyPlaceholder );
			this.addEventListener( KeyboardEvent.DOWN, function(){
				if ( this.text() == this.placeholderText() ) { 
				 	this.text('');
				} 
			}, this );
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
	private_styleColor : 0x666666,
	private_valid : false,
	valid : function() {
		return this._.valid;
	},
	private_pattern : /\S/i,
	pattern : function( value ) {
		if ( value === undefined ) {
			return this._.pattern;
		};
		this._.pattern = value;
		this._validate();
	},
	_validate : function () {
		if ( this.text() != this._.placeholderText && this._.pattern instanceof RegExp ){
			var str = this.text();
			var filter = this._.pattern;
			if (! this._.valid ) {
				if ( filter.test( str ) ) {
					this._.valid = true;
					this._dispatchEvent( new ValidationEvent( ValidationEvent.VALID ), this );
				};
			} else {
				if (! filter.test( str ) ) {
					this._.valid = false;
					this._dispatchEvent( new ValidationEvent( ValidationEvent.VOID ), this );
				};
			};
		} 
	},
	_keyUpHandler : function ( event ) {
		this._validate();
	},
	TextInput : function( placeholder, type, validationPattern ){
		type = type || 'text';
		this._.pattern = validationPattern || this._.pattern;
		this._super( type );
		if( placeholder ){
			this.placeholderText( placeholder );
		};
		this.element().onvalid = ( function( _this ){ 
			return function( e ) { 
				e.preventDefault(); 
				_this._dispatchEvent( new ValidationEvent( ValidationEvent.VALID, _this ) );
			}
		} )( this );
		this.element().oninvalid = ( function( _this ){ 
			return function( e ) {
				e.preventDefault();
				_this._dispatchEvent( new ValidationEvent( ValidationEvent.VOID, _this ) );
			}
		} )( this );
		this.addEventListener( KeyboardEvent.UP, this._keyUpHandler, this );
		this.pattern(validationPattern);
	},
//FIXME: grab css color first - wont calculate in some browsers
	_applyPlaceholder : function() {
		if ( (! this.text() ) || ( this.text() == '' ) || ( this.text() == this.placeholderText() ) ) {
			if( this.placeholderText() !== undefined ){
				//this._.styleColor //this.textColor(); // store the color here
				this.textColor( this.placeholderColor() );
				this.text( this.placeholderText() );
			};
		};
	},
	_clearPlaceholder : function() {
		this.textColor( this._.styleColor );// use stored color here
		if( this.text() == this.placeholderText() || this.text() == '' ){
			this.text( this.placeholderText() );
			Tween.delayedCall( 0, function(){ this.select() }, this.element() );
		};
	}//,
} );