dop.util.getUniqueToken = function(token1, token2) {
    var t1l = token1.length
    var t2l = token2.length
    if (t1l < t2l) {
        token2 = token2.substr(0, t1l)
    } else if (t2l < t1l) {
        token1 = token1.substr(0, t2l)
    }
    return token1 < token2 ? token1 + token2 : token2 + token1
}
