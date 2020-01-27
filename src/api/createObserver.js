dop.createObserver = function(callback) {
    dop.util.invariant(
        isFunction(callback),
        'dop.createObserver only accept one argument as function'
    )
    var observers = dop.data.observers,
        index,
        observer_id,
        observer
    for (index in observers)
        if (observers[index].callback === callback) return observers[index]

    observer_id = dop.data.observers_inc++
    observer = new dop.core.observer(callback, observer_id)
    return (observers[observer_id] = observer)
}
