
dop.util.isObjectStandard = function(object) {
    var tof = dop.util.typeof(object);
    return (tof == 'object' || tof == 'array');
};