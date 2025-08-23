import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Download, TrendingUp, Calendar, IndianRupee } from 'lucide-react';
import { format, startOfWeek, endOfWeek, startOfMonth, endOfMonth, eachDayOfInterval, eachWeekOfInterval, eachMonthOfInterval } from 'date-fns';
import jsPDF from 'jspdf';

const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#f97316', '#84cc16'];

function Reports({ expenses }) {
  const [reportType, setReportType] = useState('monthly');
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7));

  const generateWeeklyData = () => {
    const now = new Date();
    const weeks = [];
    
    for (let i = 3; i >= 0; i--) {
      const weekStart = startOfWeek(new Date(now.getTime() - i * 7 * 24 * 60 * 60 * 1000));
      const weekEnd = endOfWeek(weekStart);
      
      const weekExpenses = expenses.filter(exp => {
        const expDate = new Date(exp.timestamp);
        return expDate >= weekStart && expDate <= weekEnd;
      });
      
      const total = weekExpenses.reduce((sum, exp) => sum + exp.amount, 0);
      
      weeks.push({
        week: format(weekStart, 'MMM dd'),
        amount: total,
        count: weekExpenses.length
      });
    }
    
    return weeks;
  };

  const generateMonthlyData = () => {
    const now = new Date();
    const months = [];
    
    for (let i = 5; i >= 0; i--) {
      const monthStart = startOfMonth(new Date(now.getFullYear(), now.getMonth() - i, 1));
      const monthEnd = endOfMonth(monthStart);
      
      const monthExpenses = expenses.filter(exp => {
        const expDate = new Date(exp.timestamp);
        return expDate >= monthStart && expDate <= monthEnd;
      });
      
      const total = monthExpenses.reduce((sum, exp) => sum + exp.amount, 0);
      
      months.push({
        month: format(monthStart, 'MMM yyyy'),
        amount: total,
        count: monthExpenses.length
      });
    }
    
    return months;
  };

  const generateCategoryData = () => {
    const categoryTotals = {};
    expenses.forEach(exp => {
      categoryTotals[exp.category] = (categoryTotals[exp.category] || 0) + exp.amount;
    });
    
    return Object.entries(categoryTotals).map(([category, amount]) => ({
      name: category,
      value: amount
    })).sort((a, b) => b.value - a.value);
  };

  const getAverages = () => {
    const weeklyData = generateWeeklyData();
    const monthlyData = generateMonthlyData();
    
    const weeklyAverage = weeklyData.reduce((sum, week) => sum + week.amount, 0) / weeklyData.length;
    const monthlyAverage = monthlyData.reduce((sum, month) => sum + month.amount, 0) / monthlyData.length;
    
    return { weeklyAverage, monthlyAverage };
  };

  const downloadPDF = () => {
    const doc = new jsPDF();
    const monthYear = format(new Date(selectedMonth), 'MMMM yyyy');
    
    // Header
    doc.setFontSize(20);
    doc.text('₹ Family Expense Report', 20, 30);
    doc.setFontSize(14);
    doc.text(`Monthly Statement - ${monthYear}`, 20, 45);
    
    // Month expenses
    const monthStart = new Date(selectedMonth + '-01');
    const monthEnd = endOfMonth(monthStart);
    
    const monthExpenses = expenses.filter(exp => {
      const expDate = new Date(exp.timestamp);
      return expDate >= monthStart && expDate <= monthEnd;
    });
    
    const totalAmount = monthExpenses.reduce((sum, exp) => sum + exp.amount, 0);
    
    // Summary
    doc.setFontSize(12);
    doc.text(`Total Expenses: ₹${totalAmount.toLocaleString()}`, 20, 65);
    doc.text(`Number of Transactions: ${monthExpenses.length}`, 20, 75);
    doc.text(`Average per Day: ₹${(totalAmount / new Date(monthStart.getFullYear(), monthStart.getMonth() + 1, 0).getDate()).toFixed(2)}`, 20, 85);
    
    // Table header
    doc.text('Expense Details:', 20, 105);
    doc.setFontSize(10);
    
    // Draw table header
    const startY = 120;
    const rowHeight = 15;
    
    // Header background
    doc.setFillColor(240, 240, 240);
    doc.rect(20, startY - 5, 170, 10, 'F');
    
    // Header text
    doc.setFont(undefined, 'bold');
    doc.text('Date', 25, startY);
    doc.text('Description', 55, startY);
    doc.text('Category', 120, startY);
    doc.text('Amount (₹)', 160, startY);
    
    // Draw header border
    doc.setLineWidth(0.5);
    doc.line(20, startY - 5, 190, startY - 5); // Top
    doc.line(20, startY + 5, 190, startY + 5); // Bottom
    doc.line(20, startY - 5, 20, startY + 5); // Left
    doc.line(50, startY - 5, 50, startY + 5); // Date separator
    doc.line(115, startY - 5, 115, startY + 5); // Description separator
    doc.line(155, startY - 5, 155, startY + 5); // Category separator
    doc.line(190, startY - 5, 190, startY + 5); // Right
    
    // Table rows
    doc.setFont(undefined, 'normal');
    let currentY = startY + rowHeight;
    
    monthExpenses.forEach((exp, index) => {
      if (currentY > 270) {
        doc.addPage();
        currentY = 30;
        
        // Redraw header on new page
        doc.setFillColor(240, 240, 240);
        doc.rect(20, currentY - 5, 170, 10, 'F');
        doc.setFont(undefined, 'bold');
        doc.text('Date', 25, currentY);
        doc.text('Description', 55, currentY);
        doc.text('Category', 120, currentY);
        doc.text('Amount (₹)', 160, currentY);
        doc.line(20, currentY - 5, 190, currentY - 5);
        doc.line(20, currentY + 5, 190, currentY + 5);
        doc.line(20, currentY - 5, 20, currentY + 5);
        doc.line(50, currentY - 5, 50, currentY + 5);
        doc.line(115, currentY - 5, 115, currentY + 5);
        doc.line(155, currentY - 5, 155, currentY + 5);
        doc.line(190, currentY - 5, 190, currentY + 5);
        doc.setFont(undefined, 'normal');
        currentY += rowHeight;
      }
      
      // Alternate row background
      if (index % 2 === 1) {
        doc.setFillColor(250, 250, 250);
        doc.rect(20, currentY - 7, 170, rowHeight, 'F');
      }
      
      // Row data
      doc.text(format(new Date(exp.timestamp), 'dd/MM'), 25, currentY);
      
      // Truncate description if too long
      let description = exp.description;
      if (description.length > 25) {
        description = description.substring(0, 22) + '...';
      }
      doc.text(description, 55, currentY);
      
      // Truncate category if too long
      let category = exp.category;
      if (category.length > 15) {
        category = category.substring(0, 12) + '...';
      }
      doc.text(category, 120, currentY);
      
      doc.text(exp.amount.toFixed(2), 160, currentY);
      
      // Row borders
      doc.line(20, currentY - 7, 20, currentY + 8); // Left
      doc.line(50, currentY - 7, 50, currentY + 8); // Date separator
      doc.line(115, currentY - 7, 115, currentY + 8); // Description separator
      doc.line(155, currentY - 7, 155, currentY + 8); // Category separator
      doc.line(190, currentY - 7, 190, currentY + 8); // Right
      doc.line(20, currentY + 8, 190, currentY + 8); // Bottom
      
      currentY += rowHeight;
    });
    
    // Final table border
    doc.line(20, startY + 5, 20, currentY - rowHeight + 8); // Left border full height
    doc.line(190, startY + 5, 190, currentY - rowHeight + 8); // Right border full height
    
    doc.save(`expense-report-${monthYear.replace(' ', '-')}.pdf`);
  };

  const { weeklyAverage, monthlyAverage } = getAverages();
  const weeklyData = generateWeeklyData();
  const monthlyData = generateMonthlyData();
  const categoryData = generateCategoryData();

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Expense Reports</h2>
            <p className="text-gray-600 mt-1">Analyze your spending patterns</p>
          </div>
          <div className="flex space-x-4">
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="px-4 py-2 border border-gray-200 rounded-lg"
            >
              {Array.from({ length: 12 }, (_, i) => {
                const date = new Date();
                date.setMonth(date.getMonth() - i);
                const value = date.toISOString().slice(0, 7);
                return (
                  <option key={value} value={value}>
                    {format(date, 'MMMM yyyy')}
                  </option>
                );
              })}
            </select>
            <button
              onClick={downloadPDF}
              className="flex items-center space-x-2 bg-gradient-to-r from-emerald-500 to-blue-600 text-white px-4 py-2 rounded-lg hover:from-emerald-600 hover:to-blue-700 transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>Download PDF</span>
            </button>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Weekly Average</p>
              <p className="text-2xl font-bold text-blue-600">₹{weeklyAverage.toLocaleString()}</p>
            </div>
            <TrendingUp className="w-8 h-8 text-blue-600" />
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Monthly Average</p>
              <p className="text-2xl font-bold text-emerald-600">₹{monthlyAverage.toLocaleString()}</p>
            </div>
            <Calendar className="w-8 h-8 text-emerald-600" />
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Expenses</p>
              <p className="text-2xl font-bold text-purple-600">₹{expenses.reduce((sum, exp) => sum + exp.amount, 0).toLocaleString()}</p>
            </div>
            <IndianRupee className="w-8 h-8 text-purple-600" />
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Bar Chart */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Expense Trends</h3>
            <div className="flex space-x-2">
              <button
                onClick={() => setReportType('weekly')}
                className={`px-3 py-1 rounded-lg text-sm ${reportType === 'weekly' ? 'bg-blue-100 text-blue-600' : 'text-gray-600'}`}
              >
                Weekly
              </button>
              <button
                onClick={() => setReportType('monthly')}
                className={`px-3 py-1 rounded-lg text-sm ${reportType === 'monthly' ? 'bg-blue-100 text-blue-600' : 'text-gray-600'}`}
              >
                Monthly
              </button>
            </div>
          </div>
          
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={reportType === 'weekly' ? weeklyData : monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey={reportType === 'weekly' ? 'week' : 'month'} />
              <YAxis />
              <Tooltip formatter={(value) => [`₹${value.toLocaleString()}`, 'Amount']} />
              <Bar dataKey="amount" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Pie Chart */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Spending by Category</h3>
          
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={120}
                paddingAngle={5}
                dataKey="value"
              >
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [`₹${value.toLocaleString()}`, 'Amount']} />
            </PieChart>
          </ResponsiveContainer>
          
          <div className="mt-4 grid grid-cols-2 gap-2">
            {categoryData.slice(0, 6).map((category, index) => (
              <div key={category.name} className="flex items-center space-x-2">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: COLORS[index % COLORS.length] }}
                />
                <span className="text-sm text-gray-600 truncate">{category.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Reports;