export default function createRequest() {
    let resolve
    let reject
    const promise = new Promise((res, rej) => {
        resolve = res
        reject = rej
    })
    promise.resolve = resolve
    promise.reject = reject
    return promise
}

// function Request(executor) {
//     let resolve
//     let reject
//     const promise = new Promise((res, rej) => {
//         resolve = res
//         reject = rej
//         // return executor(res, rej)
//     })

//     promise.__proto__ = Request.prototype
//     promise.resolve = resolve
//     promise.reject = reject
//     return promise
// }

// Request.__proto__ = Promise
// Request.prototype.__proto__ = Promise.prototype
