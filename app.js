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

const user = require("./model/User");
const bankaccount = require("./model/BankAccount");
const scheduledTransactions = require("./model/ScheduledTransactions");

app.get("/v1/getAllUser" , async (req, res) => {
	try {
		const userData = await user.find(
			{},
			{ _id: 0, __v: 0, password: 0, token: 0 }
		);
		res.status(200).json({ data: userData, error: "Error has occurred" });
	} catch (err) {
		res.status(400).send({ data: null, error: "Error has occurred" });
	}
});

app.post("/v1/editUser" , async (req, res) => {
	try {
		const userData = await user.findOne({ Username: req.body.Username });
		if (userData) {
			userData.Address = req.body.Address;
			userData.Email = req.body.Email;
			userData.save()
			res.status(200).send({ data: null, error: "User editted!" });
		}
		else {
			res.status(400).send({ data: null, error: "No User found" });
		}
		
	} catch (err) {
		res.status(400).send({ data: null, error: "Error has occurred" });
	}
});

app.post("/v1/addUser",  async (req, res) => {
	const { Username, Password, Firstname, Lastname, Email, Address, OptIntoPhyStatements } = req.body;
	const hashedPassword = await bcrypt.hash(Password, 10);
	let Userid = 1;
	userData = await user.findOne().sort({UserID: -1})
	if (userData) {
		Userid = userData.UserID + 1;
	}
	
	const newAccount = new user({
		UserID: Userid,
		Username,
		Password : hashedPassword,
		Firstname,
		Lastname,
		Email,
		Address,
		OptIntoPhyStatements
	});
	
	newAccount.save((err, result) => {
		if (err) {
			res.status(400).send({ data: null, error: "Error: Account already exists" });
		} else {
			res.status(200).send({ data: 'token' , error: null});
		}
	});
});

app.post("/v1/login" , async (req, res) => {
	const userData = await user.findOne({ Username: req.body.Username });
	// if no user found
	
	if (!userData) {
		res.status(401).send({ message: "User not found" });
		// if user is admin
	} else {
		try {
			const isPasswordValid = await bcrypt.compare(
				req.body.Password,
				userData.Password
			);
			console.log( isPasswordValid)
			if (!isPasswordValid) {
				res.status(401).send({ message: "Invalid password" });
			} else {
				// user.token = jwt.sign(
				// 	{
				// 		exp: Math.floor(Date.now() / 1000) + 60 * 60 * 2,
				// 		userid: req.body.userid,
				// 	},
				// 	"7Rs"
				// );

				res.status(200).send({
					data: {
						token: "token",
						user: 
							{
								"UserID": userData.UserID,
								"Username": userData.Username,
								"Firstname": userData.Firstname,
								"Lastname": userData.Lastname,
								"Email": userData.Email,
								"Address": userData.Address,
								"OptIntoPhyStatements": userData.OptIntoPhyStatements
							},
						// token: user.token,
					},
					error: null,
				});
			}
		} catch (error) {
			res.status(500).send({ message: "Error: Error Logging in", error: error });
		}
	}
});


// app.post("/v1/deleteAccount", async (req, res) => {
// 	const { accountid } = req.body;
	
// 	account.findOneAndDelete({ _id: accountid }, (err, result) => {
// 		if (result) {
// 			res.status(200).send({ message: "Account deleted successfully" });
// 		} else {
// 			res.status(400).send({ message: "Error: Account does not exist", error: err });
// 		}
// 	});
// });

// // User

// // BankAccount
// app.get("/v1/getBankAccount" , async (req, res) => {
// 	try {
// 		const user = await account.find(
// 			{},
// 			{ _id: 0, __v: 0, password: 0, token: 0 }
// 		);
// 		res.status(200).json(user);
// 	} catch (err) {
// 		res.status(400).send({ message: "Error has occurred", error: err });
// 	}
// });

// ScheduledTransactions
app.get("/v1/getBankAccount", authenticateToken , async (req, res) => {
	try {
		const accounts = await scheduledTransactions.find(
			{},
			{ _id: 0, __v: 0, password: 0, token: 0 }
		);
		res.status(200).json(accounts);
	} catch (err) {
		res.status(400).send({ message: "Error has occurred", error: err });
	}
});


module.exports = app;
