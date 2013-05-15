/*!
 *
 * Input.js
 * com.neuromantic.arete.dom.elements.form.Input
 *
 *
 */
_package( 'com.neuromantic.arete.dom.elements.form',
	_import( 'com.neuromantic.arete.dom.Element' ),
	_import( 'com.neuromantic.arete.dom.elements.Form' ),
	
	_class( 'Input' )._extends( 'Element', {
		static_TYPE : 'input',
		Input : function( type ){
			this._super( Input.TYPE );
			this.type( type );
		},
		get_type : function () {
			return this._.tag.type;
		},
		set_type : function ( value ){
			this._.tag.type = value;
		},
		set_defaultValue : function ( value ) {
			this._.tag.defaultValue = value;	
		},
		get_defaultValue : function () {
			return this._.tag.defaultValue;	
		},
		set_disabled : function ( value ) {
			this._.tag.disabled = value
		},
		get_disabled:function () {
			return this._.tag.disabled
		},
		get_form : function () {
			return new Form(this._.tag.form);
		},
		set_maxLength : function ( value ){
			this._.tag.maxLength = value;
		},
		get_maxLength : function (  ){
			return this._.tag.maxLength;
		},
		set_name : function ( value ){
			this._.tag.name = value,
		},
		get_name : function (){
			return this._.tag.name;
		},
		set_readOnly : function (value ) {
			this._.tag.readOnly = value;
		},
		get_readOnly : function ( ) {
			return this._.tag.readOnly
		},
		set_size : function ( value ){
			this._.tag.size = value;
		},
		get_size : function (){
			return this._.tag.size;
		},		
		set_value:function( value ){	
			this._.tag.value = value;
		},
		get_value:function () {
			return this._.tag.value;
		}
	})
);
