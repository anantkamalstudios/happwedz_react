import React, { useState } from "react";
import {
  FaEdit,
  FaTrash,
  FaPlus,
  FaChevronDown,
  FaChevronRight,
} from "react-icons/fa";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const Budget = () => {
  const [budget, setBudget] = useState({
    estimated: 2000000,
    categories: [
      {
        id: 1,
        name: "Events",
        amount: 290284,
        subcategories: [
          {
            id: 101,
            name: "Venue Rental",
            estimated: 150000,
            final: 0,
            paid: 0,
          },
          {
            id: 102,
            name: "Decorations",
            estimated: 100000,
            final: 0,
            paid: 0,
          },
          {
            id: 103,
            name: "Entertainment",
            estimated: 40284,
            final: 0,
            paid: 0,
          },
        ],
      },
      {
        id: 2,
        name: "Catering",
        amount: 1414216,
        subcategories: [
          { id: 201, name: "Food", estimated: 1000000, final: 0, paid: 0 },
          { id: 202, name: "Beverages", estimated: 300000, final: 0, paid: 0 },
          { id: 203, name: "Service", estimated: 114216, final: 0, paid: 0 },
        ],
      },
      {
        id: 3,
        name: "Photography and Video",
        amount: 10086,
        subcategories: [
          { id: 301, name: "Photographer", estimated: 8000, final: 0, paid: 0 },
          { id: 302, name: "Videographer", estimated: 2086, final: 0, paid: 0 },
        ],
      },
      {
        id: 4,
        name: "Planning",
        amount: 50426,
        subcategories: [
          {
            id: 401,
            name: "Wedding Planner",
            estimated: 50000,
            final: 0,
            paid: 0,
          },
          { id: 402, name: "Consultation", estimated: 426, final: 0, paid: 0 },
        ],
      },
      {
        id: 5,
        name: "Transportation",
        amount: 20172,
        subcategories: [
          {
            id: 501,
            name: "Guest Transport",
            estimated: 15000,
            final: 0,
            paid: 0,
          },
          { id: 502, name: "Bridal Car", estimated: 5172, final: 0, paid: 0 },
        ],
      },
      {
        id: 6,
        name: "Bridal Accessories",
        amount: 3026,
        subcategories: [
          { id: 601, name: "Jewelry", estimated: 2000, final: 0, paid: 0 },
          { id: 602, name: "Shoes", estimated: 1026, final: 0, paid: 0 },
        ],
      },
      {
        id: 7,
        name: "Groom's Accessories",
        amount: 10084,
        subcategories: [
          { id: 701, name: "Suit", estimated: 8000, final: 0, paid: 0 },
          { id: 702, name: "Accessories", estimated: 2084, final: 0, paid: 0 },
        ],
      },
    ],
  });

  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isEditingBudget, setIsEditingBudget] = useState(false);
  const [newBudgetAmount, setNewBudgetAmount] = useState(budget.estimated);
  const [newExpense, setNewExpense] = useState({ name: "", estimated: 0 });

  // Colors for pie chart
  const COLORS = [
    "#0088FE",
    "#00C49F",
    "#FFBB28",
    "#FF8042",
    "#A28DFF",
    "#FF6B6B",
    "#4FD1C5",
    "#F687B3",
  ];

  // Prepare data for pie chart
  const getPieChartData = () => {
    return budget.categories.map((category) => ({
      name: category.name,
      value: category.amount,
    }));
  };

  // Format currency for Indian Rupees
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Toggle category expansion
  const toggleCategory = (categoryId) => {
    if (selectedCategory === categoryId) {
      setSelectedCategory(null);
    } else {
      setSelectedCategory(categoryId);
    }
  };

  // Update budget amount
  const handleBudgetUpdate = () => {
    setBudget({ ...budget, estimated: Number(newBudgetAmount) });
    setIsEditingBudget(false);
  };

  // Add new expense to category
  const addExpense = (categoryId) => {
    if (!newExpense.name || newExpense.estimated <= 0) return;

    const updatedCategories = budget.categories.map((category) => {
      if (category.id === categoryId) {
        const newExpenseId =
          Math.max(...category.subcategories.map((sc) => sc.id), 0) + 1;
        return {
          ...category,
          subcategories: [
            ...category.subcategories,
            {
              id: newExpenseId,
              name: newExpense.name,
              estimated: Number(newExpense.estimated),
              final: 0,
              paid: 0,
            },
          ],
          amount: category.amount + Number(newExpense.estimated),
        };
      }
      return category;
    });

    setBudget({
      ...budget,
      categories: updatedCategories,
      estimated: budget.estimated + Number(newExpense.estimated),
    });
    setNewExpense({ name: "", estimated: 0 });
  };

  // Update expense field
  const updateExpense = (categoryId, expenseId, field, value) => {
    const updatedCategories = budget.categories.map((category) => {
      if (category.id === categoryId) {
        const updatedSubcategories = category.subcategories.map((expense) => {
          if (expense.id === expenseId) {
            return { ...expense, [field]: Number(value) };
          }
          return expense;
        });

        // Recalculate category amount
        const newAmount = updatedSubcategories.reduce(
          (sum, exp) => sum + exp.estimated,
          0
        );

        return {
          ...category,
          subcategories: updatedSubcategories,
          amount: newAmount,
        };
      }
      return category;
    });

    // Recalculate total estimated budget
    const newTotalBudget = updatedCategories.reduce(
      (sum, cat) => sum + cat.amount,
      0
    );

    setBudget({
      ...budget,
      categories: updatedCategories,
      estimated: newTotalBudget,
    });
  };

  // Delete expense
  const deleteExpense = (categoryId, expenseId) => {
    const updatedCategories = budget.categories.map((category) => {
      if (category.id === categoryId) {
        const expenseToDelete = category.subcategories.find(
          (exp) => exp.id === expenseId
        );
        const filteredSubcategories = category.subcategories.filter(
          (exp) => exp.id !== expenseId
        );

        return {
          ...category,
          subcategories: filteredSubcategories,
          amount: category.amount - (expenseToDelete?.estimated || 0),
        };
      }
      return category;
    });

    // Recalculate total estimated budget
    const newTotalBudget = updatedCategories.reduce(
      (sum, cat) => sum + cat.amount,
      0
    );

    setBudget({
      ...budget,
      categories: updatedCategories,
      estimated: newTotalBudget,
    });
  };

  // Calculate total spent
  const totalSpent = budget.categories.reduce(
    (total, category) =>
      total +
      category.subcategories.reduce(
        (catTotal, expense) => catTotal + expense.paid,
        0
      ),
    0
  );

  // Calculate remaining budget
  const remainingBudget = budget.estimated - totalSpent;

  // Calculate total final cost (sum of all final costs)
  const totalFinalCost = budget.categories.reduce(
    (total, category) =>
      total +
      category.subcategories.reduce(
        (catTotal, expense) => catTotal + expense.final,
        0
      ),
    0
  );

  return (
    <div className="wb-container">
      <div className="wb-header">
        <h1 className="wb-title">Budget</h1>

        <div className="wb-budget-summary">
          <div className="wb-budget-card">
            <div className="wb-budget-label">ESTIMATED BUDGET</div>
            {isEditingBudget ? (
              <div className="wb-budget-edit">
                <input
                  type="number"
                  value={newBudgetAmount}
                  onChange={(e) => setNewBudgetAmount(e.target.value)}
                  className="wb-input"
                />
                <button
                  className="wb-button wb-save-button"
                  onClick={handleBudgetUpdate}
                >
                  Save
                </button>
                <button
                  className="wb-button wb-cancel-button"
                  onClick={() => {
                    setIsEditingBudget(false);
                    setNewBudgetAmount(budget.estimated);
                  }}
                >
                  Cancel
                </button>
              </div>
            ) : (
              <div className="wb-budget-amount">
                {formatCurrency(budget.estimated)}
                <button
                  className="wb-edit-button"
                  onClick={() => setIsEditingBudget(true)}
                >
                  <FaEdit />
                </button>
              </div>
            )}
          </div>

          <div className="wb-budget-card">
            <div className="wb-budget-label">TOTAL SPENT</div>
            <div className="wb-budget-amount">{formatCurrency(totalSpent)}</div>
          </div>

          <div className="wb-budget-card">
            <div className="wb-budget-label">REMAINING</div>
            <div
              className={`wb-budget-amount ${
                remainingBudget < 0 ? "wb-over-budget" : ""
              }`}
            >
              {formatCurrency(remainingBudget)}
            </div>
          </div>

          <div className="wb-budget-card">
            <div className="wb-budget-label">FINAL COST</div>
            <div className="wb-budget-amount">
              {formatCurrency(totalFinalCost)}
            </div>
          </div>
        </div>
      </div>

      <div className="wb-categories-container">
        <div className="wb-categories-list">
          <h2 className="wb-section-title">Categories</h2>
          {budget.categories.map((category) => (
            <div key={category.id} className="wb-category-item">
              <div
                className="wb-category-header"
                onClick={() => toggleCategory(category.id)}
              >
                <div className="wb-category-name">
                  {selectedCategory === category.id ? (
                    <FaChevronDown className="wb-category-icon" />
                  ) : (
                    <FaChevronRight className="wb-category-icon" />
                  )}
                  {category.name}
                </div>
                <div className="wb-category-amount">
                  {formatCurrency(category.amount)}
                </div>
              </div>

              {selectedCategory === category.id && (
                <div className="wb-subcategories-list">
                  {category.subcategories.map((expense) => (
                    <div key={expense.id} className="wb-subcategory-item">
                      <div className="wb-subcategory-name">{expense.name}</div>
                      <div className="wb-subcategory-details">
                        <input
                          type="number"
                          value={expense.estimated}
                          onChange={(e) =>
                            updateExpense(
                              category.id,
                              expense.id,
                              "estimated",
                              e.target.value
                            )
                          }
                          className="wb-input wb-small-input"
                        />
                        <span className="wb-currency">₹</span>
                      </div>
                      <button
                        className="wb-delete-button"
                        onClick={() => deleteExpense(category.id, expense.id)}
                      >
                        <FaTrash />
                      </button>
                    </div>
                  ))}

                  <div className="wb-add-expense">
                    <input
                      type="text"
                      placeholder="New expense name"
                      value={newExpense.name}
                      onChange={(e) =>
                        setNewExpense({ ...newExpense, name: e.target.value })
                      }
                      className="wb-input"
                    />
                    <input
                      type="number"
                      placeholder="Amount"
                      value={newExpense.estimated || ""}
                      onChange={(e) =>
                        setNewExpense({
                          ...newExpense,
                          estimated: e.target.value,
                        })
                      }
                      className="wb-input wb-amount-input"
                    />
                    <span className="wb-currency">₹</span>
                    <button
                      className="wb-button wb-add-button"
                      onClick={() => addExpense(category.id)}
                    >
                      <FaPlus /> Add
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="wb-expense-details">
          <h2 className="wb-section-title">Expense Details</h2>
          {selectedCategory ? (
            <>
              <div className="wb-category-summary">
                <h3 className="wb-category-title">
                  {
                    budget.categories.find((c) => c.id === selectedCategory)
                      ?.name
                  }
                </h3>
                <div className="wb-category-total">
                  {formatCurrency(
                    budget.categories.find((c) => c.id === selectedCategory)
                      ?.amount
                  )}
                </div>
              </div>

              <table className="wb-expense-table">
                <thead>
                  <tr>
                    <th>EXPENSE</th>
                    <th>ESTIMATED BUDGET</th>
                    <th>FINAL COST</th>
                    <th>PAID</th>
                    <th>ACTIONS</th>
                  </tr>
                </thead>
                <tbody>
                  {budget.categories
                    .find((c) => c.id === selectedCategory)
                    ?.subcategories.map((expense) => (
                      <tr key={expense.id}>
                        <td>{expense.name}</td>
                        <td>
                          <div className="wb-currency-input">
                            <span>₹</span>
                            <input
                              type="number"
                              value={expense.estimated}
                              onChange={(e) =>
                                updateExpense(
                                  selectedCategory,
                                  expense.id,
                                  "estimated",
                                  e.target.value
                                )
                              }
                              className="wb-input wb-table-input"
                            />
                          </div>
                        </td>
                        <td>
                          <div className="wb-currency-input">
                            <span>₹</span>
                            <input
                              type="number"
                              value={expense.final}
                              onChange={(e) =>
                                updateExpense(
                                  selectedCategory,
                                  expense.id,
                                  "final",
                                  e.target.value
                                )
                              }
                              className="wb-input wb-table-input"
                            />
                          </div>
                        </td>
                        <td>
                          <div className="wb-currency-input">
                            <span>₹</span>
                            <input
                              type="number"
                              value={expense.paid}
                              onChange={(e) =>
                                updateExpense(
                                  selectedCategory,
                                  expense.id,
                                  "paid",
                                  e.target.value
                                )
                              }
                              className="wb-input wb-table-input"
                            />
                          </div>
                        </td>
                        <td>
                          <button
                            className="wb-delete-button"
                            onClick={() =>
                              deleteExpense(selectedCategory, expense.id)
                            }
                          >
                            <FaTrash />
                          </button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </>
          ) : (
            <div className="wb-pie-chart-container">
              <div className="wb-pie-chart-message">
                Select a category to view expense details
              </div>
              <div className="wb-pie-chart-wrapper">
                <ResponsiveContainer width="100%" height={400}>
                  <PieChart>
                    <Pie
                      data={getPieChartData()}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={120}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) =>
                        `${name}: ${(percent * 100).toFixed(0)}%`
                      }
                    >
                      {budget.categories.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => formatCurrency(value)} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Budget;
