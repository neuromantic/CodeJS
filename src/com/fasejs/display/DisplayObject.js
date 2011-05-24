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
 // _package( 'com.fasejs.display',
 
 	// _import( 'com.fasejs.events.EventDispatcher' ),
 	// _import( 'com.fasejs.events.MouseEvent' ),
 	// _import( 'com.fasejs.display.Stage' ),
 	
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
				 _this.dispatchMouseEvent( new MouseEvent( MouseEvent.ROLL_OVER, MouseEvent.mouseX( e ), MouseEvent.mouseY( e ) ) ); 
			};
			this.element().onmouseout = function( e ) {
				 _this.dispatchMouseEvent( new MouseEvent( MouseEvent.ROLL_OUT, MouseEvent.mouseX( e ), MouseEvent.mouseY( e ) ) ); 
			};
			this.element().onmousedown = function ( e ) {
				 _this.dispatchMouseEvent( new MouseEvent( MouseEvent.MOUSE_DOWN, MouseEvent.mouseX( e ), MouseEvent.mouseY( e ) ) ); 
			};
			this.element().onmouseup = function ( e ) {
				_this.dispatchMouseEvent( new MouseEvent( MouseEvent.MOUSE_UP, MouseEvent.mouseX( e ), MouseEvent.mouseY( e ) ) ); 
			};
			this.element().onclick = function ( e ) { 
				_this.dispatchMouseEvent( new MouseEvent( MouseEvent.CLICK, MouseEvent.mouseX( e ), MouseEvent.mouseY( e ) ) ); 
			};
			this.visible( this.element().style.display != 'none' );
			this.element().style.position = 'absolute';
			
		},
		dispatchMouseEvent : function( event ) {
			event.target = this;
			if( this._.mouseEnabled ) {
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
			this.stage( this.parent().stage() );
		},
		addChild : function( child ) {
			// _trace( 'adding', child, 'to', this );
			this._children = this._children || [];
			if( child !== this ){
				if( child instanceof DisplayObject ) {
					if ( child.parent() != null) {
						// _trace( 'removing', child, 'from', child.parent() );
						child.parent().removeChild( child );
					};
					// _trace( 'appending element' );
					this.element().appendChild( child.element() );
					child.element().style.zIndex =  this._children.length;
					// _trace('parenting', this, 'to', child );
					child.parent( this );
					this._children.push( child );
				}else{
					_trace( child , 'is not a' , DisplayObject );
				};
			}else{
				throw new Error('You cannot addChild something to itself.')
			};
		},
		removeChild : function( child ) {
			this.element().removeChild( child.element() );
			this._children.splice( this._children.indexOf( child ), 1 );
			child.parent( null );
		},
		private_stage : null,
		stage : function( value ) {
			if ( value === undefined ) {
				return this._.stage;
			};
			// _trace( 'storing', value, 'as stage of', this );
			this._.stage = value;
			for ( index in this._.children ) {
				// _trace('looping through', this._children, 'index : ',  index );
				// _trace('setting stage of' ,this+"'s child" , this._children[index], 'to', this.stage() );
				if( this._.children[ index ] ) {
					this._.children[ index ].stage( this.stage() );
				};
			};
		},
		private_x : 0,
		x : function( value ) {
			if ( value === undefined ){
				return this._.x;
			};
			this._.x = value;
			var inheritedX = 0
			if( this.parent() ) {
				inheritedX = this.parent().x()
			}
			var x =  value + inheritedX;
			this.element().style.left = this.x() + 'px';
			for ( index in this.children ) {
				var child = this.children[ index ];
				 child.x( child._.x );
			};
		},
		private_y : 0,
		y : function( value ) {
			if ( value === undefined ) {
				return this._.y;
			};
			this._.y = value;
			var inheritedY = ( this.parent() ? this.parent().y() : 0 );
			var y = value + inheritedY;
			this.element().style.top = this.y() + 'px';
			for ( index in this._.children ) {
				var child = this._.children[ index ];
				child.y( child._.y );
			};
		},
		height : function( value ) {
			if( value === undefined ){
				return Number( this.element().offsetHeight );
			}
			this.element().style.height = value+'px';
		},
		width : function( value ) {
			if( value === undefined ) {
				return Number( this.element().offsetWidth );
			};
			this.element().style.width = value+'px';
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
	}
);