
dop.collect = function() {
    var args=arguments, total=args.length;
    for ( var index=0; index<total; ++index )
        if (dop.isRegistered(args[index]))
            dop.data.object[dop.getObjectId(args[index])].collecting = true;
};