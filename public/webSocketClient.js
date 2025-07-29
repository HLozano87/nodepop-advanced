const socket = io();
// WIP TOAST
// socket.on("connect", () => {
//   fetch("/session-login")
//     .then((res) => res.json())
//     .then(({ message }) => {
//       if (message) showToast(message, "success");
//     });

//   fetch("/session-logout")
//     .then((res) => res.json())
//     .then(({ message }) => {
//       if (message) showToast(message, "info");
//     });
// });

function showToast(msg, type = "success") {
  const colors = {
    success: "#4CAF50",
    error: "#F44336",
    info: "#2196F3",
    warning: "#FFC107",
  };

  Toastify({
    text: msg,
    duration: 1500,
    close: true,
    stopOnFocus: true,
    position: "center",
    style: {
      background: colors[type] || "#4CAF50",
    },
  }).showToast();
}

socket.on("login", (message) => {
  showToast(message, "success");
});

socket.on("logout", (message) => {
  showToast(message, "info");
});

socket.on("create-product", (message) => {
  showToast(message, "success");
});

socket.on("update-product", (message) => {
  showToast(message, "info");
});

socket.on("delete-product", (message) => {
  showToast(message, "warning");
});
