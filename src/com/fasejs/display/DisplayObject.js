/*!
 *
 * DisplayObject.js
 * com.fasejs.display.DisplayObject
 *
 * https://github.com/neuromantic/CodeJS/
 *
 * Copyright 2011, Neuromantic Industries & For Sure, Rad!
 * Licensed under the MIT license.
 *
 */
 _package( 'com.fasejs.display',
 
 	_import( 'com.fasejs.events.EventDispatcher' ),
 	_import( 'com.fasejs.events.MouseEvent' ),
 	_import( 'com.fasejs.display.Stage' ),
 	_import( 'com.jquery.$'),
 	
	_class( 'DisplayObject' )._extends( 'EventDispatcher', {
		
		static_count : 0,
		// private_mouseEnabled : true,
		// get_mouseEnabled : function () {
			// return this._.mouseEnabled;
		//},
		//set_mouseEnabled : function( value ) {
			// this._.mouseEnabled = value;
		// },
		DisplayObject : function( hostElement ) {
			this._super();
			hostElement = hostElement || document.createElement( 'div' );
			this.element( hostElement );
		},
		private_element : null,
		get_element : function () {
			return this._.element;
		},
		set_element : function ( value ) {
			this._.element = value;
			this._.element.className = this._className;
			if( this._.element.id ){
				this.name( this._.element.id )
			}else if( this._.name ) {
				this._.element.id = this._.name;
			};
			var _this = this;
			this._.element.onmouseover = function( e ) {
				 _this._.dispatchMouseEvent( new MouseEvent( MouseEvent.OVER, MouseEvent.mouseX( e ), MouseEvent.mouseY( e ) ) ); 
			};
			this._.element.onmouseout = function( e ) {
				 _this._.dispatchMouseEvent( new MouseEvent( MouseEvent.OUT, MouseEvent.mouseX( e ), MouseEvent.mouseY( e ) ) ); 
			};
			this._.element.onmousedown = function ( e ) {
				 _this._.dispatchMouseEvent( new MouseEvent( MouseEvent.DOWN, MouseEvent.mouseX( e ), MouseEvent.mouseY( e ) ) ); 
			};
			this._.element.onmouseup = function ( e ) {
				_this._.dispatchMouseEvent( new MouseEvent( MouseEvent.UP, MouseEvent.mouseX( e ), MouseEvent.mouseY( e ) ) ); 
			};
			this._.element.onclick = function ( e ) {
				_this._.dispatchMouseEvent( new MouseEvent( MouseEvent.CLICK, MouseEvent.mouseX( e ), MouseEvent.mouseY( e ) ) ); 
			};
			this._.element.onkeydown = function ( e ) { 
				_this._dispatchEvent( new KeyboardEvent( KeyboardEvent.DOWN ) ); 
			};
			this._.element.onkeyup = function ( e ) { 
				_this._dispatchEvent( new KeyboardEvent( KeyboardEvent.UP ) ); 
			};
			this._.element.onkeypress = function ( e ) { 
				_this._dispatchEvent( new KeyboardEvent( KeyboardEvent.PRESS ) ); 
			};
			this._.element.onfocus = function ( e ) { 
				_this._dispatchEvent( new FocusEvent( FocusEvent.IN ), _this );
			};
			this._.element.onblur = function () {
				_this._dispatchEvent( new FocusEvent( FocusEvent.OUT ), _this );
			};
			this._.element.onchange = function () {
				_this._dispatchEvent( new Event( Event.CHANGE ), _this );
			};
			
			this.visible( this._.element.style.display != 'none' );
			this._.element.style.position = 'absolute';
			this._.element.style.whiteSpace = 'nowrap';
			this._.element.style.minWidth = 0;
			this._.element.style.minHeight = 0;
			
		},
		private_dispatchMouseEvent : function( event ) {
			if( this._.mouseEnabled ) {
				event.target = this;
				this._dispatchEvent( event );
			};
		},
		private_mouseX : 0,
		get_mouseX : function () {
			return this._.mouseX;
		},
		set_mouseX : function( value ) {
			this._.mouseX = value - this._.x;
			for( var child in this.children ) {
				child.mouseX( this.mouseX() );
			};
		},
		private_mouseY : 0,
		get_mouseY : function () {
			return this._.mouseY
		},
		set_mouseY : function( value ) {
			this._.mouseY = value - this._.y;
			for( var child in this.children ) {
				child.mouseY( this.mouseY() );
			};
		},
		set_name : function( value ) {
			this._.name = value;
			if( this._.element ) {
				this._.element.id = this._.name;
			};
		},
		get_name : function () {
				return this._.name;
		},
		private_stage : null,
		get_stage : function( value ) {
			return this._.stage;
		},
		set_stage : function( value ) {
			this._.stage = value;
			for ( index in this._.children ) {
				if( this._.children[ index ] ) {
					this._.children[ index ].stage( this._.stage );
				};
			};
		},
		get_parent : function () {
			return this._.parent;
		},
		set_parent : function( value ) {
			this._.parent =  value;
			this.stage( this._.parent ? this._.parent.stage() : null );
		},
		private_children : [],
		contains : function( potentialChild ) {
			if ( this._.children.indexOf( potentialChild ) > - 1 ) {
				return true;
			}
			for( var index in this._.children ) {
				var child = this._.children[ index ];
				if ( child.contains( potentialChild ) ){
					return true;
				}
			}
			return false;
		},
		addChild : function( child ) {
// _debug( this, 'addChild', child, child._.element, child.element(), child.element );
			if( child !== this ){
				if( child instanceof DisplayObject ) {
					if ( child.parent() != null ) {
						child.parent().removeChild( child );
					};
					this._.element.appendChild( child.element() );
					child.element().style.zIndex =  this._.children.length;
					child.parent( this );
					this._.children.push( child );
				}else{
					_trace( child , 'is not a' , DisplayObject );
				};
				this._.measure( true );
			} else {
				throw new Error('You cannot addChild something to itself.')
			};
		},
		private_measure : function ( shrunk ) {
// _debug( this, '_measure', shrunk );
			if( shrunk ) {
				this._.element.style.width = '0px'
				this._.element.style.height = '0px'
			}
			for ( var index in this._.children ){
				var child = this._.children[ index ];
				this._.element.style.width = Math.max( this.width(), child.x() + child.width() ) + 'px';
				this._.element.style.height = Math.max( this.height(), child.y() + child.height() ) + 'px';
			}
		},
		removeChild : function( child ) {
			this._.element.removeChild( child.element() );
			this._.children.splice( this._.children.indexOf( child ), 1 );
			child.parent( null );
			this._.measure();
		},
		private_x : 0,
		get_x : function( value ) {
			return this._.x;
		},
		set_x : function( value ) {
			this._.x = value;
			if( this._.parent ) {
				var inheritedX = ( this._.parent ? this._.parent.y() : 0 );
				var x = value + inheritedX;
				this._.element.style.left = this._.x + 'px';
				for ( index in this._.children ) {
					var child = this._.children[ index ];
					child.x( child._.x );
				};
				this._.parent._.measure( true );
			};
		},
		private_y : 0,
		get_y : function () {
				return this._.y;
		},
		set_y : function( value ) {
			this._.y = value;
			if( this._.parent ) {
				var inheritedY = ( this._.parent ? this._.parent.y() : 0 );
				var y = value + inheritedY;
				this._.element.style.top = this._.y + 'px';
				for ( index in this._.children ) {
					var child = this._.children[ index ];
					child.y( child._.y );
				};
				this._.parent._.measure( true );
			};
		},
		private_rotation : 0,
		get_rotation : function () {
				return this._.rotation;
		},
		set_rotation : function ( value ) {
			$( this._.element ).css( {
			    'transform': 'rotate('+value+'deg)',
			    '-moz-transform': 'rotate('+value+'deg)',
			    '-o-transform': 'rotate('+value+'deg)',
			    '-webkit-transform': 'rotate('+value+'deg)',
			});
			this._.rotation = value;
			//TODO: remove jQuery dependency, implement cross-browser rotation
			function degreesToRadians(num) {
				return (num) * Math.PI / 180;
			}
			function createIEMatrixString(M) {
				return 'M11=' + M.e(1, 1) + ', M12=' + M.e(1,2) + ', M21=' + M.e(2,1) + ', M22=' + M.e(2,2);
			}
			function rotateElement(e, deg) {
				deg_str = deg + "";
				rotate_transform = "rotate(" + deg + "deg)";
				matrix_str = createIEMatrixString(Matrix.Rotation(degreesToRadians(deg)));
				filter_str = "progid:DXImageTransform.Microsoft.Matrix(sizingMethod='auto expand', " + matrix_str + ")";
			
				e.style["rotation"] = deg_str + "deg"; // CSS3
				e.style.MozTransform = rotate_transform; // Moz
				e.style.OTransform = rotate_transform; // Opera
				e.style.WebkitTransform = rotate_transform; // Webkit/Safari/Chrome
				e.style.filter = filter_str; // IE 6/7
				e.style.MsFilter = filter_str; // IE 8
				e.style["zoom"] = "1"; // ??? Probably IEs
			}
			
		},
		get_height : function( ) {
			return Number( this._.element.offsetHeight );
		},
		set_height : function( value ) {
			this._.element.style.height = value +'px';
			this._.parent ? this._.parent._.measure() : 0;
		},
		get_width : function () {
				return Number( this._.element.offsetWidth );
		},
		set_width : function( value ) {
			this._.element.style.width = value + 'px';
			this._.parent ? this._.parent._.measure() : 0;
		},
		private_alpha : 1,
		get_alpha : function () {
				return this._.alpha;
		},
		set_alpha : function ( value ) {
			this._.element.style.opacity = value;
	   		// this._.element.style.filter = 'alpha(opacity=' + value * 100 + ')';
	   		this._.alpha = value;
		},
		private_visible : null,
		get_visible : function () {
				if(this._.visible === null){
					this._.visible = this._.element.style.display != 'none';
				};
				return this._.visible;
		},
		set_visible : function ( value ) {
			this._.visible = value;
			this._.element.style.display = this._.visible ? 'block' : 'none';
			for( index in this._.children ) {
				this._.children[ index ].visible( this._.visible );
			};
			
		},
		get_autoAlpha : function () {
				return this._.alpha;
		},
		set_autoAlpha : function (value) {
			this.alpha( value );
			this.visible( this._.alpha > 0 );
		},
		toString : function () {
			return ( this._.name ) || this._super.toString();
		}
	})
);