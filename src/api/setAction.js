
dop.setAction = function(action) {
    var collector = dop.collectFirst();
    dop.util.path(action, null, dop.data.object, dop.core.setAction);
    return collector;
};