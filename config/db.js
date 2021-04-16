const mongoose = require('mongoose');
const config = require('config');
const db = config.get('mongoURI');

const connectToDatabase = async () => {
    try {
        await mongoose.connect(db, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true,
            useFindAndModify: false
        });
        console.log("Mongoose Connected...")
    } catch (error) {
        console.log(error.message);
        process.exit(1);
    }
}
module.exports = connectToDatabase;