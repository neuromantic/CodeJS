/*!
 *
 * TextInput.js
 * com.neuromantic.arete.dom.elements.form.inputs.TextInput
 *
 */
_package( 'com.neuromantic.arete.dom.elements.form.inputs',

	_import( 'com.neuromantic.arete.events.FocusEvent' ),
	_import( 'com.neuromantic.arete.events.KeyboardEvent' ),
	_import( 'ccom.neuromantic.arete.form.events.ValidationEvent' ),
	_import( 'com.neuromantic.arete.dom.form.Input' ),
	 
	_class( 'TextInput' )._extends( 'Input', {
		private_placeholderText : null,
		get_placeholderText : function () {
			return this._.placeholderText;
		},
		set_placeholderText : function( value ) {
			if( this._.placeholderText == null ) {
				this.on( FocusEvent.IN,  this._.onFocusIn );
				this.on( FocusEvent.OUT, this._.onFocusOut );
			};
			value == value || '';
			this._.placeholderText = value;
			this._.tag.placeholder = value;
			this._.onFocusOut(); 
		},
		get_text : function () {
			return this.value();
		},
		set_text : function ( value ) {
			this.value = value;
		},
		private_placeholderColor : 0xCCCCCC,
		get_placeholderColor : function () { 
			return this._.placeholderColor;
		},
		set_placeholderColor : function( value ) { 
			this._.placeholderColor = value;
			this._.onFocusOut()
		},
		private_styleColor : 0x666666,
		private_valid : false,
		get_valid : function() { // read only
			return this._.valid;
		},
		private_pattern : /\S/i,
		get_pattern : function( value ) {
			return this._.pattern;
		},
		set_pattern : function( value ) {
			this._.pattern = value;
			this._.validate();
			this.on( KeyboardEvent.UP, this._.validate);
		},
		private_onvalid : function ( e ){
			this.notify( new ValidationEvent( ValidationEvent.VALID ) );
			e.preventDefault();
		},
		private_oninvalid : function ( e ){
			this.notify( new ValidationEvent( ValidationEvent.INVALID ) );
			e.preventDefault();
		},
		TextInput : function( placeholder, type, validationPattern ){
			type = type || 'text';
			validationPattern = validationPattern || /\S/i;
			this._super( type );
			if( placeholder ){
				this.placeholderText( placeholder );
			};
			this.pattern( validationPattern );
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
				this.on( KeyboardEvent.DOWN, this._.onKeyDown );
				
			};
		},
		private_onKeyDown : function ( e ) {
			this.off( KeyboardEvent.DOWN, this._.onKeyDown );
			if ( this.text() == this.placeholderText() ) { 
				this.textColor( this._.styleColor );// use stored color here
			 	this.text('');
_debug( this, 'clearing placeholder' );
			}
		},
		private_validate : function () {
_debug( this, 'validating against', this._.pattern );
			if ( this.text() != this._.placeholderText && this._.pattern instanceof RegExp ){
				var str = this.text();
				var filter = this._.pattern;
				if (! this._.valid ) {
					if ( filter.test( str ) ) {
_debug( this, 'valid');
						this._.valid = true;
						this.notify( new ValidationEvent( ValidationEvent.VALID ) );
					};
				} else {
					if (! filter.test( str ) ) {
_debug( this, 'invalid');
						this._.valid = false;
						this.notify( new ValidationEvent( ValidationEvent.INVALID ) );
					};
				};
			};
		},
		private_keyUpHandler : function ( event ) {
			this._.validate();
		}//,
	})
);