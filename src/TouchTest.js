_package('',
    _import('com.grabnetworks.proto.GrabApp'),
    _import('com.grabnetworks.ui.CloseButton'),
    _import('com.neuromantic.arete.events.MouseEvent'),
    _class('TouchTest')._extends( 'GrabApp', {
        img: null,
        TouchTest : function ( settings ){
            this._super( settings );
            this.style({ background: 'red'});
        },
        private_build : function (){
            this.img = new CloseButton();
            this.append(this.img);
        },
        private_addEvents : function () {
            this.img.on( MouseEvent.CLICK, this._.onImgClick );
            this.img.on( LoadingEvent.COMPLETE, this._.onImgLoaded );
        },
        private_layout : function () {
            // this.img.width( this.width() * 0.5);
            // this.img.height( this.height() * 0.5);
            this.img.x( ( this.width() - this.img.width() ) * 0.5 );
            this.img.y( ( this.height() - this.img.height() ) * 0.5 );
        },
        private_onImgLoaded : function () {
            this._.layout();
        },
        private_onImgClick : function ( event ){
            alert( 'Touch!!');
        }
    })
);