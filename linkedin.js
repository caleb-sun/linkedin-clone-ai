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
    console.log(history.slice(0, -1)) // ignore last message because it includes message we want to send now
    
    // Access your API key (see "Set up your API key" above)
    const genAI = new GoogleGenerativeAI("AIzaSyDxSvYsZ8geXwZyEX-lotNuOutPtIkTkuw");
    console.log(genAI)

    // For text-only input, use the gemini-pro model
    const model = genAI.getGenerativeModel({ model: "gemini-pro"});
  
    const chat = model.startChat({
      history: history.slice(0,-1),
      generationConfig: {
        maxOutputTokens: 100,
      },
    });
    
    const result = await chat.sendMessage(msg);
    const response = result.response;
    const text = response.text();
    console.log(response, text)

    // Return the response text
    return text;
}

// Update the chat user function to add messages to history
function updateChatUser(input) {
    const timestamp = getCurrentTime();
    addMessageToChat('user', input, timestamp);
    updateChatHistory('user', input)

}

function updateChatHistory(role, text) {
    // Retrieve the chat history from the session
    let history = JSON.parse(sessionStorage.getItem('chatHistory')) || [];

    // Update the chat history with the new message and response
    history = history.concat([{ role: role, parts: [{ text: text }] }]);

    // Save the updated chat history back to the session
    sessionStorage.setItem('chatHistory', JSON.stringify(history));
}


// Update the chat bot function to add messages to history
function updateChatBot(response, timestamp) {
    addMessageToChat('bot', response, timestamp);
    updateChatHistory('model', response)
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
            
            const newMsg = await callGemini(userMessage); // Call your backend API to handle the message
            messageInput.value = ''; // Clear the input field
            messageInput.focus();   // Focus on the input field for the next message
            setTimeout(function() {
                if (newMsg) {
                    updateChatBot(newMsg, getCurrentTime()); // Update the chat box with the bot response
                } else {
                    updateChatBot("Error generating AI message", getCurrentTime()); // Update the chat box with the bot response
                }
              }, 500);
            
            
        } else {
            console.log("no message")
        }
});
