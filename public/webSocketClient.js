
const socket = io();

function showToast(msg) {
  Toastify({
    text: msg,
    duration: 2000,
    close: true,
    stopOnFocus: true,
    position: "center",
  }).showToast();
}

socket.on("welcome-user", message => {
  showToast(message);
});

socket.on("close-session", message => {
  showToast(message);
});

socket.on()