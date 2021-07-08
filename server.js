const express = require("express");
const app = express();

const PORT = process.env.PORT || 8000;

app.use(express.static("public"));

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