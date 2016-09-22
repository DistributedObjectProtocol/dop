
dop.collect = function() {
    var args=arguments, total=args.length;
    if (total === 0)
        dop.data.collecting = true;
    else
        for ( var index=0; index<total; ++index )
            if (dop.isRegistered(args[index]))
                dop.data.object[dop.getObjectId(args[index])].collecting = true;
};