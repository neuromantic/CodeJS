package net.kolektiv.proto.mvc
{

	import flash.events.Event;

	/**
	  TODO: Complete ASDoc class comment UpdateEvent
	  @author
	 */
	public class MVCEvent extends Event 
	{
		public static var CHANGE:String = "change";
		public static var UPDATE:String = "update";
		public static var READY:String = "ready";
		
		/**
		  TODO: Complete ASDoc function comment UpdateEvent
		  @param type
		  @param bubbles
		  @param cancelable
		 */
		public function MVCEvent(type:String)
		{
			super(type);
		}
	    /** 
	     * Creates and returns a copy of the current instance. 
	     * @return A copy of the current instance. 
	     */ 
	    override public function clone():Event 
	    {
	        return new MVCEvent(type); 
	    } 
	     
	    /** 
	     * Returns a String containing all the properties of the current 
	     * instance. 
	     * @return A string representation of the current instance. 
	     */ 
	  	override public function toString():String 
	    { 
	        return formatToString("MVCEvent", "type", "bubbles", "cancelable", "eventPhase", "state"); 
	    }
	}

}