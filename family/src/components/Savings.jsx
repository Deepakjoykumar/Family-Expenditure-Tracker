import React, { useState } from 'react';
import { PiggyBank, Plus, Minus, TrendingUp } from 'lucide-react';

function Savings({ savings, onUpdateSavings }) {
  const [amounts, setAmounts] = useState({ personal: '', normal: '' });

  const handleUpdate = (type, operation) => {
    const amount = parseFloat(amounts[type]) || 0;
    if (amount <= 0) return;

    const newSavings = { ...savings };
    
    if (operation === 'add') {
      newSavings[type] += amount;
    } else {
      newSavings[type] = Math.max(0, newSavings[type] - amount);
    }
    
    onUpdateSavings(newSavings);
    setAmounts({ ...amounts, [type]: '' });
  };

  const totalSavings = savings.personal + savings.normal;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 flex items-center">
              <PiggyBank className="w-7 h-7 mr-3 text-emerald-600" />
              Family Savings
            </h2>
            <p className="text-gray-600 mt-1">Track your personal and family savings</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-600">Total Savings</p>
            <p className="text-3xl font-bold text-emerald-600">
              ₹{totalSavings.toLocaleString()}
            </p>
          </div>
        </div>
      </div>

      {/* Savings Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl shadow-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">Personal Savings</h3>
              <p className="text-blue-100 mt-1">Individual financial goals</p>
            </div>
            <TrendingUp className="w-8 h-8 text-blue-200" />
          </div>
          <div className="mt-6">
            <p className="text-3xl font-bold">₹{savings.personal.toLocaleString()}</p>
            <div className="mt-4">
              <div className="bg-white bg-opacity-20 rounded-full h-2">
                <div 
                  className="bg-white rounded-full h-2 transition-all duration-300"
                  style={{ width: `${Math.min(100, (savings.personal / Math.max(totalSavings, 1)) * 100)}%` }}
                />
              </div>
              <p className="text-blue-100 text-sm mt-2">
                {totalSavings > 0 ? Math.round((savings.personal / totalSavings) * 100) : 0}% of total savings
              </p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-emerald-500 to-teal-600 rounded-2xl shadow-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">Normal Savings</h3>
              <p className="text-emerald-100 mt-1">General family fund</p>
            </div>
            <PiggyBank className="w-8 h-8 text-emerald-200" />
          </div>
          <div className="mt-6">
            <p className="text-3xl font-bold">₹{savings.normal.toLocaleString()}</p>
            <div className="mt-4">
              <div className="bg-white bg-opacity-20 rounded-full h-2">
                <div 
                  className="bg-white rounded-full h-2 transition-all duration-300"
                  style={{ width: `${Math.min(100, (savings.normal / Math.max(totalSavings, 1)) * 100)}%` }}
                />
              </div>
              <p className="text-emerald-100 text-sm mt-2">
                {totalSavings > 0 ? Math.round((savings.normal / totalSavings) * 100) : 0}% of total savings
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Update Savings */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Personal Savings Update */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Update Personal Savings</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Amount (₹)</label>
              <input
                type="number"
                step="0.01"
                value={amounts.personal}
                onChange={(e) => setAmounts({ ...amounts, personal: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter amount"
              />
            </div>
            
            <div className="flex space-x-3">
              <button
                onClick={() => handleUpdate('personal', 'add')}
                className="flex-1 bg-emerald-500 text-white py-3 px-4 rounded-xl font-medium flex items-center justify-center space-x-2 hover:bg-emerald-600 transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Add</span>
              </button>
              <button
                onClick={() => handleUpdate('personal', 'subtract')}
                className="flex-1 bg-red-500 text-white py-3 px-4 rounded-xl font-medium flex items-center justify-center space-x-2 hover:bg-red-600 transition-colors"
              >
                <Minus className="w-4 h-4" />
                <span>Withdraw</span>
              </button>
            </div>
          </div>
        </div>

        {/* Normal Savings Update */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Update Normal Savings</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Amount (₹)</label>
              <input
                type="number"
                step="0.01"
                value={amounts.normal}
                onChange={(e) => setAmounts({ ...amounts, normal: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter amount"
              />
            </div>
            
            <div className="flex space-x-3">
              <button
                onClick={() => handleUpdate('normal', 'add')}
                className="flex-1 bg-emerald-500 text-white py-3 px-4 rounded-xl font-medium flex items-center justify-center space-x-2 hover:bg-emerald-600 transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Add</span>
              </button>
              <button
                onClick={() => handleUpdate('normal', 'subtract')}
                className="flex-1 bg-red-500 text-white py-3 px-4 rounded-xl font-medium flex items-center justify-center space-x-2 hover:bg-red-600 transition-colors"
              >
                <Minus className="w-4 h-4" />
                <span>Withdraw</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Savings Goals */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Savings Insights</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-4 bg-blue-50 rounded-xl">
            <p className="text-sm text-blue-600 font-medium">Monthly Target</p>
            <p className="text-2xl font-bold text-blue-700">₹{Math.round(totalSavings / 12).toLocaleString()}</p>
            <p className="text-xs text-blue-500 mt-1">Per month to maintain current level</p>
          </div>
          
          <div className="text-center p-4 bg-emerald-50 rounded-xl">
            <p className="text-sm text-emerald-600 font-medium">Growth Rate</p>
            <p className="text-2xl font-bold text-emerald-700">+12%</p>
            <p className="text-xs text-emerald-500 mt-1">Annual projected growth</p>
          </div>
          
          <div className="text-center p-4 bg-purple-50 rounded-xl">
            <p className="text-sm text-purple-600 font-medium">Emergency Fund</p>
            <p className="text-2xl font-bold text-purple-700">{totalSavings > 50000 ? '✓' : '✗'}</p>
            <p className="text-xs text-purple-500 mt-1">₹50,000 target {totalSavings > 50000 ? 'achieved' : 'pending'}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Savings;