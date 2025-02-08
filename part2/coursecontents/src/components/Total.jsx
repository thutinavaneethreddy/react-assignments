const Total = ({parts}) => {
    const total = parts.reduce((a, c) => a + c.exercises, 0);
    return (
        <p><b>Total of {total} exercises</b></p>
    )
}
    
export default Total;