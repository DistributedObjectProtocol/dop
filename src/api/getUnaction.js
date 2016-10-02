
dop.getUnaction = function( mutations ) {

    var unaction = {},
        index = mutations.length-1,
        mutation;

    for (;index>-1; --index) {
        mutation = mutations[index];
        dop.util.set(
            unaction,
            dop.getObjectDop(mutation.object).slice(0).concat(mutation.name),
            mutation.oldValue
        );
    }

    return unaction;
};