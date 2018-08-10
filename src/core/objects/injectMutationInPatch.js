dop.core.injectMutationInPatch = function(patch, mutation) {
    var prop = mutation.prop,
        path = mutation.path,
        value = mutation.value,
        is_mutation_delete = !mutation.hasOwnProperty('value'),
        is_mutation_splice = mutation.splice !== undefined,
        is_mutation_swaps = mutation.swaps !== undefined,
        is_mutation_array = is_mutation_splice || is_mutation_swaps,
        tof_value = dop.util.typeof(value),
        index = 1,
        chunk = patch.chunks[patch.chunks.length - 1],
        chunk_parent = chunk,
        chunk_next = {},
        chunk_next_parent = chunk_next,
        chunk_next_root = chunk_next,
        tof_current_object,
        special_instruction,
        instructions_patchs = dop.protocol.instructionsPatchs,
        is_new_object = false,
        is_new_chunk = false,
        prop_path,
        value_merged,
        newspecial_instruction

    // Going deep
    for (; index < path.length; ++index) {
        prop_path = path[index]
        chunk_parent = chunk
        chunk_next_parent = chunk_next
        chunk_next = chunk_next[prop_path] = {}
        tof_current_object = dop.util.typeof(chunk[prop_path])

        if (tof_current_object == 'array') {
            special_instruction = chunk[prop_path]
            // Is a new object
            if (special_instruction[0] === instructions_patchs.object) {
                is_new_object = true
                chunk = special_instruction[1]
            } else if (
                !is_mutation_array ||
                (is_mutation_array && index + 1 < path.length)
            ) {
                is_new_chunk = true
                chunk = chunk_next
                patch.chunks.push(chunk_next_root)
            }
        } else if (
            !is_new_chunk &&
            is_mutation_array &&
            tof_current_object == 'object'
        ) {
            // is_new_chunk = true;
            chunk_parent = chunk_next_parent
            chunk = chunk_next
            patch.chunks.push(chunk_next_root)
        } else if (tof_current_object == 'object') chunk = chunk[prop_path]
        else chunk = chunk[prop_path] = {}
    }

    /// INJECTING ///

    // Objects or array
    if (tof_value == 'object' || tof_value == 'array') {
        value_merged = dop.util.merge(tof_value == 'array' ? [] : {}, value)
        if (is_new_object) chunk[prop] = value_merged
        else {
            chunk[prop] = [instructions_patchs.object, value_merged]
        }
    }

    // Mutations over arrays
    else if (is_mutation_array) {
        if (is_new_object)
            is_mutation_splice
                ? Array.prototype.splice.apply(chunk, mutation.splice.slice(0))
                : dop.util.swap(chunk, mutation.swaps.slice(0))
        else {
            newspecial_instruction = is_mutation_splice
                ? [instructions_patchs.splice, mutation.splice.slice(0)]
                : [instructions_patchs.swaps, mutation.swaps.slice(0)]

            if (!isArray(chunk_parent[prop]))
                chunk_parent[prop] = newspecial_instruction
            else {
                if (isNumber(chunk_parent[prop][0]))
                    chunk_parent[prop] = [chunk_parent[prop]]

                chunk_parent[prop].push(newspecial_instruction)
            }
        }
    }

    // Delete
    else if (is_mutation_delete) {
        chunk[prop] = [instructions_patchs.delete]
    }

    // Others values
    else {
        chunk[prop] = value
    }
}
