// chatbot.js

function toggleChat() {
  const widget = document.getElementById("chat-widget");
  widget.classList.toggle("open");
}


async function sendMessage() {
  const userInput = document.getElementById("userInput");
  const userMsg = userInput.value;
  if (!userMsg.trim()) return;

  appendMessage("You", userMsg);
  userInput.value = "";

  const typingDiv = document.createElement("div");
  typingDiv.id = "typingIndicator";
  typingDiv.innerHTML = `<em>Bot is typing...</em>`;
  document.getElementById("chat-messages").appendChild(typingDiv);
  scrollToBottom();

  const res = await fetch("http://localhost:3000/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message: userMsg }),
  });

  const data = await res.json();
  appendMessage("Bot", data.reply);
}

function appendMessage(sender, message) {
  const chat = document.getElementById("chat-messages");
  const div = document.createElement("div");
  div.innerHTML = `<strong>${sender}:</strong> ${message}`;
  chat.appendChild(div);
  chat.scrollTop = chat.scrollHeight;
}
 
function scrollToBottom() {
  const chat = document.getElementById("chat-messages");
  chat.scrollTop = chat.scrollHeight;
}
