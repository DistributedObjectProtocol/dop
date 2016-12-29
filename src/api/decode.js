
dop.decode = function(data, node) {
    var functions = [],
        undefineds = [],
        index = 0,
        total,
        output = JSON.parse(data, function(property, value) {
            return dop.core.decode.call(this, property, value, functions, undefineds);
        });


    for (total=functions.length; index<total; ++index)
        functions[index][0][functions[index][1]] = dop.core.createRemoteFunction(node);

    for (total=undefineds.length,index=0; index<total; ++index)
        undefineds[index][0][undefineds[index][1]] = undefined;

    return output;
};