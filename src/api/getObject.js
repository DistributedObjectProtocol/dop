dop.getObjectDop = function(object) {
    return object[dop.cons.DOP]
}

dop.getObjectRoot = function(object) {
    return dop.getObjectDop(object).r
}

dop.getObjectParent = function(object) {
    return dop.getObjectDop(object)._
}

dop.getObjectProxy = function(object) {
    return dop.getObjectDop(object).p
}

dop.getObjectTarget = function(object) {
    return dop.getObjectDop(object).t
}

dop.getObjectProperty = function(object) {
    var object_dop = dop.getObjectDop(object)
    if (isArray(object_dop._)) dop.getObjectPath(object)
    return object_dop.pr
}

dop.getObjectId = function(object) {
    return dop.getObjectProperty(dop.getObjectRoot(object))
}

dop.getObjectLevel = function(object) {
    return dop.getObjectDop(object).l
}
