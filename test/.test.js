function isObject(object) {
    return object !== null && typeof object == 'object'
}

function isPojoObject(object) {
    if (!isObject(object)) return false
    const prototype = Object.getPrototypeOf(object)
    return prototype === Object.prototype || prototype === Array.prototype
}

function Test() {}
console.log(isPojoObject({}))
console.log(isPojoObject([]))
console.log(isPojoObject(new Test()))
console.log(isPojoObject(new Error()))
console.log(isPojoObject(new Date()))
console.log(isPojoObject(null))
console.log(isPojoObject(Symbol('')))
console.log(isPojoObject(function() {}))
console.log(isPojoObject(1))
console.log(isPojoObject('s'))
console.log(isPojoObject(true))
console.log(isPojoObject(/a/))
