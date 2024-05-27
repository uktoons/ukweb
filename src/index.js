const express = require("express");
const path = require('path');
const bodyParser = require('body-parser'); // Added bodyParser for parsing POST request bodies
const { connectDB } = require("./mongodb"); // Import connectDB function from mongodb.js

require('dotenv').config();

const app = express();

// Set up body parser middleware
app.use(bodyParser.urlencoded({ extended: true }));

// Set up views directory and view engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// Connect to MongoDB
connectDB();

// Define routes
app.get("/", (req, res) => {
    res.render("login");
});

app.get('/login', (req, res) => {
    res.render('login');
});

app.get("/signup", (req, res) => {
    res.render("signup");
});

app.post("/signup", async (req, res) => {
    const data = {
        name: req.body.name,
        password: req.body.password,
        email: req.body.email
    };
    try {
        // Save user data to MongoDB
        const user = new User(data);
        await user.save();
        res.render("home"); // Redirect to home page after signup
    } catch (error) {
        res.send("An error occurred while signing up.");
    }
});

app.post("/login", async (req, res) => {
    try {
        // Find user by name in MongoDB
        const user = await User.findOne({ name: req.body.name });
        if (user && user.password === req.body.password) {
            res.render("home"); // Redirect to home page after login
        } else {
            res.send("Wrong username or password.");
        }
    } catch (error) {
        res.send("An error occurred while logging in.");
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
