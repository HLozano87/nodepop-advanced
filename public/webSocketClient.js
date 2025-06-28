const socket = io();

function showToast(msg) {
  Toastify({
    text: msg,
    duration: 1500,
    close: true,
    stopOnFocus: true,
    position: "center",
  }).showToast();
}

socket.on("login", (message) => {
  showToast(message);
});

socket.on("logout", (message) => {
  showToast(message);
});

socket.on("create-product", (message) => {
  showToast(message);
});

socket.on("update-product", (message) => {
  showToast(message);
});

socket.on("delete-product", (message) => {
  showToast(message);
});