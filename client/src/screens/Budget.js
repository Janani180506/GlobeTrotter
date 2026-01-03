import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import './Budget.css';

const Budget = () => {
  const { id } = useParams();
  const [budget, setBudget] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBudget();
  }, [id]);

  const fetchBudget = async () => {
    try {
      const res = await axios.get(`/api/trips/${id}/budget`);
      setBudget(res.data.data);
    } catch (error) {
      console.error('Error fetching budget:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading budget...</div>;
  }

  if (!budget) {
    return <div className="container">Budget data not available</div>;
  }

  const pieData = [
    { name: 'Transport', value: budget.transport },
    { name: 'Accommodation', value: budget.accommodation },
    { name: 'Activities', value: budget.activities },
    { name: 'Meals', value: budget.meals },
  ].filter(item => item.value > 0);

  const barData = [
    { category: 'Transport', amount: budget.transport },
    { category: 'Accommodation', amount: budget.accommodation },
    { category: 'Activities', amount: budget.activities },
    { category: 'Meals', amount: budget.meals },
  ];

  const COLORS = ['#4CAF50', '#2196F3', '#FF9800', '#9C27B0'];

  return (
    <div className="container">
      <h1>Trip Budget Breakdown</h1>

      <div className="budget-summary">
        <div className="budget-card total">
          <h2>Total Budget</h2>
          <p className="budget-amount">${budget.total.toLocaleString()}</p>
          <p className="budget-days">{budget.days} days</p>
          <p className="budget-per-day">
            ${budget.avgCostPerDay.toFixed(2)} per day
          </p>
        </div>
      </div>

      <div className="budget-breakdown">
        <div className="budget-item">
          <span className="budget-label">Transport</span>
          <span className="budget-value">${budget.transport.toLocaleString()}</span>
        </div>
        <div className="budget-item">
          <span className="budget-label">Accommodation</span>
          <span className="budget-value">${budget.accommodation.toLocaleString()}</span>
        </div>
        <div className="budget-item">
          <span className="budget-label">Activities</span>
          <span className="budget-value">${budget.activities.toLocaleString()}</span>
        </div>
        <div className="budget-item">
          <span className="budget-label">Meals</span>
          <span className="budget-value">${budget.meals.toLocaleString()}</span>
        </div>
      </div>

      <div className="budget-charts">
        <div className="chart-card">
          <h3>Budget Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => `$${value.toLocaleString()}`} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-card">
          <h3>Cost by Category</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={barData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="category" />
              <YAxis />
              <Tooltip formatter={(value) => `$${value.toLocaleString()}`} />
              <Legend />
              <Bar dataKey="amount" fill="#4CAF50" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Budget;

