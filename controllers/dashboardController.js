const Income = require("../models/Income");
const Expense = require("../models/Expense");

const { isValidObjectId, Types } = require("mongoose");

//Dashboard Data
exports.getDashboardData = async (req, res) => {
  try {
    const userId = req.user.id;
    const userObjectId = new Types.ObjectId(String(userId));

    //fetching total income and expenses

    const totalIncome = await Income.aggregate([
      { $match: { userId: userObjectId } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);

    console.log("total Income", {
      totalIncome,
      userId: isValidObjectId(userId),
    });

    const totalExpense = await Expense.aggregate([
      { $match: { userId: userObjectId } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);

    // Get income transactions in the last 60 days
    const last30DaysIncomeTransactions = await Income.find({
      userId,
      date: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
    }).sort({ date: -1 });

    // Get total income for last 60 days
    const incomeLast30Days = last30DaysIncomeTransactions.reduce(
      (sum, transaction) => sum + transaction.amount,
      0
    );

    // Get expense transactions in the last 30 days
    const last30DaysExpenseTransactions = await Expense.find({
      userId,
      date: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
    }).sort({ date: -1 });

    // Get total expenses for last 30 days
    const expensesLast30Days = last30DaysExpenseTransactions.reduce(
      (sum, transaction) => sum + transaction.amount,
      0
    );
    // Get expenses from 1st of this month
    const thisMonthExpenseTransactions = await Expense.find({
      userId,
      date: {
        $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
      },
    }).sort({ date: -1 });

    // Get total expenses for this month
    const expensesThisMonth = thisMonthExpenseTransactions.reduce(
      (sum, transaction) => sum + transaction.amount,
      0
    );

    // Get income from 1st of this month
    const thisMonthIncomeTransactions = await Income.find({
      userId,
      date: {
        $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
      },
    }).sort({ date: -1 });

    // Get total income for this month
    const incomeThisMonth = thisMonthIncomeTransactions.reduce(
      (sum, transaction) => sum + transaction.amount,
      0
    );

    // Fetch last 5 transactions (income + expenses)
    const lastTransactions = [
      ...(await Income.find({ userId }).sort({ date: -1 }).limit(5)).map(
        (txn) => ({
          ...txn.toObject(),
          type: "income",
        })
      ),
      ...(await Expense.find({ userId }).sort({ date: -1 }).limit(5)).map(
        (txn) => ({
          ...txn.toObject(),
          type: "expense",
        })
      ),
    ].sort((a, b) => b.date - a.date); // Sort latest first

    // Fetch all transactions (income + expenses)
    const allTransactions = [
      ...(await Income.find({ userId }).sort({ date: -1 })).map((txn) => ({
        ...txn.toObject(),
        type: "income",
      })),
      ...(await Expense.find({ userId }).sort({ date: -1 }).limit(5)).map(
        (txn) => ({
          ...txn.toObject(),
          type: "expense",
        })
      ),
    ].sort((a, b) => b.date - a.date); // Sort latest first

    //this month balance
    const balanceThisMonth = incomeThisMonth - expensesThisMonth;


    // Final Response
    res.json({
      totalBalance:
        (totalIncome[0]?.total || 0) - (totalExpense[0]?.total || 0),
      totalIncome: totalIncome[0]?.total || 0,
      totalExpenses: totalExpense[0]?.total || 0,
      last30DaysExpenses: {
        total: expensesLast30Days,
        transactions: last30DaysExpenseTransactions,
      },
      thisMonthExpenses: {
        total: expensesThisMonth,
        transactions: thisMonthExpenseTransactions,
      },
      last30DaysIncome: {
        total: incomeLast30Days,
        transactions: last30DaysIncomeTransactions,
      },
      thisMonthIncome: {
        total: incomeThisMonth,
        transactions: thisMonthIncomeTransactions,
      },
      thisMonthBalance: balanceThisMonth,
      allTransactions: allTransactions,
      recentTransactions: lastTransactions,
    });
  } catch (err) {
    res.status(500).json({
      message: "Error in fetching dashboard data",
      error: err.message,
    });
  }
};
