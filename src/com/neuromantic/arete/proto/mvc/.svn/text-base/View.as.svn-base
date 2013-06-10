package net.kolektiv.proto.mvc {
	import flash.events.Event;
	
	public class View extends SubView {
		public function View( model:Model = null, controller:Controller = null ) {
			super( model, controller );
			linkModel();
		}
		protected function linkModel():void {
			model.addEventListener( MVCEvent.UPDATE, model_updateHandler );
			if ( model.ready ) {
				exec();
			} else {
				model.addEventListener( MVCEvent.READY, model_readyHandler );
			}
		}
		private function model_readyHandler( event:MVCEvent ):void {
			model.removeEventListener( MVCEvent.READY, model_readyHandler );
			exec();
		}
		private function model_updateHandler( event:MVCEvent ):void {
			change();
		}
	}
}