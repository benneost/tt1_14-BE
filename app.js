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

const account = require("./model/account");

app.get("/v1/getAccounts", authenticateToken , async (req, res) => {
	try {
		const accounts = await account.find(
			{},
			{ _id: 0, __v: 0, password: 0, token: 0 }
		);
		res.status(200).json(accounts);
	} catch (err) {
		res.status(400).send({ message: "Error has occurred", error: err });
	}
});

app.post("/v1/addAccount",  async (req, res) => {
	const { accountid, password, email, role } = req.body;
	const hashedPassword = await bcrypt.hash(password, 10);
	
	

	const newAccount = new account({
		_id: accountid,
		accountid,
		password: hashedPassword,
		email,
		role,
		token: token,
	});
	

	newAccount.save((err, result) => {
		if (err) {
			res.status(400).send({ message: "Error: Account already exists", error: err });
		} else {
			res.status(200).send({ message: "Account created successfully", data: token });
		}
	});
});

app.post("/v1/deleteAccount", authenticateToken, async (req, res) => {
	const { accountid } = req.body;
	
	account.findOneAndDelete({ _id: accountid }, (err, result) => {
		if (result) {
			res.status(200).send({ message: "Account deleted successfully" });
		} else {
			res.status(400).send({ message: "Error: Account does not exist", error: err });
		}
	});
});

// User

// BankAccount
app.get("/v1/getBankAccount", authenticateToken , async (req, res) => {
	try {
		const accounts = await account.find(
			{},
			{ _id: 0, __v: 0, password: 0, token: 0 }
		);
		res.status(200).json(accounts);
	} catch (err) {
		res.status(400).send({ message: "Error has occurred", error: err });
	}
});
// ScheduledTransactions
module.exports = app;
