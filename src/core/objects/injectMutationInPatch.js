
dop.core.injectMutationInPatch = function(patch, mutation) {

    var prop = mutation.prop,
        path = mutation.path,
        value = mutation.value,
        isMutationSplice = mutation.splice!==undefined,
        isMutationSwaps = mutation.swaps!==undefined,
        isMutationArray = isMutationSplice || isMutationSwaps,
        typeofValue = dop.util.typeof(value),
        index = 1,
        chunk = patch.chunks[patch.chunks.length-1],
        chunkParent = chunk,
        chunkNext = {},
        chunkNextParent = chunkNext,
        chunkNextRoot = chunkNext,
        tofCurrentObject,
        specialInstruction,
        instructionsPatchs = dop.protocol.instructionsPatchs,
        isNewObject = false,
        isNewChunk = false,
        propPath,
        valueMerged,
        newSpecialInstruction;



    // Going deep
    for (;index<path.length; ++index) {

        propPath = path[index];
        chunkParent = chunk;
        chunkNextParent = chunkNext;
        chunkNext = chunkNext[propPath] = {};
        tofCurrentObject = dop.util.typeof(chunk[propPath]);


        if (tofCurrentObject == 'array') {
            specialInstruction = chunk[propPath];
            // Is a new object
            if (specialInstruction[0] === instructionsPatchs.object) {
                isNewObject = true;
                chunk = specialInstruction[1];
            }
            else if (!isMutationArray || (isMutationArray && index+1<path.length)) {
                isNewChunk = true;
                chunk = chunkNext;
                patch.chunks.push(chunkNextRoot);
            }
        }

        else if (!isNewChunk && isMutationArray && tofCurrentObject == 'object') {
            // isNewChunk = true;
            chunkParent = chunkNextParent;
            chunk = chunkNext; 
            patch.chunks.push(chunkNextRoot);
        }

        else if (tofCurrentObject == 'object')
            chunk = chunk[propPath];

        else
            chunk = chunk[propPath] = {};
    }


    /// INJECTING ///

    // Objects or array
    if (typeofValue == 'object' || typeofValue == 'array') {
        valueMerged = dop.util.merge(typeofValue == 'array' ? [] : {}, value);
        if (isNewObject)
            chunk[prop] = valueMerged;
        else {
            chunk[prop] = [
                instructionsPatchs.object,
                valueMerged
            ];
        }
    }


    // Mutations over arrays
    else if (isMutationArray) {
        if (isNewObject)
            (isMutationSplice) ?
                Array.prototype.splice.apply(chunk, mutation.splice.slice(0))
            :
                dop.util.swap(chunk, mutation.swaps.slice(0));

        else {
            newSpecialInstruction = (isMutationSplice) ?
                [instructionsPatchs.splice, mutation.splice.slice(0)]
            :
                [instructionsPatchs.swaps, mutation.swaps.slice(0)]

            if (!isArray(chunkParent[prop]))
                chunkParent[prop] = newSpecialInstruction;

            else {
                if (isNumber(chunkParent[prop][0]))
                    chunkParent[prop] = [chunkParent[prop]]

                chunkParent[prop].push(newSpecialInstruction)
            }
        }
    }


    // Others values
    else
        chunk[prop] = value;
};


// isCurrentNewObject
// isCurrentArrayMutation
// isValueNewObject
// isValueArrayMutation
// isTheLastOne
// isNewObject