/*!
 *
 * DisplayObject.js
 * com.fasejs.display.DisplayObject
 *
 * http://fasejs.com/
 *
 * Copyright 2011, Neuromantic Industries & For Sure, Rad!
 * Licensed under the MIT license.
 *
 */
 _package( 'com.fasejs.display',
 
 	_import( 'com.fasejs.events.EventDispatcher' ),
 	_import( 'com.fasejs.events.MouseEvent' ),
 	_import( 'com.fasejs.display.Stage' ),
 	
	_class( 'DisplayObject' )._extends( 'EventDispatcher', {
		
		static_count : 0,
		private_mouseEnabled : true,
		mouseEnabled : function( value ) {
			if ( value === undefined ){
				return this._mouseEnabled;
			}
			this.mouseEnabled = value;
		},
		DisplayObject : function( contents ) {
//_debug( this, 'DisplayObject', contents );
			this._super();
			this.element( contents || document.createElement( 'div' ) );
		},
		private_element : null,
		element : function( value ) {
			if( value === undefined ) {
				return  this._.element;
			};
			this._.element = value;
			this.element().className = this._codeName;
			if( this.element().id ){
				this.name( this.element().id )
			}else if( this.name() ) {
				this.element().id = this.name();
			};
			var _this = this;
			this.element().onmouseover = function( e ) {
				 _this._dispatchMouseEvent( new MouseEvent( MouseEvent.OVER, MouseEvent.mouseX( e ), MouseEvent.mouseY( e ) ) ); 
			};
			this.element().onmouseout = function( e ) {
				 _this._dispatchMouseEvent( new MouseEvent( MouseEvent.OUT, MouseEvent.mouseX( e ), MouseEvent.mouseY( e ) ) ); 
			};
			this.element().onmousedown = function ( e ) {
				 _this._dispatchMouseEvent( new MouseEvent( MouseEvent.DOWN, MouseEvent.mouseX( e ), MouseEvent.mouseY( e ) ) ); 
			};
			this.element().onmouseup = function ( e ) {
				_this._dispatchMouseEvent( new MouseEvent( MouseEvent.UP, MouseEvent.mouseX( e ), MouseEvent.mouseY( e ) ) ); 
			};
			this.element().onclick = function ( e ) {
				_this._dispatchMouseEvent( new MouseEvent( MouseEvent.CLICK, MouseEvent.mouseX( e ), MouseEvent.mouseY( e ) ) ); 
			};
			this.element().onkeydown = function ( e ) { 
				_this._dispatchEvent( new KeyboardEvent( KeyboardEvent.DOWN ) ); 
			};
			this.element().onkeyup = function ( e ) { 
				_this._dispatchEvent( new KeyboardEvent( KeyboardEvent.UP ) ); 
			};
			this.element().onkeypress = function ( e ) { 
				_this._dispatchEvent( new KeyboardEvent( KeyboardEvent.PRESS ) ); 
			};
			this.element().onfocus = function ( e ) { 
				_this._dispatchEvent( new FocusEvent( FocusEvent.IN ), _this );
			};
			this.element().onblur = function () {
				_this._dispatchEvent( new FocusEvent( FocusEvent.OUT ), _this );
			};
			this.element().onchange = function () {
				_this._dispatchEvent( new Event( Event.CHANGE ), _this );
			};
			
			this.visible( this.element().style.display != 'none' );
			this.element().style.position = 'absolute';
			this.element().style.whiteSpace = 'nowrap';
			this.element().style.minWidth = 0;
			this.element().style.minHeight = 0;
			
		},
		_dispatchMouseEvent : function( event ) {
			if( this._.mouseEnabled ) {
				event.target = this;
				this._dispatchEvent( event );
			};
		},
		private_mouseX : 0,
		mouseX : function( value ) {
			if ( value === undefined ) {
				return this._.mouseX;
			};
			this._.mouseX = value - this.x();
			for( var child in this.children ) {
				child.mouseX( this.mouseX() );
			};
		},
		private_mouseY : 0,
		mouseY : function( value ) {
			if ( value === undefined ) {
				return this._.mouseY
			};
			this._.mouseY = value - this.y();
			for( var child in this.children ) {
				child.mouseY( this.mouseY() );
			};
		},
		name : function( value ) {
			if( value === undefined ) {
				return this._.name;
			};
			this._.name = value;
			if( this.element() ) {
				this.element().id = this.name();
			};
		},
		parent : function( value ) {
			if ( value === undefined ) {
				return this._parent;
			};
			// _trace( 'storing', value, 'as parent of', this );
			this._parent =  value;
			// _trace( 'setting stage of', this, 'to', this.parent().stage() );
			
			this.stage( this.parent() ? this.parent().stage() : null );
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
			if( child !== this ){
				if( child instanceof DisplayObject ) {
					if ( child.parent() != null) {
						child.parent().removeChild( child );
					};
					this.element().appendChild( child.element() );
					child.element().style.zIndex =  this._.children.length;
					child.parent( this );
					this._.children.push( child );
				}else{
					_trace( child , 'is not a' , DisplayObject );
				};
				this._measure( true );
			}else{
				throw new Error('You cannot addChild something to itself.')
			};
		},
		_measure : function ( shrunk ) {
			if( shrunk ) {
				this.width( 0 );
				this.height( 0 );
			}
			for ( var index in this._.children ){
				var child = this._.children[ index ];
				this.width( Math.max( this.width()  , child.x() + child.width() ) );
				this.height( Math.max( this.height(), child.y() + child.height() ) );
			}
		},
		removeChild : function( child ) {
			this.element().removeChild( child.element() );
			this._.children.splice( this._.children.indexOf( child ), 1 );
			child.parent( null );
			this._measure();
		},
		private_stage : null,
		stage : function( value ) {
			if ( value === undefined ) {
				return this._.stage;
			};
			this._.stage = value;
			for ( index in this._.children ) {
				if( this._.children[ index ] ) {
					this._.children[ index ].stage( this.stage() );
				};
			};
		},
		private_x : 0,
		x : function( value ) {
			if ( value === undefined ) {
				return this._.x;
			};
			this._.x = value;
			if( this.parent() ) {
				var inheritedX = ( this.parent() ? this.parent().y() : 0 );
				var x = value + inheritedX;
				this.element().style.left = this.x() + 'px';
				for ( index in this._.children ) {
					var child = this._.children[ index ];
					child.x( child._.x );
				};
				this.parent()._measure( true );
			};
		},
		private_y : 0,
		y : function( value ) {
			if ( value === undefined ) {
				return this._.y;
			};
			this._.y = value;
			if( this.parent() ) {
				var inheritedY = ( this.parent() ? this.parent().y() : 0 );
				var y = value + inheritedY;
				this.element().style.top = this.y() + 'px';
				for ( index in this._.children ) {
					var child = this._.children[ index ];
					child.y( child._.y );
				};
				this.parent()._measure( true );
			};
		},
		height : function( value ) {
			if( value === undefined ){
				return Number( this.element().offsetHeight );
			}
			this.element().style.height = value +'px';
			this.parent() ? this.parent()._measure() : 0;
		},
		width : function( value ) {
			if( value === undefined ){
				return Number( this.element().offsetWidth );
			};
			this.element().style.width = value + 'px';
			this.parent() ? this.parent()._measure() : 0;
		},
		private_alpha : 1,
		alpha : function ( value ) {
			if( value === undefined ){
				return this._.alpha;
				
			};
			this.element().style.opacity = value;
	   		// this.element().style.filter = 'alpha(opacity=' + value * 100 + ')';
	   		this._.alpha = value;
		},
		private_visible : null,
		visible : function( value ) {
			if ( value === undefined ) {
				if(this._.value === null){
					this._.visible = this.element().style.display != 'none';
				};
				return this._.visible;
			};
			this._.visible = value;
			this.element().style.display = this.visible() ? 'block' : 'none';
			for( index in this._.children ) {
				this._.children[ index ].visible( this.visible() );
			};
			
		},
		autoAlpha : function (value) {
			if ( value === undefined ) {
				return this.alpha();
			}
			this.alpha( value );
			this.visible( this.alpha() > 0 );
		},
		toString : function () {
			return ( this.name() ) || this._super.toString();
		}
	})
);