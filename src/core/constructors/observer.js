dop.core.observer = function Observer(callback, id) {
    this.callback = callback
    this.id = id
    this.observers = {} // need it for destroy()
    this.observers_prop = {} // need it for destroy()
    this.observers_all = {} // need it for destroy()
}

dop.core.observer.prototype.observeProperty = function(object, property) {
    var path = observerCheckObject(object, 'observeProperty')
    dop.util.invariant(
        arguments.length === 2,
        'observer.observeProperty() You must pass a name property as second parameter'
    )
    return this.observe(
        dop.core.getPathId(path) + dop.core.pathSeparator(property),
        'observers_prop'
    )
}

dop.core.observer.prototype.observeObject = function(object) {
    var path = observerCheckObject(object, 'observeObject')
    return this.observe(dop.core.getPathId(path), 'observers')
}

dop.core.observer.prototype.observeAll = function(object) {
    var path = observerCheckObject(object, 'observeAll')
    return this.observe(dop.core.getPathId(path), 'observers_all')
}

dop.core.observer.prototype.observe = function(path_id, type) {
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

dop.core.observer.prototype.destroy = function() {
    var path_id
    var data_path = dop.data.path
    var path_ids = {}

    // Removing observeProperty
    for (path_id in this.observers_prop) {
        path_ids[path_id] = true
        delete data_path[path_id].observers_prop[this.id]
        if (isEmptyObject(data_path[path_id].observers_prop))
            delete data_path[path_id].observers_prop
    }

    // Removing observeObject
    for (path_id in this.observers) {
        path_ids[path_id] = true
        delete data_path[path_id].observers[this.id]
        if (isEmptyObject(data_path[path_id].observers))
            delete data_path[path_id].observers
    }

    // Removing observeAll
    for (path_id in this.observers_all) {
        path_ids[path_id] = true
        delete data_path[path_id].observers_all[this.id]
        if (isEmptyObject(data_path[path_id].observers_all))
            delete data_path[path_id].observers_all
    }

    // Removing path_ids
    for (path_id in path_ids) {
        if (isEmptyObject(data_path[path_id])) {
            delete data_path[path_id]
        }
    }

    delete dop.data.observers[this.id]
}

function observerCheckObject(object, method) {
    dop.util.invariant(
        dop.isRegistered(object),
        'observer.' + method + '() needs a registered object as first parameter'
    )
    var path = dop.getObjectPath(object)
    dop.util.invariant(
        isArray(path),
        'observer.' +
            method +
            '() The object you are passing is not allocated to a registered object'
    )
    return path
}
