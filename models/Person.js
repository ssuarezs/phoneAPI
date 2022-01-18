const { Schema, model } = require('mongoose')

const personSchema = new Schema({
  name: String,
  number: Number,
})

personSchema.set('toJSON', {
	transform: (document, returnedObject) => {
		returnedObject.id = returnedObject._id
		delete returnedObject._id
		delete returnedObject.__v
	}
})

const Person = new model('Person', personSchema)

module.exports = Person
