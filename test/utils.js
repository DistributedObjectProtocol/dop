function newDate(d) {
    const date = new Date(d)
    date.toISOString = () => date
    return date
}

function isInteger(number) {
    return (
        typeof number === 'number' &&
        isFinite(number) &&
        Math.floor(number) === number
    )
}
module.exports = { newDate, isInteger }
