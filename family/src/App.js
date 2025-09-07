import React, { useEffect, useState } from "react";
import { getExpenses, addExpense, deleteExpense } from "./api";

function App() {
  const [expenses, setExpenses] = useState([]);

  // Load expenses from backend
  useEffect(() => {
    async function fetchData() {
      const data = await getExpenses();
      setExpenses(data);
    }
    fetchData();
  }, []);

  // Add new expense
  const handleAdd = async () => {
    const newExpense = { title: "Snacks", amount: 100, category: "Food" };
    await addExpense(newExpense);
    setExpenses(await getExpenses()); // refresh
  };

  return (
    <div>
      <h1>Family Expenditure Tracker</h1>
      <button onClick={handleAdd}>Add Expense</button>
      <ul>
        {expenses.map((e) => (
          <li key={e._id}>
            {e.title} - {e.amount} ({e.category})
            <button onClick={() => deleteExpense(e._id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
