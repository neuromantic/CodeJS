/*!
 *
 * Window.js
 * com.neuromantic.arete.dom.Window
 *
 */
 _package( 'com.neuromantic.arete.dom',
    _class( 'Window', {
        static_onLoad : function ( handler ) {
            if ( window.addEventListener) {
                window.addEventListener("load", handler, false);
            }
            else if (window.attachEvent) {
                window.attachEvent("onload", handler);
            }
        }
    })
);