// https://stackoverflow.com/questions/5905492/dynamic-function-name-in-javascript
export default function createFunction(name, body) {
    return {
        [name](...args) {
            return body(...args)
        }
    }[name]
}
