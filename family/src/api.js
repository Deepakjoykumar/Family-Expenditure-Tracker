const API_URL = "https://fet-backend-si39.onrender.com/api/expenses"; 
// ⚠️ change to your deployed backend URL later

// Get all expenses
export const getExpenses = async () => {
  const res = await fetch(API_URL);
  return await res.json();
};

// Add expense
export const addExpense = async (expense) => {
  await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(expense),
  });
};

// Delete expense
export const deleteExpense = async (id) => {
  await fetch(`${API_URL}/${id}`, { method: "DELETE" });
};

// Update expense
export const updateExpense = async (id, expense) => {
  await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(expense),
  });
};
