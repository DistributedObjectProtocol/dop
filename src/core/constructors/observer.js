dop.core.observer = function Observer(callback, id) {
    this.callback = callback
    this.id = id
    this.observers = {} // need it for destroy()
    this.observers_prop = {} // need it for destroy()
    this.observers_all = {} // need it for destroy()
}

dop.core.observer.prototype.observe = function(object, property) {
    dop.util.invariant(
        dop.isRegistered(object),
        'observer.observe() needs a registered object as first parameter'
    )
    var path = dop.getObjectPath(object)
    dop.util.invariant(
        isArray(path),
        'observer.observe() The object you are passing is not allocated to a registered object'
    )

    var path_id = dop.core.getPathId(path),
        type = 'observers'

    // is observeProperty
    if (arguments.length === 2) {
        path_id += dop.core.pathSeparator(property)
        type = 'observers_prop'
    }

    return this._observe(path_id, type)
}

dop.core.observer.prototype.observeAll = function(object) {
    dop.util.invariant(
        dop.isRegistered(object),
        'observer.observeAll() needs a registered object as first parameter'
    )
    var path = dop.getObjectPath(object)
    dop.util.invariant(
        isArray(path),
        'observer.observeAll() The object you are passing is not allocated to a registered object'
    )

    return this._observe(dop.core.getPathId(path), 'observers_all')
}

// private
dop.core.observer.prototype._observe = function(path_id, type) {
    var data_path = dop.data.path

    if (data_path[path_id] === undefined) data_path[path_id] = {}

    if (data_path[path_id][type] === undefined) data_path[path_id][type] = {}

    data_path[path_id][type][this.id] = true
    this[type][path_id] = true

    return function unobserve() {
        delete data_path[path_id][type][this.id]
        delete this[type][path_id]
    }.bind(this)
}

// dop.core.observer.prototype.unobserve = function(object, property) {
//     dop.util.invariant(dop.isRegistered(object), 'observer.unobserve() needs a registered object as first parameter');
//     var path = dop.getObjectPath(object);
//     dop.util.invariant(isArray(path), 'observer.unobserve() The object you are passing is not allocated to a registered object');

//     var path_id = dop.core.getPathId(path);
//         data_path = dop.data.path,
//         type = 'observers';

//     // is observeProperty
//     if (arguments.length === 2) {
//         type = 'observers_prop';
//         path_id += dop.core.pathSeparator(property);
//     }

//     if (data_path[path_id] !== undefined && data_path[path_id][type] !== undefined) {
//         delete data_path[path_id][type][this.id];
//         delete this[type][path_id];
//     }
// };

dop.core.observer.prototype.destroy = function() {
    var path_id,
        data_path = dop.data.path

    delete dop.data.observers[this.id]

    for (path_id in this.observers) delete data_path[path_id].observers[this.id]

    for (path_id in this.observers_prop)
        delete data_path[path_id].observers_prop[this.id]
}
