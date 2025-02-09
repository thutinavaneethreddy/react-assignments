import { useState } from "react";
import Filter from "./components/Filter";
import PersonForm from "./components/PersonForm";
import Person from "./components/Person";
import { useEffect } from "react";
import PersonService from "./services/persons";

const SuccessMessage = ({successMessage}) => {
  if(successMessage == "") return null;
  return (
    <div className='success'>
      {successMessage}
    </div>
  )
};

const ErrorMessage = ({errorMessage}) => {
  if(errorMessage == "") return null;
  return (
    <div className="error">
      {errorMessage}
    </div>
  )
};


const App = () => {
  useEffect(() => {
    PersonService.getAll().then((response) => {
      setPersons(response);
    });
  }, []);
  const [persons, setPersons] = useState([]);

  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [filter, setFilter] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleNameChange = (event) => {
    setNewName(event.target.value);
  };

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value);
  };

  const handleFilterChange = (event) => {
    setFilter(event.target.value);
  };

  const addContact = (event) => {
    event.preventDefault();
    const oldPerson = persons.find((person) => person.name === newName);
    if (oldPerson) {
      if (window.confirm(`${oldPerson.name} is already added to phonebook, replace the old number with new one?`)) {
        const newPerson = {...oldPerson, number: newNumber};
        PersonService.updatePerson(oldPerson.id, newPerson).then((response) => {
          setPersons(persons.map((person) => person.id == oldPerson.id ? response : person));
          setSuccessMessage(`${newPerson.name}'s number updated`);
          setTimeout(() => setSuccessMessage(""), 5000);
        });
      }      
    } else {
      const newPerson = {
        name: newName,
        number: newNumber,
      };
      PersonService.createPerson(newPerson).then((response) => {
        setPersons(persons.concat(response));
        setSuccessMessage(`Added ${response.name}`);
        setTimeout(() => {
          setSuccessMessage("");
        }, 5000)
      }).catch((error) => {
        setErrorMessage(error.response.data.error);
        setTimeout(() => {
          setErrorMessage("");
        }, 5000);
        console.log(error.response.data.error);
      });
    }
  };

  let personsToShow =
    filter == ""
      ? persons
      : persons.filter((person) =>
          person.name.toLowerCase().includes(filter.toLowerCase())
        );
  
  const deletePerson = (id) => {
    const person = persons.find((person) => person.id == id);
    if (window.confirm(`Delete ${person.name}`)) {
      PersonService.deletePerson(id).then((response) => {
        setPersons(persons.filter((person) => person.id != id));
      })
      .catch((error) => {
        setErrorMessage(`Information of ${person.name} has already been removed from server`);
        setPersons(persons.filter((person) => person.id != id));
      });
    }
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <SuccessMessage successMessage={successMessage}/>
      <ErrorMessage errorMessage={errorMessage}/>
      <Filter value={filter} onChange={handleFilterChange} />
      <h2>add a new</h2>
      <PersonForm
        newName={newName}
        newNumber={newNumber}
        onNameChange={handleNameChange}
        onNumberChange={handleNumberChange}
        onFormSubmit={addContact}
      />

      <h2>Numbers</h2>
      {personsToShow.map((person) => (
        <Person key={person.id} person={person} deletePerson={() => deletePerson(person.id)} />
      ))}
    </div>
  );
};

export default App;
