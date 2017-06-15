
dop.core.observer = function(callback, id) {
    this.callback = callback;
    this.id = id;
    this.observers = {}; // need it for destroy()
    this.observers_prop = {}; // need it for destroy()
};


dop.core.observer.prototype.observe = function(object, property) {
    dop.util.invariant(dop.isRegistered(object), 'observer.observe needs a registered object as first parameter');
    
    var path_id = dop.core.getPathId(dop.getObjectPath(object, false)),
        data_path = dop.data.path,
        type = 'observers';

    // is observeProperty
    if (arguments.length === 2) {
        type = 'observers_prop';
        path_id += dop.core.pathSeparator(property);
    }

    if (data_path[path_id] === undefined)
        data_path[path_id] = {};

    if (data_path[path_id][type] === undefined)
        data_path[path_id][type] = {};

    data_path[path_id][type][this.id] = true;
    this[type][path_id] = true;
};


dop.core.observer.prototype.unobserve = function(object, property) {
    dop.util.invariant(dop.isRegistered(object), 'observer.unobserve needs a registered object as first parameter');
    
    var path_id = dop.core.getPathId(dop.getObjectPath(object, false)),
        data_path = dop.data.path,
        type = 'observers';

    // is observeProperty
    if (arguments.length === 2) {
        type = 'observers_prop';
        path_id += dop.core.pathSeparator(property);
    }

    if (data_path[path_id] !== undefined && data_path[path_id][type] !== undefined) {
        delete data_path[path_id][type][this.id];
        delete this[type][path_id];
    }
};


dop.core.observer.prototype.destroy = function() {
    var path_id,
        data_path = dop.data.path;
        
    delete dop.data.observers[this.id];

    for (path_id in this.observers)
        delete data_path[path_id].observers[this.id];

    for (path_id in this.observers_prop)
        delete data_path[path_id].observers_prop[this.id];
};

