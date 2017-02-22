
dop.core.invertMutations = function(mutations) {
    mutations.reverse();
    for (var index=0,total=mutations.length,mutation,object; index<total; ++index) {
        mutation = mutations[index];
        object = dop.getObjectTarget(mutation.object);

        if (mutation.swaps !== undefined)
            dop.core.invertSwapMutation(object, mutation);

        else if (mutation.splice !== undefined)
            dop.core.invertSpliceMutation(object, mutation);

        else
            dop.core.invertMutation(object, mutation);
    }
};