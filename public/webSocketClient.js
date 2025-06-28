
const socket = io();

function showToast(msg) {
  Toastify({
    text: msg,
    duration: 1000,
    close: true,
    stopOnFocus: true,
    position: "center",
  }).showToast();
}

socket.on("login", message => {
  showToast(message);
});

socket.on("logout", message => {
  showToast(message);
});

socket.on()