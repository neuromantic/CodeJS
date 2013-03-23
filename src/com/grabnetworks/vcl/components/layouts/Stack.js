/*!
 *
 * Stack.js
 * com.grabnetworks.vcl.components.layouts.Stack
 *
 */
 _package( 'com.grabnetworks.vcl.components.layouts',
    _class( 'Stack', {
        private_widgets: [],
        private_padding: 0,
        private_width: 0,
        Stack: function( widgets, width ){
            this._.widgets = widgets;
            this._.width = width;
        },
        layout: function( startY ){
            var widget,  y = startY || 0;
            for (var i in this._.widgets ){
                widget = this._.widgets[ i ];
                widget.width( this._.width);
                widget.y( y );
                y += widget.height();
            }
        }//,
    })
);