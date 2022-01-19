require('dotenv').config()
require('./mongo')

const express = require('express')
const cors = require('cors')
const Person = require('./models/Person')

const notFound = require('./middleware/notFound')
const handleError = require('./middleware/handleError')

const app = express()

app.use(cors())
app.use(express.json())
app.use(express.static('public'))


app.get('/', (req, res) => {
	res.send('<h1>Welcome to Phone API</h1>')
})

app.get('/info', (req, res) => {
	const today = new Date()
	Person.find({}).then(pers => {
		res.send(`
      <h3>Phonebook has info of ${pers.length} people</h3>
      <h3>${today}</h3>
    `)
	})
})

app.get('/api/persons', (req, res) => {
	Person.find({}).then(pers => {
		res.json(pers)
	})
})

app.get('/api/persons/:id', (req, res, next) => {
	const { id } = req.params

	Person.findById(id)
		.then(person => {
			if(person) return res.json(person)
			res.status(404).end()
		})
		.catch(err => next(err))
})

app.delete('/api/persons/:id', (req, res, next) => {
	const { id } = req.params

	Person.findByIdAndDelete(id)
		.then(() => res.status(204).end())
		.catch(err => next(err))
})

app.post('/api/persons', (req, res, next) => {
	const person = req.body

	if(!person || !person.name || !person.number){
		return res.status(400).json({
			error: 'name or number is missing'
		})
	}

	const newPerson = new Person({
		name: person.name,
		number: Number(person.number)
	})

	newPerson.save()
		.then(savedPerson => savedPerson.toJSON())
		.then(savedAndFormattedPerson => res.json(savedAndFormattedPerson))
		.catch(err => next(err))
})

app.put('/api/persons/:id', (req, res, next) => {
	const { id } = req.params
	const person = req.body

	const newPersonInfo = {
		name: person.name,
		number: Number(person.number)
	}

	Person.findByIdAndUpdate(id, newPersonInfo, {new: true})
		.then(result => res.json(result))
		.catch(err => next(err))
})

app.use(notFound)
app.use(handleError)

const PORT = process.env.PORT
app.listen(PORT)
console.log(`Server running on port ${PORT}`)
