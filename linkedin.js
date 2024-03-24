import { GoogleGenerativeAI } from "@google/generative-ai";

function addMessageToChat(sender, message, timestamp) {
    const chatBody = document.querySelector('.message-body');

    // Create a new message element
    const newMessage = document.createElement('div');
    newMessage.className = sender === 'user' ? 'chat-message me' : 'chat-message bot';
    newMessage.innerHTML = `
        <img src="images/profile/main-profile-image.jpg">
        <div class="chat-message-contents">
            <div class="chat-message-details">
                <p><b>${sender === 'user' ? 'User Name' : 'Bot Name'}</b></p>
                <sub class="gray">(He/Him) • ${timestamp}</sub>
            </div>
            <p id="message-contents">${message}</p>
        </div>
    `;

    // Append the new message to the chat body
    chatBody.appendChild(newMessage);

    // Scroll to the bottom of the chat body to show the latest message
    chatBody.scrollTop = chatBody.scrollHeight;
}


// Function to send to Gemini
async function callGemini(msg) {
    console.log("calling gemini")
    // Retrieve the chat history from the session
    let history = JSON.parse(sessionStorage.getItem('chatHistory')) || [];
    
    // Access your API key (see "Set up your API key" above)
    const genAI = new GoogleGenerativeAI("AIzaSyDxSvYsZ8geXwZyEX-lotNuOutPtIkTkuw");
    console.log(genAI)

    // For text-only input, use the gemini-pro model
    const model = genAI.getGenerativeModel({ model: "gemini-pro"});
  
    const chat = model.startChat({
      history: history,
      generationConfig: {
        maxOutputTokens: 100,
      },
    });
    
    const result = await chat.sendMessage(msg);
    const response = await result.response;
    const text = response.text();
    
    // Update the chat history with the new message and response
    history = history.concat([{role: "user", parts: [{ text: msg }]}, {role:"model", parts: [{text: text}]}]);
    
    // Save the updated chat history back to the session
    sessionStorage.setItem('chatHistory', JSON.stringify(history));
    
    // Return the response text
    return text;
}

function loadChatHistory() {
        const historyJson = localStorage.getItem('chatHistory');
        return historyJson ? JSON.parse(historyJson) : [];
}

function saveChatHistory(history) {
    localStorage.setItem('chatHistory', JSON.stringify(history));
}

// Function to retrieve chat history
function getChatHistory() {
    return chatHistory;
}

// Update the chat user function to add messages to history
function updateChatUser(input) {
    const timestamp = getCurrentTime();
    addMessageToChat('user', input, timestamp);
}


// Update the chat bot function to add messages to history
function updateChatBot(response, timestamp) {
    addMessageToChat('bot', response, timestamp);
}

// Helper function to get current time in HH:mm format
function getCurrentTime() {
    const now = new Date();
    return now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
}

const sendButton = document.querySelector('button.send');
sendButton.addEventListener('click', async () => {
    console.log("clicked send")
        const messageInput = document.querySelector('.chat-input-field');
        const userMessage = messageInput.value.trim();
        console.log("clicked send")
        if (userMessage) {
            updateChatUser(userMessage);
            messageInput.value = ''; // Clear the input field
            messageInput.focus();   // Focus on the input field for the next message
            const newMsg = await callGemini(userMessage); // Call your backend API to handle the message
            updateChatBot(newMsg, getCurrentTime()); // Update the chat box with the bot response
        } else {
            console.log("no message")
        }
});
