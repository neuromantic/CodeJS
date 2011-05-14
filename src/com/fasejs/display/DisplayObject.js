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
 
_class('DisplayObject')._extends('EventDispatcher', {
	
	static_count : 0,
	_mouseEnabled : true,
	mouseEnabled : function(value){
		if ( value === undefined ){
			return this._mouseEnabled;
		}
		this.mouseEnabled = value;
	},
	init : function( contents ) {
		_trace( 'DisplayObject init' );
		this.element( contents || document.createElement( 'div' ) );
		
	},
	_element : null,
	element : function( value ) {
		if( value === undefined ) {
			return  this._element || ( this._element = null );
		};
		this._element = value;
		this.element().className = this._codeName;
		if( this.element().id ){
			this.name( this.element().id )
		}else if( this.name() ) {
			this.element().id = this.name();
		};
		this.element().dispatcher = this;
		this._addEvents();
		this.element().style.visible = ( this.element().style.visible == 'visible' ) ? 'inherit' : 'hidden';
		this.element().style.position = 'absolute';
	},
	dispatchMouseEvent : function( event ) {
		event.target = this;
		_trace( event.type );
		if( this._mouseEnabled ) {
			this.dispatchEvent( event );
		}
	},
	_addEvents : function(){
		var _this = this;
		this.element().onmouseover = function (){
			 // _this.dispatchMouseEvent( new MouseEvent( MouseEvent.MOUSE_OVER ) );
			 _this.dispatchMouseEvent( new MouseEvent( MouseEvent.ROLL_OVER ) );
		};
		this.element().onmouseout = function(e) {
			// if (!e) var e = window.event;
			// var tg = (window.event) ? e.srcElement : e.target;
			// if (tg.nodeName != 'DIV') return;
			// var reltg = (e.relatedTarget) ? e.relatedTarget : e.toElement;
			// while ( reltg &&  reltg != tg && reltg.nodeName != 'body') {
				// reltg = reltg.parentNode;
				// if (reltg== tg){
					 // _this.dispatchMouseEvent( new MouseEvent( MouseEvent.MOUSE_OUT ) ) ;
					  // return;
				// };
			// };
			_this.dispatchMouseEvent( new MouseEvent( MouseEvent.ROLL_OUT ) );
		};
		this.element().onmousedown = function () { _this.dispatchEvent( new MouseEvent( MouseEvent.MOUSE_DOWN ) ) };
		this.element().onmouseup = function () { _this.dispatchEvent( new MouseEvent( MouseEvent.MOUSE_UP ) ) };
		this.element().onclick = function () { _this.dispatchMouseEvent( new MouseEvent( MouseEvent.CLICK ) ) };
	},
	name : function( value ) {
		if( value === undefined ) {
			return this._name || ( this._name = null );
		};
		this._name = value;
		if( this.element() ) {
			this.element().id = this.name();
		};
	},
	parent : function( value ) {
		if ( value === undefined ) {
			return this._parent;
		};
		_trace( 'storing', value, 'as parent of', this );
		this._parent =  value;
		_trace( 'setting stage of', this, 'to', this.parent().stage() );
		this.stage( this.parent().stage() );
	},
	addChild : function( child ) {
		_trace( 'adding', child, 'to', this );
		
		this._children = this._children || [];
		if( child !== this ){
			if( child instanceof DisplayObject ) {
				if ( child.parent() != null) {
					_trace( 'removing', child, 'from', child.parent() );
					child.parent().removeChild( child );
				};
				_trace( 'appending element' );
				this.element().appendChild( child.element() );
				child.element().style.zIndex =  this._children.length;
				_trace('parenting', this, 'to', child )
				child.parent( this );
				this._children.push( child );
			}else{
				_trace( child , 'is not a' , DisplayObject );
			};
		}else{
			throw new Error('You cannot addChild something to itself.')
		}
	},
	removeChild : function(child) {
		this.element().removeChild( child.element() );
		this._children.splice( this._children.indexOf(child), 1 );
		child.parent( null );
	},
	_stage : null,
	stage : function( value ) {
		if ( value === undefined ) {
			return this._stage;
		};
		_trace( 'storing', value, 'as stage of', this );
		this._stage = value;
		for ( index in this._children ) {
			_trace('looping through', this._children, 'index : ',  index );
			_trace('setting stage of' ,this+"'s child" , this._children[index], 'to', this.stage() );
			if( this._children[index] ) {
				this._children[index].stage( this.stage() );
			};
		};
	},
	_x : 0,
	x : function( value ) {
		if ( value === undefined ){
			return this._x;
		};
		this._x = value;
		var inheritedX = 0
		if( this.parent() ) {
			inheritedX = this.parent().x()
		}
		var x =  value + inheritedX;
		this.element().style.left = this.x() + 'px';
		for ( index in this.children ) {
			var child = this.children[ index ];
			 child.x( child._x );
		};
	},
	_y : 0,
	y : function( value ) {
		if ( value === undefined ) {
			return this._y;
		};
		this._y = value;
		var inheritedY = ( this.parent() ? this.parent().y() : 0 );
		var y = value + inheritedY;
		this.element().style.top = this.y() + 'px';
		for ( index in this.children ) {
			this.children[ index ].y( this.children[ index ]._y );
		};
	},
	height : function( value ) {
		if( value == undefined ){
			return Number( this.element().offsetHeight );
		}
		this.element().offsetHeight = value;
	},
	width : function( value ) {
		if( value === undefined ) {
			return Number( this.element().offsetWidth );
		};
		this.element().styleoffsetWidth = value;
	},
	_alpha : 0,
	alpha : function( value ) {
		if( value === undefined ) {
			return _alpha;
		};
		this.element().style.opacity = value;
   		this.element().style.filter = 'alpha(opacity=' + value * 100 + ')';
   		this._alpha = value;
	},
	visible : function( value ) {
		if ( value === undefined ) {
			return this.element().style.visible === 'visible';
		};
		this.element().style.visiblity = ( value ) ? 'visible' : 'hidden';
		for( index in _children ) {
			_children[ index ].visible( 'value' );
		};
	},
	toString : function(){
		return ( this.name() ) || this._codeName;
	}
});