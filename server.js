const express = require('express');
const connectToDatabase = require("./config/db");

const app = express();
//connection to DB
connectToDatabase();

// Defining Routes
app.use('/api/users', require('./routes/api/users'))
app.use('/api/posts', require('./routes/api/posts'))
app.use('/api/auth', require('./routes/api/auth'))
app.use('/api/profile', require('./routes/api/profile'))

app.get('/', (req, res) => res.send("API Running"));

const PORT = process.env.PORT || 3000
app.listen(PORT, () => console.log(`Server started on port no ${PORT}`))