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
const bankAccount = require("./model/BankAccount");
const scheduledTransactions = require("./model/ScheduledTransactions");

app.get("/v1/getAllUser" , async (req, res) => {
	try {
		const userData = await user.find(
			{},
			{ _id: 0, __v: 0, password: 0, token: 0 }
		);
		res.status(200).json({ data: userData, error: "" });
	} catch (err) {
		res.status(400).send({ data: null, error: "Error has occurred" });
	}
});

app.post("/v1/getUserByUsername" , async (req, res) => {
	try {
		const userData = await user.find(
			{Username: req.body.Username},
			{ _id: 0, __v: 0, password: 0, token: 0 }
		);
		res.status(200).json({ data: userData, error: "" });
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

app.post("/v1/login", async (req, res) => {
	const userData = await user.findOne({ Username: req.body.Username });
	// if no user found
	
	if (!userData) {
		res.status(400).send({data:null, error: "User not found" });
		// if user is admin
	} else {
		try {
			const isPasswordValid = await bcrypt.compare(
				req.body.Password,
				userData.Password
			);
			console.log( isPasswordValid)
			if (!isPasswordValid) {
				res.status(400).send({data:null,  error: "Invalid password" });
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
			res.status(500).send({ data: null , error: "Error Logging in" });
		}
	}
});


 app.post("/v1/deleteAccount/:UserID", async (req, res) => {
    console.log(req.params)
 	const { UserID } = req.params;
	
 	user.findOneAndDelete({ UserID: UserID}, (err, result) => {
 		if (result) {
 			res.status(200).send({ message: "Account deleted successfully" });
 		} else {
 			res.status(400).send({ message: "Error: Account does not exist", error: err });
 		}
 	});
 });



// Users
app.get("/v1/getAllUsers", async (req, res) => {
	try {
		const user = await users.find();
		// console.log(user);
		res.status(200).json(user);
	} catch (err) {
		res.status(400).send({ message: "Error has occurred", error: err });
	}
});


// BankAccounts
app.post("/v1/addBankAccount", async (req, res) => {

	var AccountID = Math.floor(Math.random() * 1000000000);

	// const { AccountID, UserID, AccountType, AcccountBalance } = req.body;

	const newBankAccount = new bankAccount({
		AccountID: AccountID,
		UserID: req.body.UserID,
		AccountType: req.body.AccountType,
		AcccountBalance: req.body.AcccountBalance
	});

	// console.log(newBankAccount);

	newBankAccount.save((err, result) => {
		if (err) {
			res.status(400).send({ message: "Error: Bank Account already exists", error: err });
		} else {
			res.status(200).send({ message: "Bank Account created successfully" });
		}
	});
});

app.get("/v1/getAllBankAccounts", async (req, res) => {
	try {
		const bankaccounts = await bankAccount.find();
		// console.log(bankaccounts);
		res.status(200).json(bankaccounts);
	} catch (err) {
		res.status(400).send({ message: "Error has occurred", error: err });
	}
});


app.get("/v1/getBankAccountsByUserId/:id", async (req, res) => {
	try {
		const bankaccounts = await getBankAccountsByUserId(req.params.id);
		res.status(200).json(bankaccounts);
	} catch (err) {
		res.status(400).send({ message: "Error has occurred", error: err });
	}
});


// // BankAccount
app.get("/v1/getAllBankAccounts" , async (req, res) => {
	try {
		const bankaccounts = await bankAccount.find();
		// console.log(bankaccounts);
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


// Create Scheduled Transaction

     app.get("/v1/addTransactions",  async (req, res) => {
        const {AccountID,ReceivingAccountID,Date,TransactionAmount,Comment} = req.body.inputs;
		console.log(AccountID)
        let TransactionID = 1;
          transactionData = await scheduledTransactions.findOne().sort({TransactionID: -1})
          if (transactionData) {
            TransactionID = transactionData.TransactionID + 1;
          }
		
 	const newScheduledTransaction = new scheduledTransactions({
 	    TransactionID,
 	    AccountID,
 	    ReceivingAccountID,
 	    Date,
 	    TransactionAmount,
 	    Comment
 	});

    newScheduledTransaction.save((err, result) => {
        if (err) {
			console.log(err)
            res.status(400).send({ message: "Error: Transaction already exists", error: err });
        } else {
            res.status(200).send({ message: "Transaction has been created successfully", data: "" });
        }
    });
});


// Delete Scheduled Transaction

app.get("/v1/delTransactions/:TransactionID",  async (req, res) => {
    console.log(req.params)
	const {TransactionID} = req.params;
  
   scheduledTransactions.findOneAndDelete({ TransactionID: TransactionID}, (err, result) => {
	if (err) {
	  res.status(400).send({ message: "Error: Transaction already exists", error: err });
	} else {
	  res.status(200).send({ message: "Transaction deleted successfully", data: "" });
	}
  });
});

app.get("/v1/getTransactionsByUserId/:id", async (req, res) => {
	try {
		const bankaccounts = await getBankAccountsByUserId(req.params.id);
		// console.log(bankaccounts);
		const result = []


		for (let i = 0; i < bankaccounts.length; i++) {
			const temp = { BankAccount: bankaccounts[i].AccountID }
			const transactions = await getTransactionsByAccountId(bankaccounts[i].AccountID);
			temp.Transactions = transactions;
			result.push(temp);
		}
		// console.log(result);
		res.status(200).json(result);
	} catch (err) {
		res.status(400).send({ message: "Error has occurred", error: err });
	}
});

app.get("/v1/getTransactionsByAccountId/:id", async (req, res) => {
	try {
		const transactions = await getTransactionsByAccountId(req.params.id);
		res.status(200).json(transactions);
	} catch (err) {
		res.status(400).send({ message: "Error has occurred", error: err });
	}
});

async function getBankAccountsByUserId(userId) {
	try {
		// console.log(userId);
		return await bankAccount.find({ "UserID": `${userId}` });
	} catch (err) {
		throw new Exception({ message: "Error has occurred", error: err });
	}
}

async function getTransactionsByAccountId(accountId) {
	try {
		// console.log(accountId);
		return await scheduledTransactions.find({ $or: [{ AccountID: accountId }, { ReceivingAccountID: accountId }] });
	} catch (err) {
		throw new Exception({ message: "Error has occurred", error: err });
	}
}



module.exports = app;
