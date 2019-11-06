const { EJSON } = require('bson')
const text = '{ "int32": { "$numberInt": "10" } }'

// prints { int32: { [String: '10'] _bsontype: 'Int32', value: '10' } }
console.log(EJSON.parse(text, { relaxed: false }))

// prints { int32: 10 }
console.log(EJSON.parse(text))
