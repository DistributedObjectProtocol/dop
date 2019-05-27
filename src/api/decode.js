dop.decode = function(data) {
    var undefineds = [],
        index = 0,
        total,
        output = JSON.parse(data, function(property, value) {
            return dop.core.decode.call(this, property, value, undefineds)
        })

    for (total = undefineds.length, index = 0; index < total; ++index)
        undefineds[index][0][undefineds[index][1]] = undefined

    return output
}
