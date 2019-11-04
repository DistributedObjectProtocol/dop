var matches = require('tmatch')

const patch = { user: { $date: 123456789 } }
const expected = { user: new Date() }

console.log(matches(patch, expected))
