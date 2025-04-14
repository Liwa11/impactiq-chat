
const sendButton = document.querySelector(".input-action-btn.send");
const messageInput = document.querySelector(".message-input");
const main = document.querySelector(".main");

async function sendMessage() {
  const text = messageInput.value.trim();
  if (!text) return;

  appendMessage("user", text);
  messageInput.value = "";

  const res = await fetch("/api/chat", {
    method: "POST",
    body: JSON.stringify({
      messages: [
        { role: "system", content: "You are Impact IQ Chat, an expert in sustainability and ESG guidance." },
        { role: "user", content: text }
      ]
    }),
  });

  const reader = res.body.getReader();
  const decoder = new TextDecoder("utf-8");
  let content = "";

  let chunk;
  while (!(chunk = await reader.read()).done) {
    content += decoder.decode(chunk.value, { stream: true });
    updateLastAssistantMessage(content);
  }

  updateLastAssistantMessage(content, true);
}

function appendMessage(role, text) {
  const msg = document.createElement("div");
  msg.className = "message " + role;
  msg.innerHTML = `
    <div class="message-avatar">${role === "user" ? "JS" : "IQ"}</div>
    <div class="message-content"><p>${text}</p></div>
  `;
  main.appendChild(msg);
  main.scrollTop = main.scrollHeight;
}

function updateLastAssistantMessage(text, final = false) {
  let msgs = document.querySelectorAll(".message.assistant .message-content p");
  if (!msgs.length) {
    appendMessage("assistant", "");
    msgs = document.querySelectorAll(".message.assistant .message-content p");
  }
  msgs[msgs.length - 1].innerText = text;
}

sendButton.addEventListener("click", sendMessage);
messageInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    sendMessage();
  }
});
