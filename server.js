const express = require('express');
const connectToDatabase = require("./config/db");

var cors = require('cors')
const app = express();

//connection to DB
connectToDatabase();
//In it middleware
app.use(express.json()); // this allows us to take request.body data
app.use(cors())

// Defining Routes
app.use('/api/users', require('./routes/api/users'))
app.use('/api/posts', require('./routes/api/posts'))
app.use('/api/auth', require('./routes/api/auth'))
app.use('/api/profile', require('./routes/api/profile'))

app.get('/', (req, res) => res.send("API Running"));

// const PORT = process.env.PORT || 3000
const PORT = 5000
app.listen(PORT, () => console.log(`Server started on port no ${PORT}`))


