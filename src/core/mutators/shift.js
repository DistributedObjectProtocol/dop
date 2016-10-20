
dop.core.shift = function() {
    if (this.length > 0) {
        var objectTarget = dop.getObjectTarget(this),
            output = Array.prototype.shift.apply(objectTarget);
        if (objectTarget !== this)
            dop.core.splice(this, 0, 1, output);
        return output;
    }
};



dop.core.splice = function(array, index, remove) {
    var objectTarget = dop.getObjectTarget(this),
        output = Array.prototype.shift.apply(objectTarget);
    if (objectTarget !== this)
        dop.core.storeMutation({
            object:this,
            splice:[0,1],
            oldValue:[output]
        });
    return output;
};


