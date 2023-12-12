const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');
const bodyParser = require('body-parser');
const signupRouter = require('./signupRoutes');
const loginRouter = require('./loginRoutes');
const userModel = require('./models/user_schema');
const jwt = require('jsonwebtoken');
const secretKey = 'your_secret_key'; // Replace with your actual secret key
const chartModel = require('./models/chart_schema');
require('dotenv').config();

const PORT = process.env.PORT || 3031;
const MONGODB_URI = process.env.MONGODB_URI ||'mongodb+srv://purnatummala2003:Ammulu1307@cluster0.oibub3r.mongodb.net/?retryWrites=true&w=majority';

mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.error('MongoDB Connection Error:', err));
    

const app = express();

app.use(cors());
app.use(cors({
	origin: ["*"],
	method:["GET","POST"],
	credentials:true
}))
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/signup', signupRouter);
app.use('/login', loginRouter);

app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers", "Content-type,Authorization");
    next();
});

app.post("/api/get_budget", (req, res) => {
	validateToken(req.body.token, res, (user) => {
		res.json({
			ok: 1,
			budgetData: user.budgetData,
			income: user.income,
			savings: user.savings,
		});
	});
});

app.post("/api/update_income", (req, res) => {
  validateToken(req.body.token, res, (user) => {
    const income = req.body.income;

    if (income === undefined || income === null || isNaN(income)) {
      return res.status(400).json({ error: "Invalid income value" });
    }

    userModel
      .updateOne(
        { username: user.username },
        { $set: { income: income } },
        { upsert: true }
      )
      .then(() => {
        res.json({ ok: 1, income: income });
      })
      .catch((error) => {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
      });
  });
});



app.post("/api/update_savings", (req, res) => {
  validateToken(req.body.token, res, (user) => {
    const savings = req.body.savings;

    if (savings === undefined || savings === null || isNaN(savings)) {
      return res.status(400).json({ error: "Invalid savings value" });
    }

    userModel
      .updateOne(
        { username: user.username },
        { $set: { savings: savings } },
        { upsert: true }
      )
      .then(() => {
        res.json({ ok: 1, savings: savings });
      })
      .catch((error) => {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
      });
  });
});


app.post("/api/add_budget", (req, res) => {
	validateToken(req.body.token, res, (user) => {
		for (let i = 0; i < user.budgetData.length; i++) {
			if (req.body.title == user.budgetData[i].title) {
				res.json({
					ok: 0,
					error:
						"Error: There is already a budget item with the same title.",
				});
				return;
			}
		}
		// Handle more cases of colors than HTML/CSS normally does.
		let color = req.body.color;
		if (color.startsWith("#")) {
			color = color.substring(1);
		}
		if (/^[A-Fa-f0-9]*$/.test(color)) {
			if (color.length === 6 || color.length === 8) {
				color = "#" + color;
			} else if (color.length === 3 || color.length === 4) {
				color = color
					.split("")
					.map(function (v) {
						return v + v;
					})
					.join("");
				color = "#" + color;
			}
		}
		// Create new budget document.
		const newBudget = new chartModel({
			title: req.body.title,
			budget: req.body.budget,
			color: req.body.color,
		});
		user.budgetData.push(newBudget);
		// Store updated user in DB.
		userModel
			.updateOne({ username: user.username }, user, upsert)
			.then(( ) => {
			
				// Respond to the client.
				res.json({
					ok: 1,
					response: "Budget data added.",
				});
				return;
			})
			.catch((connectionError) => {
				console.log(connectionError);
			});
	});
});


app.post("/api/delete_from_budget", (req, res) => {
	validateToken(req.body.token, res, (user) => {
		// Remove budget data from user document.
		user.budgetData = user.budgetData.filter(
			(item) => item.title != req.body.title
		);
		// Store updated user in DB.
		userModel
			.updateOne({ username: user.username }, user, upsert)
			.then(( ) => {
				
				// Respond to the client.
				res.json({
					ok: 1,
					response: "Budget data deleted.",
				});
				return;
			})
			.catch((connectionError) => {
				console.log(connectionError);
			});
	});
});


// JWT validation middleware
function validateToken(token, res, callback) {
  if (!token) {
      res.json({ ok: 0, error: "Error: Invalid token, please log in again." });
      return;
  }
  try {
      const decoded = jwt.verify(token, secretKey);
      // Using async/await syntax
      userModel.findOne({ username: decoded.username })
          .then(user => {
              if (!user || decoded.iat < user.validTime) {
                  res.json({ ok: 0, error: "Error: Invalid token, please log in again." });
                  return;
              }
              callback(user);
          })
          .catch(err => {
              console.error(err);
              res.json({ ok: 0, error: "Error: Invalid token, please log in again." });
          });
  } catch (e) {
      console.error(e);
      res.json({ ok: 0, error: "Error: Invalid token, please log in again." });
  }
}

app.listen(PORT,'155.138.193.44', () => {
    console.log(`Server running on port ${PORT}`);
});
