/*!
 *
 * Element.js
 * com.neuromantic.arete.dom.Element
 *
 */
_package('com.neuromantic.arete.dom',
    _import( 'visibility'),
    _import('com.neuromantic.arete.events.Notifier'),
    _import('com.neuromantic.arete.events.Event'),
    _import('com.neuromantic.arete.events.MouseEvent'),
    _import('com.neuromantic.arete.events.KeyboardEvent'),
    _import('com.neuromantic.arete.events.FocusEvent'),
    _class('Element')._extends('Notifier', {
        static_byID: function( id , root ) {
            root = root || document;
            var el = root.getElementById( id );
            if ( el ) {
                return new Element( el );
            }
            return null;
        },
        static_byClass: function( className, root ) {
            root = root || document;
            var tags = root.getElementsByClassName(className);
            var list = [];
            if ( tags ) {
                for ( var i = 0; i < tags.length; i++ ) {
                    list[i] = new Element( tags[i] );
                }
            }
            return list;
        },
        static_all : function( ElementClass, root ) {
            root = root || document;
            var tags = root.getElementsByTagName(ElementClass.TYPE);
            var list = []
            for ( var i = 0; i < tags.length; i++ ) {
                list[i] = new Element(tags[i]);
            }
            return list;
        },
        static_first : function ( selector, root ){
            root = root || document;
            var results = Element.find( selector );
            return results[0] || results;
        },
        static_find : function ( selector, root ){
            root = root || document;
            if (selector.TYPE){
                return Element.all( selector );
            }
            switch( selector.charAt( 0 ) ){
                case '#' :
                    return Element.byID( selector.slice( 1 ), root );
                case '.' : 
                    return Element.byClass( selector.slice( 1 ), root );
                default :
                    return Element.all(selector, root );
           }
        },
        private_tag: null,
        private_alpha: 1,
        private_visible: null,
        private_width: null,
        private_height: null,
        private_y: 0,
        private_x: 0,
        private_mouseEnabled : true,
        private_onmouseover : function(e) {
            this._.mouseNotify(MouseEvent.OVER, e);
        },
        private_onmouseout : function(e) {
            this._.mouseNotify(MouseEvent.OUT, e);
        },
        private_onmousedown : function(e) {
            this._.mouseNotify(MouseEvent.DOWN, e);
        },
        private_onmouseup : function(e) {
            this._.mouseNotify(MouseEvent.UP, e);
        },
        private_onclick : function(e) {
            this._.mouseNotify(MouseEvent.CLICK, e);
        },
        private_onkeydown : function(e) {
            this._.keyNotify(KeyboardEvent.DOWN, e);
        },
        private_onkeyup : function(e) {
            this._.keyNotify(KeyboardEvent.UP, e);
        },
        private_onkeypress : function(e) {
            this._.notify(KeyboardEvent.PRESS, e);
        },
        private_onfocus : function(e) {
            this._.notify(new FocusEvent(FocusEvent.IN));
        },
        private_onfocus : function(e) {
            this._.notify(new FocusEvent(FocusEvent.IN));
        },
        private_onblur : function() {
            this._.notify(new FocusEvent(FocusEvent.OUT));
        },
        private_onchange : function() {
            this._.notify(new Event(Event.CHANGE));
        },
        private_mouseNotify: function(type, nativeEvent) {
              nativeEvent = nativeEvent || window.event;
            //IE9 & Other Browsers
            if (nativeEvent.stopPropagation) {
              nativeEvent.stopPropagation();
            }
            //IE8 and Lower
            else {
              nativeEvent.cancelBubble = true;
            }
            if (this._.mouseEnabled) {
                this._.notify(new MouseEvent(type));
            }
        },
        private_keyNotify: function(type, nativeEvent) {
            this._.notify(new KeyboardEvent(type));
        },
        Element: function(tag, atts) {
            atts = atts || {};
            if (tag) {
                if ( ( typeof document == 'object' && tag === document ) || ( typeof tag.nodeType === 'number' && tag.attributes && tag.childNodes && tag.cloneNode ) ){
                    this._.tag = tag;
                } else if (typeof tag === 'string') {
                    try {
                        this._.tag = document.createElement(tag);
                        if (typeof atts.className === 'undefined') {
                            atts.className = this._className;
                        }
                        if ( typeof atts.style === 'undefined' || typeof atts.style.position === 'undefined' ) {
                            // this.style( { position: 'absolute' } );
                        }
                    } catch (error) {
                        throw new TypeError('Arete Elements require a valid HTML tag name');
                    }
                } else {
                    throw new TypeError('Arete Elements may only be instantiated with an HTML node or tag name string argument');
                }
                this.tag(atts);
                this._.tag.onmouseover = this._.onmouseover;
                this._.tag.onmouseout = this._.onmouseout;
                this._.tag.onmousedown = this._.onmousedown;
                this._.tag.onmouseup =this._.onmouseup;
                this._.tag.onclick = this._.onclick;
                this._.tag.onkeydown = this._.onkeydown;
                this._.tag.onkeyup = this._.onkeyup;
                this._.tag.onkeypress = this._.onkeypress;
                this._.tag.onfocus = this._.unfocus;
                this._.tag.onblur = this._.onblur;
                this._.tag.onchange = this._.onchange;
            } else {
                throw new TypeError('Arete Elements require an argument on instantiation');
            }
        },
        find : function ( selector ){
            return Element.find( selector, this.tag() );  
        },
        first : function ( selector ){
            return Element.first( selector, this.tag() );  
        },
        append: function(child) {
            this._.tag.appendChild(child.tag());
        },
        replace: function(newChild, oldChild) {
            this._.tag.replaceChild(newChild.tag(), oldChild.tag());
        },
        remove: function(child) {
            if( child ){
                return this._.tag.removeChild(child.tag());
            }
            this.parent().remove(this);
        },
        set_tag: function(value) {
            for (var a in value) {
                if (a === 'style') {
                    this.style(value.style);
                }
                else {
                    this._.tag[a] = value[a];
                }
            }
        },
        get_tag: function() {
            return this._.tag;
        },
        set_parent: function(parent) {
            parent.append(this);
        },
        get_parent: function() {
            if(this._.tag.parentNode){
                return new Element(this._.tag.parentNode);
            }
            return null;
        },
        set_text: function(value) {
            this.tag({
                innerHTML: value
            });
        },
        get_text: function() {
            return this._.tag.innerText || this._.tag.textContent;
        },
        set_style: function(value) {
            for (var s in value) {
                if( typeof s === 'string'){
                    this._.tag.style[s] = value[s];
                }
            }
        },
        get_style: function() {
            if( this._.tag.currentStyle ){ //IE
                return this._.tag.currentStyle;
            }else if ( document.defaultView && document.defaultView.getComputedStyle ){ //Firefox
                return document.defaultView.getComputedStyle(this._.tag, "");
            }
            return this._.tag.style;
        },
        get_height: function() {
            this._.height = this._.height || this._.tag.offsetHeight || 0;
            return Number(this._.height);
        },
        set_height: function(value) {
            this._.height = value;
            this.style({
                height: value + 'px'
            });
        },
        get_width: function() {
            this._.width = this._.width || this._.tag.offsetWidth || 0;
            return Number(this._.width);
        },
        set_width: function(value) {
            this._.width = value;
            this.style({
                width: this._.width + 'px'
            });
        },
        get_x: function(value) {
            return this._.x;
        },
        set_x: function(value) {
            this._.x = value;
            this.style({
                left: this._.x + 'px'
            });
        },
        get_y: function() {
            return this._.y;
        },
        set_y: function(value) {
            this._.y = value;
            this.style({
                top: this._.y + 'px'
            });
        },
        get_alpha: function() {
            return this._.alpha;
        },
        set_alpha: function(value) {
            this._.tag.style.opacity = value;
            this._.tag.style.filter = 'alpha(opacity=' + value * 100 + ')';
            this._.alpha = value;
        },
        get_visible: function() {
            if (this._.visible === null) {
                this._.visible = this._.tag.style.visible != 'hidden';
            }
            return this._.visible;
        },
        set_visible: function(value) {
            this._.visible = value;
            this._.tag.style.visibility = this._.visible ? 'visible' : 'hidden';
    
        },
        get_autoAlpha: function() {
            return this._.alpha;
        },
        set_autoAlpha: function(value) {
            this.alpha(value);
            this.visible(this._.alpha > 0);
        },
        get_viewable : function () {
            return VISIBILITY._isVisible( this._.tag)
        }
    })
);