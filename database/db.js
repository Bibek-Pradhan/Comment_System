//db connection
const mongoose = require("mongoose");

mongoose.connect(process.env.DATABASE, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
}).then(() => {
    console.log('DB Connected.');
}).catch((e) => {
    console.log('DB Broken.');
    console.log(e);
})

// This is the file edited by King Nishan KAdel.
// Hail Nishan Kadel
