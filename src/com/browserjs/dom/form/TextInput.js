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
_package( 'com.browserjs.dom.form',

	 _import( 'com.fasejs.events.FocusEvent' ),
	 _import( 'com.fasejs.events.KeyboardEvent' ),
	 _import( 'com.browserjs.dom.form.events.ValidationEvent' ),
	 _import( 'com.browserjs.dom.form.Input' ),
	 
	_class( 'TextInput' )._extends( 'Input', {
		private_placeholderText : null,
		placeholderText : function( value ) {
			if ( value === undefined ){
				return this._.placeholderText;
			};
			if( this._.placeholderText == null ) {
				this.addEventListener( FocusEvent.IN,  this._.onFocusIn );
				this.addEventListener( FocusEvent.OUT, this._.onFocusOut );
			};
			value == value || '';
			this._.placeholderText = value;
			this.element().setAttribute( 'placeholder', value );
			this._.onFocusOut(); 
		},
		text : function ( value ) {
			if ( value === undefined ){
				return this.element().value
			};
			this.element().value = value;
		},
		private_placeholderColor : 0xCCCCCC,
		placeholderColor : function( value ) { 
			if( value === undefined ) {
				return this._.placeholderColor;
			};
			this._.placeholderColor = value;
			this._.onFocusOut()
		},
		private_styleColor : 0x666666,
		private_valid : false,
		valid : function() { // read only
			return this._.valid;
		},
		private_pattern : /\S/i,
		pattern : function( value ) {
			if ( value === undefined ) {
				return this._.pattern;
			};
_debug( 'setting pattern of', this, 'to', value );
			this._.pattern = value;
			this._.validate();
			this.addEventListener( KeyboardEvent.UP, this._.validate, this);
		},
		TextInput : function( placeholder, type, validationPattern ){
//_debug( this, 'TextInput' );
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
			} )( this );
			this.element().oninvalid = ( function( _this ){ 
				return function( e ) {
					e.preventDefault();
					_this._dispatchEvent( new ValidationEvent( ValidationEvent.VOID, _this ) );
				}
			} )( this );
			this.pattern( validationPattern || this._.pattern );
		},
//FIXME: grab css color first - wont calculate in some browsers
		private_onFocusOut : function() {
			if ( (! this.text() ) || ( this.text() == '' ) || ( this.text() == this.placeholderText() ) ) {
				if( this.placeholderText() !== undefined ){
					//this._.styleColor //this.textColor(); // store the color here
					this.textColor( this.placeholderColor() );
					this.text( this.placeholderText() );
				};
			};
		},
		private_onFocusIn : function() {
			if( this.text() == this.placeholderText() || this.text() == '' ){
				this.addEventListener( KeyboardEvent.DOWN, this._.onKeyDown );
				
			};
		},
		private_onKeyDown : function ( e ) {
_debug( 'clearing placeholder' );
			this.removeEventListener( KeyboardEvent.DOWN, this._.onKeyDown );
			if ( this.text() == this.placeholderText() ) { 
				this.textColor( this._.styleColor );// use stored color here
			 	this.text('');
			}
		},
		private_validate : function () {
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
			};
		},
		private_keyUpHandler : function ( event ) {
			this._.validate();
		}//,
	})
);