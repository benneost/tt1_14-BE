require("dotenv").config();
require("./config/database").connect();
const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const authenticateToken = require("./middleware/authenticateToken");
const app = express();
const cors = require("cors");

app.use(express.json());
app.use(
	cors({
		origin: "*",
		methods: ["GET", "POST"],
		allowedHeaders: ["Content-Type", "Authorization", "x-access-token"],
	})
);

const users = require("./model/User");
const bankAccount = require("./model/BankAccount");
const scheduledTransactions = require("./model/ScheduledTransactions");

// app.get("/v1/getAccounts", authenticateToken , async (req, res) => {
// 	try {
// 		const accounts = await account.find(
// 			{},
// 			{ _id: 0, __v: 0, password: 0, token: 0 }
// 		);
// 		res.status(200).json(accounts);
// 	} catch (err) {
// 		res.status(400).send({ message: "Error has occurred", error: err });
// 	}
// });

// app.post("/v1/addAccount",  async (req, res) => {
// 	const { accountid, password, email, role } = req.body;
// 	const hashedPassword = await bcrypt.hash(password, 10);
	
	

// 	const newAccount = new account({
// 		_id: accountid,
// 		accountid,
// 		password: hashedPassword,
// 		email,
// 		role,
// 		token: token,
// 	});
	

// 	newAccount.save((err, result) => {
// 		if (err) {
// 			res.status(400).send({ message: "Error: Account already exists", error: err });
// 		} else {
// 			res.status(200).send({ message: "Account created successfully", data: token });
// 		}
// 	});
// });

// app.post("/v1/deleteAccount", authenticateToken, async (req, res) => {
// 	const { accountid } = req.body;
	
// 	account.findOneAndDelete({ _id: accountid }, (err, result) => {
// 		if (result) {
// 			res.status(200).send({ message: "Account deleted successfully" });
// 		} else {
// 			res.status(400).send({ message: "Error: Account does not exist", error: err });
// 		}
// 	});
// });


// Users
app.get("/v1/getAllUsers" , async (req, res) => {
	try {
		const user = await users.find();
		// console.log(user);
		res.status(200).json(user);
	} catch (err) {
		res.status(400).send({ message: "Error has occurred", error: err });
	}
});


// BankAccounts
// // BankAccount
app.post("/v1/addBankAccount",  async (req, res) => {

	var AccountID = Math.floor(Math.random() * 1000000000);

	// const { AccountID, UserID, AccountType, AcccountBalance } = req.body;
	
	const newBankAccount = new bankAccount({
		AccountID: AccountID,
		UserID: req.body.UserID,
		AccountType: req.body.AccountType,
		AcccountBalance: req.body.AcccountBalance
	});

	console.log(newBankAccount);

	newBankAccount.save((err, result) => {
		if (err) {
			res.status(400).send({ message: "Error: Bank Account already exists", error: err });
		} else {
			res.status(200).send({ message: "Bank Account created successfully" });
		}
	});
});

app.get("/v1/getAllBankAccounts" , async (req, res) => {
	try {
		const bankaccounts = await bankAccount.find();
		// console.log(bankaccounts);
		res.status(200).json(bankaccounts);
	} catch (err) {
		res.status(400).send({ message: "Error has occurred", error: err });
	}
});


app.get("/v1/getBankAccountsByUserId/:id" , async (req, res) => {
	try {
		const bankaccounts = await getBankAccountsByUserId(req.params.id);
		res.status(200).json(bankaccounts);
	} catch (err) {
		res.status(400).send({ message: "Error has occurred", error: err });
	}
});


// ScheduledTransactions
app.get("/v1/getAllTransactions" , async (req, res) => {
	try {
		const transactions = await scheduledTransactions.find();
		// console.log(transactions);
		res.status(200).json(transactions);
	} catch (err) {
		res.status(400).send({ message: "Error has occurred", error: err });
	}
});

app.get("/v1/getTransactionsByUserId/:id" , async (req, res) => {
	try {
		const bankaccounts = await getBankAccountsByUserId(req.params.id);
		console.log(bankaccounts);
		const result = []

		
		for (let i = 0; i < bankaccounts.length; i++) {
			const temp = {BankAccount: bankaccounts[i].AccountID}
			const transactions = await getTransactionsByAccountId(bankaccounts[i].AccountID);
			temp.Transactions = transactions;
			result.push(temp);
		}
		console.log(result);
		res.status(200).json(result);
	} catch (err) {
		res.status(400).send({ message: "Error has occurred", error: err });
	}
});

async function getBankAccountsByUserId(userId){
	try {
		// console.log(userId);
		return await bankAccount.find({"UserID":`${userId}`});
	} catch (err) {
		throw new Exception({ message: "Error has occurred", error: err });
	}
}

async function getTransactionsByAccountId(accountId){
	try {
		// console.log(accountId);
		return await scheduledTransactions.find({ $or: [ { AccountID: accountId }, { ReceivingAccountID: accountId } ] });
	} catch (err) {
		throw new Exception({ message: "Error has occurred", error: err });
	}
}



module.exports = app;
