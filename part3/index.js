require('dotenv').config()

const express = require('express')
var app = express()

app.use(express.json())
var morgan = require('morgan')

const Person = require('./models/person')

app.use(express.static('dist'))

app.use(
  morgan((tokens, req, res) => {
    return [
      tokens.method(req, res),
      tokens.url(req, res),
      tokens.status(req, res),
      tokens.res(req, res, 'content-length'),
      '-',
      tokens['response-time'](req, res),
      'ms',
      JSON.stringify(req.body),
    ].join(' ')
  })
)

app.get('/info', (request, response) => {
  response.send(`
        <p>Phonebook has info for ${Person.length} people.</p>
        <p>${new Date()}</p>`)
})

app.get('/api/persons', (request, response) => {
  Person.find({}).then((persons) => {
    response.send(persons)
  })
})

app.get('/api/persons/:id', (request, response, next) => {
  Person.findById(request.params.id)
    .then((person) => {
      console.log(person)
      if (person) {
        response.send(person)
      } else {
        response.status(404).json({
          error: 'Contact missing',
        })
        response.end()
      }
    })
    .catch((error) => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
  const id = request.params.id
  Person.findByIdAndDelete(id)
    .then(() => {
      console.log('Deleted' + id)
      response.status(204).end()
    })
    .catch((error) => next(error))
})

app.post('/api/persons', (request, response, next) => {
  const body = request.body

  if (!body.name || !body.number) {
    return response.status(400).json({
      error: 'Name and number are required',
    })
  }

  const person = new Person({
    name: body.name,
    number: body.number,
  })

  person
    .save()
    .then((result) => {
      console.log(`added ${result.name} number ${result.number} to phonebook`)
      response.send(result)
    })
    .catch((error) => next(error))
})

app.put('/api/persons/:id', (request, response, next) => {
  const body = request.body
  const note = {
    name: body.name,
    number: body.number,
  }
  Person.findByIdAndUpdate(request.params.id, note, {
    new: true,
    runValidators: true,
    context: 'query',
  })
    .then((updatedPerson) => {
      console.log('Updated ' + updatedPerson.name)
      response.json(updatedPerson)
    })
    .catch((error) => {
      next(error)
    })
})

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }
  next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port : ${PORT}`)
})
