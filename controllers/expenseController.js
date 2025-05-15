const User = require("../models/User");
const xlsx = require("xlsx")
const Expense = require("../models/Expense");

//add expense source
exports.addExpense = async (req, res) => {
    const userId = req.user.id;

    try {
        const { icon, category, amount, date } = req.body;

        // Validation: Check for missing fields
        if (!category || !amount || !date) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const newExpense = new Expense({
            userId,
            icon,
            category,
            amount,
            date: new Date(date),
        });

        await newExpense.save();
        res.status(200).json(newExpense);
    } catch (err) {
        res.status(500).json({ message: "Error in fetching all expense", error: err.message });
    }
};


exports.getAllExpense = async (req, res) => {
    const userId = req.user.id;
    
      try {
        const expense = await Expense.find({ userId }).sort({ date: -1 });
        if (!expense.length) {
          return res
            .status(200)
            .json({ message: "No expense records found", expense: [] });
        }
        res.status(200).json({ expense });
      } catch (err) {
        res
          .status(500)
          .json({ message: "Error in fetching all expense", error: err.message });
      }
};


exports.deleteExpense = async (req, res) => {
    try {
        await Expense.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "Expense deleted successfully" });
      } catch (err) {
        res
          .status(500)
          .json({ message: "Error in deleting Expense", error: err.message });
      }
};


exports.downloadExpenseExcel = async (req, res) => {
    const userId = req.user.id;
      try {
        const expense = await Expense.find({ userId }).sort({ date: -1 });
    
        // Prepare data for Excel
        const data = expense.map((item) => ({
          Source: item.source,
          Amount: item.amount,
          Date: item.date,
        }));
    
        const wb = xlsx.utils.book_new();
        const ws = xlsx.utils.json_to_sheet(data);
        xlsx.utils.book_append_sheet(wb, ws, "Expense");
        xlsx.writeFile(wb, "expense_details.xlsx");
        res.download("expense_details.xlsx");
      } catch (err) {
        res.status(500).json({ message: "Error in Downloading expense excel file", error: err.message });
      }
};
