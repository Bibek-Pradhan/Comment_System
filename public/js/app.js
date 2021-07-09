let username;
let socket = io();

do {
    username = prompt("Enter your name: ");
} while (!username)

const textarea = document.querySelector("#textarea");
const submitBtn = document.querySelector("#submitBtn");
const commentBox = document.querySelector(".comment__box");

submitBtn.addEventListener("click", (e) => {
    e.preventDefault();
    const comment = textarea.value;

    if (!comment) {
        return;
    }
    postComment(comment);
});

function postComment(comment) {
    // Append comment dom
    const data = {
        username: username,
        comment: comment,
    }
    appendToDom(data);
    textarea.value = "";

    // Broadcast
    broadcastComment(data);

    // store in database
    storeInDb(data);
}

function appendToDom(data) {
    let lTag = document.createElement("li");
    lTag.classList.add("comment", "md-3");

    let markup = `
        <div class="card border-light mb-3">
        <div class="card-body">
            <h6>${data.username}</h6>
            <p>${data.comment}</p>
            <div>
                <img src="/img/clock.png" alt="clock">
                <small>${moment(data.time).format("LT")}</small>
            </div>
        </div>
    </div>
    `
    lTag.innerHTML = markup;

    commentBox.prepend(lTag);
}

function broadcastComment(data) {
    // Socket.io
    socket.emit("comment", data);
}

socket.on("comment", (data) => {
    appendToDom(data);
});

let timerId = null;

function debounce(func, timer) {

    if (timerId) {
        clearTimeout(timerId);
    }
    timerId = setTimeout(() => {
        func()
    }, timer)
}

const typingDiv = document.querySelector(".typing");

socket.on("typing", (data) => {
    typingDiv.innerText = `${data.username} is typing...`;
    debounce(function() {
        typingDiv.innerText = "";
    }, 1000);
});

// Event listner on text area for typing ...
textarea.addEventListener("keyup", (e) => {
    socket.emit("typing", { username });
});

// API calls
function storeInDb(data) {
    const headers = {
        'Content-Type': 'application/json'
    }
    fetch('/api/comments', { method: 'POST', body: JSON.stringify(data), headers })
        .then(response => response.json())
        .then(result => {
            console.log(result)
        })
}

function fetchComments() {
    fetch("/api/comments")
        .then(res => res.json())
        .then(result => {
            result.forEach((comment) => {
                comment.time = comment.createdAt //to show comment posted time in website
                appendToDom(comment);
            })
            console.log(result);
        })
}

window.onload = fetchComments;