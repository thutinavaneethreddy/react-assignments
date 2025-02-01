import { useState } from "react";

const StatisticLine = ({text, value}) => {
  return (
    <tr>
      <td>{text}</td>
      <td>{value}</td>
    </tr>
  )
}

const Statistics = ({good, neutral, bad}) => {
  const calculateAverage = () => {
    return (good - bad)/(good + neutral + bad);
  }
  
  if (good + neutral + bad == 0) {
      return (
        <div>
           <div>No Feedback Given</div>
        </div>
      )
  }

  return (
    <table>
      <tbody>
        <StatisticLine text="Good" value={good}/>
        <StatisticLine text="Neutral" value={neutral}/>
        <StatisticLine text="Bad" value={bad}/>
        <StatisticLine text="All" value={good + neutral + bad}/>
        <StatisticLine text="Average" value={calculateAverage()}/>
        <StatisticLine text="Positive" value={(good * 100)/(good + neutral + bad)}/>
      </tbody>
    </table>
  )
}

const Button = ({text, onClick}) => {
  return (
    <button onClick={onClick}>{text}</button>
  )
}

const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0);
  const [neutral, setNeutral] = useState(0);
  const [bad, setBad] = useState(0);

  return (
    <div>
      <h2>Give feedback</h2>
      <Button text="Good" onClick={() => setGood(good + 1)}/>
      <Button text="Neutral" onClick={() => setNeutral(neutral + 1)}/>
      <Button text="Bad" onClick={() => setBad(bad + 1)}/>
      <h2>Statistics</h2>
      <Statistics good={good} neutral={neutral} bad={bad}/>
    </div>
  );
};

export default App;
