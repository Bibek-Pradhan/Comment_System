//db connection
const mongoose = require("mongoose");

mongoose.connect(process.env.DATABASE, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
}).then(() => {
    console.log('Database connect sucessfully.');
}).catch((e) => {
    console.log('Failed connection.');
    console.log(e);
})