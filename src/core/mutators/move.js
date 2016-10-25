
// dop.core.
move = function() {
    var items = Array.prototype.slice.call(arguments, 0),
        array = this,
        objectTarget = array, //dop.getObjectTarget(array),
        objectProxy = array, //dop.getObjectProxy(array),
        moves = [],
        shallWeStore = (objectTarget===objectProxy || array===objectProxy),
        index=0, length=items.length, one, two, tempItem;

    for (;index<length; index+=2) {
        one = Number(items[index]);
        two = Number(items[index+1]);
        if (!isNaN(two) && one!==two) {
            // if (objectTarget===objectProxy || array===objectProxy) {}
            tempItem = objectTarget[two];
            objectTarget[two] = objectTarget[one];
            objectTarget[one] = tempItem;
            moves.push(one,two);
        }
    }

    // if (shallWeStore && moves.length>0)
    //     dop.core.storeMutation({
    //         object:objectProxy,
    //         moves:moves
    //     });

    return moves;
};


// var arr = ['Hola', 'Mundo', 'Cruel', 'Te', 'Odio', 'Mucho'];
// move.call(arr, 2,1,3,'5','1','0');
// console.log( arr );

// move.call(arr, '0','1','5',3,1,2);
// console.log( arr );
