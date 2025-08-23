import React, { useState, useEffect } from 'react';
import { PlusCircle, BarChart3, Download, PiggyBank, Calendar, TrendingUp } from 'lucide-react';
import AddExpense from './components/AddExpense';
import ExpenseList from './components/ExpenseList';
import Reports from './components/Reports';
import Savings from './components/Savings';
import { loadData, saveData } from './utils/storage';

function App() {
  const [activeTab, setActiveTab] = useState('add');
  const [expenses, setExpenses] = useState([]);
  const [savings, setSavings] = useState({ personal: 0, normal: 0 });

  useEffect(() => {
    const data = loadData();
    setExpenses(data.expenses);
    setSavings(data.savings);
  }, []);

  const handleAddExpense = (expense) => {
    const newExpenses = [...expenses, { ...expense, id: Date.now() }];
    setExpenses(newExpenses);
    saveData({ expenses: newExpenses, savings });
  };

  const handleDeleteExpense = (id) => {
    const newExpenses = expenses.filter(exp => exp.id !== id);
    setExpenses(newExpenses);
    saveData({ expenses: newExpenses, savings });
  };

  const handleUpdateSavings = (newSavings) => {
    setSavings(newSavings);
    saveData({ expenses, savings: newSavings });
  };

  const tabs = [
    { id: 'add', label: 'Add Expense', icon: PlusCircle },
    { id: 'list', label: 'Expenses', icon: Calendar },
    { id: 'reports', label: 'Reports', icon: BarChart3 },
    { id: 'savings', label: 'Savings', icon: PiggyBank }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white text-2xl font-bold">₹</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">
                  Family Expenditure Tracker
                </h1>
                <p className="text-gray-600 text-sm">Manage your family finances wisely</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm text-gray-600">Total Savings</p>
                <p className="text-xl font-bold text-emerald-600">
                  ₹{(savings.personal + savings.normal).toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex space-x-8">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        {activeTab === 'add' && (
          <AddExpense onAddExpense={handleAddExpense} />
        )}
        {activeTab === 'list' && (
          <ExpenseList 
            expenses={expenses} 
            onDeleteExpense={handleDeleteExpense}
          />
        )}
        {activeTab === 'reports' && (
          <Reports expenses={expenses} />
        )}
        {activeTab === 'savings' && (
          <Savings 
            savings={savings} 
            onUpdateSavings={handleUpdateSavings}
          />
        )}
      </main>
    </div>
  );
}

export default App;