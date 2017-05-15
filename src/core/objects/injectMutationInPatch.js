
dop.core.injectMutationInPatch = function(patchs, mutation) {

    var prop = mutation.prop,
        path = mutation.path,
        value = mutation.value,
        isMutationSplice = mutation.splice!==undefined,
        isMutationSwaps = mutation.swaps!==undefined,
        typeofValue = dop.util.typeof(value),
        index = 1,
        chunk = chunkParent = patchs.chunks[patchs.chunks.length-1],
        chunkNext = chunkNextParent = chunkNextRoot = {},
        tofCurrentObject,
        specialInstruction,
        instructionsPatchs = dop.protocol.instructionsPatchs,
        isNewObject = false,
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
            if (specialInstruction[0] === instructionsPatchs.object.value) {
                isNewObject = true;
                chunk = specialInstruction[1];
            }
            else if (!isMutationSplice && !isMutationSwaps) {
                chunk = chunkNext;
                patchs.chunks.push(chunkNextRoot);
            }
        }

        else if ((isMutationSplice || isMutationSwaps) && tofCurrentObject == 'object') {
            chunkParent = chunkNextParent;
            chunk = chunkNext; 
            patchs.chunks.push(chunkNextRoot);
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
                instructionsPatchs.object.value,
                valueMerged
            ];
        }
    }


    else if (isMutationSplice || isMutationSwaps) {
        if (isNewObject)
            (isMutationSplice) ?
                Array.prototype.splice.apply(chunk, mutation.splice.slice(0))
            :
                dop.util.swap(chunk, mutation.swaps.slice(0));

        else {
            newSpecialInstruction = (isMutationSplice) ?
                [instructionsPatchs.splice.value,mutation.splice.slice(0)]
            :
                [instructionsPatchs.swaps.value,mutation.swaps.slice(0)]

            if (!isArray(chunkParent[prop]))
                chunkParent[prop] = newSpecialInstruction;

            else {
                if (isNumber(chunkParent[prop][0]))
                    chunkParent[prop] = [chunkParent[prop]]

                chunkParent[prop].push(newSpecialInstruction)
            }
        }
    }


    // Others
    else
        chunk[prop] = value;
};


// isCurrentNewObject
// isCurrentArrayMutation
// isValueNewObject
// isValueArrayMutation
// isTheLastOne
// isNewObject