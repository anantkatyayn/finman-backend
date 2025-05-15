const User = require("../models/User");
const xlsx = require("xlsx")
const Income = require("../models/Income");

//add income source
exports.addIncome = async (req, res) => {
  const userId = req.user.id;
  const { icon, source, amount, date } = req.body;
  try {
    if (!source || !amount || !date) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const newIncome = new Income({
      userId,
      icon,
      source,
      amount,
      date: new Date(date),
    });

    await newIncome.save();

    res.status(200).json(newIncome);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error in adding income", error: err.message });
  }
};

//get income
exports.getAllIncome = async (req, res) => {
  const userId = req.user.id;

  try {
    const income = await Income.find({ userId }).sort({ date: -1 });
    if (!income.length) {
      return res
        .status(200)
        .json({ message: "No income records found", income: [] });
    }
    res.status(200).json({ income });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error in fetching all income", error: err.message });
  }
};

//delete income
exports.deleteIncome = async (req, res) => {
  try {
    await Income.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Income deleted successfully" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error in deleting income", error: err.message });
  }
};

//download income excel
exports.downloadIncomeExcel = async (req, res) => {
  const userId = req.user.id;
  try {
    const income = await Income.find({ userId }).sort({ date: -1 });

    // Prepare data for Excel
    const data = income.map((item) => ({
      Source: item.source,
      Amount: item.amount,
      Date: item.date,
    }));

    const wb = xlsx.utils.book_new();
    const ws = xlsx.utils.json_to_sheet(data);
    xlsx.utils.book_append_sheet(wb, ws, "Income");
    xlsx.writeFile(wb, "income_details.xlsx");
    res.download("income_details.xlsx");
  } catch (err) {
    res.status(500).json({ message: "Error in Downloading income excel file", error: err.message });
  }
};
