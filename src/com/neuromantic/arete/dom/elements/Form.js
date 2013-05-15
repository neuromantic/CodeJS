/*!
 *
 * Form.js
 * com.neuromantic.arete.dom.elements.Form
 *
 */
_package( 'com.neuromantic.arete.dom.elements',
    _import( 'com.neuromantic.arete.dom.Element' ),
    _class( 'Form' )._extends( 'Element', {
        static_TYPE : 'form',
        Form : function ( atts ){
            this._super( Form.TYPE, atts );
        },
		get_elements : function (){
			var els = this._.tag.elements;
			var ret = [];
			for ( var i = 0; i < els.length; i ++){
				ret[ i ] = new Element( els[i] );
			}
			return ret	
		},
		set_acceptCharset : function ( value ){
			this._.tag.acceptCharset = value;
		},
		get_acceptCharset : function (){
			return this._.tag.acceptCharset;
		},
		set_action : function ( value ){
			this._.tag.action = value;
		},
		get_action : function ( ){
			return this._.tag.action;
		},
		set_enctype : function ( value ){
			 this._.tag.enctype = value;
		},
		get_enctype : function ( ){
			return this._.tag.enctype;
		},
		get_length : function () {
			return this._.tag.elements.length;
		},
		set_method : function ( value ){
			this._.tag.method = value;
		},
		get_method : function ( ){
			return this._.tag.method;
		},
		set_name : function ( value ){
			this._.tag.name = value;
		},
		get_name : function (){
			return this._.tag.name;
		}
		set_target : function ( value ) {
			this._.tag.target = value;
		}
		get_target : function () {
			return this._.tag.target;
		}
		reset : function (){
			this._.tag.reset();
		}
		submit: function () {
			this._.tag.submit();
		}
    })
);