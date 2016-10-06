
dop.getAction = function(mutations) {

    var action = {},
        index = 0,
        total = mutations.length,
        mutation,
        path;

    for (;index<total; ++index) {
        mutation = mutations[index];
        path = (mutation.path===undefined) ?
            dop.getObjectDop(mutation.object).slice(0).concat(mutation.name)
        :
            mutation.path;

        dop.util.set(action, path, mutation.value);
    }

    return action;
};