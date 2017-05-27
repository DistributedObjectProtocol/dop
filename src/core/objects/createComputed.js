
dop.core.createComputed = function (object, property, f, shallWeSet, oldValue) {

    var computed_id = dop.data.computed_inc++,
        data_path = dop.data.path,
        derived_paths,
        derived_pathsids = [],
        derived_path,
        derived_pathid,
        computed_path,
        computed_pathid,
        value,
        index = 0,
        total,
        index2,
        total2;


    // Running function and saving paths from getters
    dop.data.gets_collecting = true;
    value = f.call(object, oldValue);
    dop.data.gets_collecting = false;
    derived_paths = dop.data.gets_paths;
    dop.data.gets_paths = [];


    // Generating and storing paths ids
    for (total=derived_paths.length; index<total; ++index) {
        derived_path = derived_paths[index];
        derived_pathid = '';
        for (index2=0,total2=derived_path.length; index2<total2; ++index2) {
            derived_pathid += dop.core.pathSeparator(derived_path[index2]);
            if (index2>0) {
                if (data_path[derived_pathid] === undefined)
                    data_path[derived_pathid] = {};
                
                if (data_path[derived_pathid].derivations === undefined)
                    data_path[derived_pathid].derivations = [];
                
                if (data_path[derived_pathid].derivations.indexOf(computed_id) < 0) {
                    data_path[derived_pathid].derivations.push(computed_id);
                    derived_pathsids.push(derived_pathid);
                }
            }
        }
    }

    computed_path = dop.getObjectPath(object, false);
    computed_pathid = dop.core.getPathId(computed_path.concat(property));

    // Storing computed in dop.data 
    if (data_path[computed_pathid] === undefined)
        data_path[computed_pathid] = {};
    
    if (data_path[computed_pathid].computeds === undefined)
        data_path[computed_pathid].computeds = [];

    data_path[computed_pathid].computeds.push(computed_id);

    dop.data.computed[computed_id] = {
        object_root: dop.getObjectRoot(object),
        path: computed_path.slice(1),
        prop: property,
        function: f,
        derivations: derived_pathsids
    };

    // Setting value
    if (shallWeSet)
        dop.core.set(object, property, value);

    return value;
};