

syncio.create.prototype.observe = function(changes) {

    for (var i=0; i<changes.length; i++) {
        
        var path = changes[i].object[syncio.key_object_path].slice(0);
        path.push( changes[i].name )

        if (
            (changes[i].type == 'update' || changes[i].type == 'add') &&
            changes[i].object[changes[i].name] !== null &&
            typeof changes[i].object[changes[i].name] == 'object'
        ) {
            syncio.observe(changes[i].object[changes[i].name], this.observe, path );
        }

        // console.log( changes[i].type, path, changes[i].oldValue );
        // console.log()

    }

};
