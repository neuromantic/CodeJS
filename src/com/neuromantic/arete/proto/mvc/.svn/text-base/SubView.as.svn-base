package net.kolektiv.proto.mvc {
	import com.greensock.OverwriteManager;
	import com.greensock.TweenLite;
	import flash.display.DisplayObject;
	import flash.events.Event;
	import flash.geom.Matrix;
	import flash.geom.Point;
	import flash.geom.Rectangle;
	import flash.utils.Dictionary;
	import net.kolektiv.proto.ExecSprite;
	import net.kolektiv.utils.Re;
	
	public class SubView extends ExecSprite {
		protected var controller:Controller;
		protected var model:Model;
		protected var subViews:Vector.<SubView> = new Vector.<SubView>();
		public function SubView( model:Model = null, controller:Controller = null ) {
			super();
			this.controller = controller;
			this.model = model;
			addEventListener( ExecSprite.LAYOUT_COMPLETE, layoutCompleteHandler );
		}
		public function addSubView( subView:SubView ):void {
			subViews.push( subView );
			addChild( subView );
			if ( !subView.ready ) {
				subView.exec();
			}
		}
		public function change():void {
			for each ( var subView:SubView in subViews ) {
				subView.change();
			}
			updateStoredLayout()
			layout();
		}
		public function removeSubView( subView:SubView ):void {
			subViews.splice( subViews.indexOf( subView ), 1 );
			removeChild( subView );
		}
		protected function layoutCompleteHandler( event:Event ):void {
			dispatchEvent( new MVCEvent( MVCEvent.CHANGE ) );
		}
	}
}