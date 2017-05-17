
dop.core.getUnpatch = function(mutations) {
    return dop.core.getPatch(mutations.slice(0).reverse(), true);
};