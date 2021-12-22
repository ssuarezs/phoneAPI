
const express = require('express')
const cors = require('cors')
const morgan = require('morgan')

const app = express()

morgan.token('bodyp', function (req, res) { return req.body })


app.use(morgan(':method :url :status :res[content-length] - :response-time ms - :bodyp'))
app.use(cors())
app.use(express.json())

let persons = [
  {
    "name": "Arto Hellas",
    "number": "4712094",
    "id": 1
  },
  {
    "name": "Dan Abramov",
    "number": "12-43-234345",
    "id": 3
  },
  {
    "name": "Mary Poppendieck",
    "number": "39-23-6423122",
    "id": 4
  }
]


app.get('/', (req, res) => {
  res.send('<h1>Hellow to Phone API</h1>')
})

app.get('/info', (req, res) => {
  const today = new Date()
  res.send(`
    <h3>Phonebook has info of ${persons.length} people</h3>
    <h3>${today}</h3>
  `)
})

app.get('/api/persons', (req, res) => {
  res.json(persons)
})

app.get('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id)
  const person = persons.find(person => person.id === id)
	if(person){
		res.json(person)
	} else {
		res.status(404).end()
	}
})

app.delete('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id)
  persons = persons.filter(person => person.id !== id)
  res.status(204).end()
})

app.post('/api/persons', (req, res) => {
  const person = req.body

	if(!person || !person.name || !person.number){
		return res.status(400).json({
			error: 'name or number is missing'
		})
	}
  if(persons.some(p => p.name === person.name)){
		return res.status(400).json({
			error: 'name must be unique'
		})
	}


	const ids = persons.map(person => person.id)
	const maxId = Math.max(...ids)

	const newperson = {
		name: person.name,
		number: typeof person.number !== 'undefined' ? person.number : 'none',
		id: maxId + 1,
	}

	persons = persons.concat(newperson)
	
	res.status(201).json(newperson)

})

const PORT = 3001
app.listen(PORT)
console.log(`Server running on port ${PORT}`)
