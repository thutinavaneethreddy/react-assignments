const Person = ({ person, deletePerson }) => {
  return (
    <div key={person.name}>
      {person.name} {person.number}
      <button onClick={deletePerson}>Delete</button>
    </div>
  );
};

export default Person;
