function listen(event_owner, event_name, callback) {
  var event_object_field_name = "on" + event_name;
  event_owner[event_object_field_name].addListener(callback);
}

var communicator = {
  _alreadyConnectedToContentScript: false,
  _connect_observers: [],
  _message_observers: [],  
  connectToContentScript: function() {
    if (this._alreadyConnectedToContentScript) return;

    var connect_observers = this._connect_observers;
    chrome.runtime.onConnect.addListener(function (port){
      console.assert(port.name == 'delugesiphon');
      port.onMessage.addListener(function(msg) {
        for (var order_num in connect_observers) 
          connect_observers[order_num](port,msg);
      });
    });
    
    var message_observers = this._message_observers;								
    chrome.runtime.onMessage.addListener(function (method, sender, sendResponse){
      for (var order_num in message_observers)
        message_observers[order_num](method, sender, sendResponse);
    });
    
    this._alreadyConnectedToContentScript = true;
  },
  observeConnect: function(callback){
    this._connect_observers.push(callback);
  },
  observeMessage: function(callback){
    this._message_observers.push(callback);
  }
};
