
dop.core.observer = function(callback, id) {
    this.callback = callback;
    this.id = id;
    this.objects = [];
    this.properties = {};
};


dop.core.observer.prototype.observe = function(object) {
    dop.util.invariant(dop.isRegistered(object), 'observer.observe needs a registered object as first parameter');
    var object_dop = dop.getObjectDop(object);
    if (object_dop.om[this.id] === undefined) {
        // Storing in object
        object_dop.om[this.id] = true;
        // Storing in observer
        this.objects.push(object); // using for .destroy()
    }
};
dop.core.observer.prototype.unobserve = function(object) {
    dop.util.invariant(dop.isRegistered(object), 'observer.unobserve needs a registered object as first parameter');
    // Removing from object
    delete dop.getObjectDop(object).om[this.id];
    // Removing from observer
    var index = this.objects.indexOf(object);  // using for .destroy()
    if (index > -1)
        this.objects.splice(index,1); // using for .destroy()
};



dop.core.observer.prototype.observeProperty = function(object, property) {
    dop.util.invariant(dop.isRegistered(object), 'observer.observeProperty needs a registered object as first parameter');
    // Storing in object
    var object_dop = dop.getObjectDop(object);
    if (object_dop.omp[property] === undefined)
        object_dop.omp[property] = {};
    if (object_dop.omp[property][this.id] === undefined) {
        object_dop.omp[property][this.id] = true;
        // Storing in observer
        if (this.properties[property] === undefined)
            this.properties[property] = [];
        this.properties[property].push(object); // using for .destroy()
    }
};
dop.core.observer.prototype.unobserveProperty = function(object, property) {
    dop.util.invariant(dop.isRegistered(object), 'observer.unobserveProperty needs a registered object as first parameter');
    var object_dop = dop.getObjectDop(object),
        properties = this.properties[property],
        index;
    // Removing from object
    if (object_dop.omp[property] !== undefined)
        delete object_dop.omp[property][this.id];
    // Removing from observer
    if (properties !== undefined) {
        index = properties.indexOf(object);  // using for .destroy()
        if (index > -1)
            properties.splice(index,1); // using for .destroy()
    }
};


dop.core.observer.prototype.destroy = function() {
    var index=0,
        objectsandproperties = this.objects,
        total=objectsandproperties.length,
        property;
    
    // Deleting objects
    for (;index<total; ++index)
        delete dop.getObjectDop(objectsandproperties[index]).om[this.id];

    // Deleting properties
    objectsandproperties = this.properties;
    for (property in objectsandproperties)
        for (index=0,total=objectsandproperties[property].length; index<total; ++index)
            delete dop.getObjectDop(objectsandproperties[property][index]).omp[property][this.id];

    // Deleting from dop.data
    delete dop.data.observers[this.id];
};

