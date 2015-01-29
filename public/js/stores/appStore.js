var AppDispatcher = require('../dispatcher/appDispatcher');
var AppConstants = require('../constants/appConstants');
var assign = require('object-assign');
var EventEmitter = require('events').EventEmitter;


// Non-Flux-related items
var CHANGE_EVENT = 'change';

var _dropboxFileList = {};
var _googleFileList = {};

// just a stock username
var _username = 'John';

// DOUBLECHECK: I think this goes here
var _logout = function() {
  // clear out the store I guess
  _dropboxFileList = {}
  _googleFileList = {};
  // AppStore.state.dropboxFileList = {};   // setState?  shouldn't really do this outside the object...
  // AppStore.state.googleFileList = {};
}

var AppStore = assign({}, EventEmitter.prototype, {
  // adding methods to the EventEmitter

  /**
   * Get the entire collection of files.
   * @return {object}
   */
  getAll: function() {
    return {
      // FIXME: The use of an object for this return statement is causing an error... 
      // _username,
      dropboxFileList: _dropboxFileList,
      googleFileList: _googleFileList
    };
  },

  getUsername: function() {
    return { username: _username };
  },

  updateFileLists: function(data) {
    _dropboxFileList = data.dropboxFileList;
    _googleFileList = data.googleFileList;
    emitChange();
  },

  emitChange: function() {
    this.emit(CHANGE_EVENT);
      // CHANGE_EVENT is just a string ('change')
  },

  addChangeListener: function(callback) {
    this.on(CHANGE_EVENT, callback);
  },
    // This method allows components to register events with the Store -- and causes Store to execute this callback in response.

  removeChangeListener: function(callback) {
    this.removeListener(CHANGE_EVENT, callback);
  },

  // register callback with dispatcher
    // give it a key in case one store has to wait for another store
  dispatcherIndex:AppDispatcher.register(function(payload){
    var action = payload.action; // this is our action from handleViewAction
    switch(action.actionType){
      // determine which method matches from AppConstants
      
      case AppConstants.UPDATE_FILE_LISTS:
        _updateFileLists();
        break;

      case AppConstants.LOGOUT:
        _logout();
        break;


      case AppConstants.ADD_ITEM:
      // invoke correlating method stored above
        _addItem(payload.action.item);
        break;

      case AppConstants.INCREASE_ITEM:
        _increaseItem(payload.action.index);
        break;

    }
    AppStore.emitChange();

    return true;
  })

});


module.exports = AppStore;



