function createStore(state) {
    function getState() {}
    function applyPatch(patch) {}
    function subscribe(listener, filter) {}
}

const store = createStore()
store.applyPatch({ arr: [123, 234] })
