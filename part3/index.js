const express = require("express");
var morgan = require("morgan");

var app = express();

app.use(express.json());
app.use(express.static('dist'));

app.use(
  morgan((tokens, req, res) => {
    return [
      tokens.method(req, res),
      tokens.url(req, res),
      tokens.status(req, res),
      tokens.res(req, res, "content-length"),"-",
      tokens["response-time"](req, res), "ms",
      JSON.stringify(req.body),
    ].join(" ");
  })
);

var persons = [
  {
    id: "1",
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: "2",
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: "3",
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: "4",
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

app.get("/info", (request, response) => {
  response.send(`
        <p>Phonebook has info for ${persons.length} people.</p>
        <p>${new Date()}</p>`);
});

app.get("/api/persons", (request, response) => {
  response.send(persons);
});

app.get("/api/persons/:id", (request, response) => {
  const id = request.params.id;
  const person = persons.find((person) => person.id == id);
  if (person) {
    response.send(person);
  } else {
    response.status(404).json({
      error: "Contact missing",
    });
    response.end();
  }
});

app.delete("/api/persons/:id", (request, response) => {
  const id = request.params.id;
  persons = persons.filter((person) => person.id != id);
  console.log(persons);
  response.status(204).end();
  response.set;
});

app.post("/api/persons", (request, response) => {
  const body = request.body;

  if (!body.name || !body.number) {
    return response.status(400).json({
      error: "Name and number are required",
    });
  }
  if (persons.find((person) => person.name == body.name)) {
    return response
      .status(400)
      .json({
        error: "Name must be unique",
      })
      .end();
  }
  const newPerson = {
    ...request.body,
    id: Math.floor(Math.random() * 100),
  };
  persons = persons.concat(newPerson);
  response.send(newPerson);
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port : ${PORT}`);
});
