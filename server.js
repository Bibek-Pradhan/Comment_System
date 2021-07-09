const express = require("express");
const app = express();
require('dotenv').config();
require("./database/db");
const Comment = require("./models/comment");

const PORT = process.env.PORT || 8000;

app.use(express.static("public"));

app.use(express.json());

// Routes
app.post('/api/comments', (req, res) => {
    const comment = new Comment({
        username: req.body.username,
        comment: req.body.comment
    })
    comment.save().then(response => {
        res.send(response)
    })

});

app.get("/api/comments", (req, res) => {
    Comment.find().then(comments => {
        res.send(comments);
    });
});

const server = app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}.`);
});

const io = require("socket.io")(server);

io.on("connection", (socket) => {
    console.log(`New socket connection: ${socket.id}`);
    // receive event
    socket.on("comment", (data) => {
        data.time = Date();
        console.log(data);
        socket.broadcast.emit("comment", data);
    });

    socket.on("typing", (data) => {
        socket.broadcast.emit("typing", data);
    })
});