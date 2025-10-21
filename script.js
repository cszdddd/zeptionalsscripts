// ==========================================================
// PASTE YOUR FIREBASE CONFIGURATION HERE
// IMPORTANT: Replace with your actual Firebase project details
// ==========================================================
const firebaseConfig = {
  apiKey: "AIzaSyClD-3xfEnSFwoGdGCbkJMce36UkDLeVnE ",
  authDomain: "realtimeaccountcreation.firebaseapp.com",
  projectId: "realtimeaccountcreation",
  storageBucket: "realtimeaccountcreaton.appspot.com",
  messagingSenderId: "658896933674 ",
  appId: "1:658896933674:web:3275d0678c39b54e8f8453"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const database = firebase.database();
const messagesRef = database.ref('messages'); // Reference to your 'messages' node in the database

// Get DOM elements
const chatMessages = document.getElementById('chat-messages');
const usernameInput = document.getElementById('username-input');
const messageInput = document.getElementById('message-input');
const sendButton = document.getElementById('send-button');

// Load username from local storage if it exists
document.addEventListener('DOMContentLoaded', () => {
    const storedUsername = localStorage.getItem('chatUsername');
    if (storedUsername) {
        usernameInput.value = storedUsername;
        messageInput.focus(); // Focus message input if username is pre-filled
    } else {
        usernameInput.focus(); // Otherwise, focus username input
    }
});


// Function to send a message
function sendMessage() {
    const username = usernameInput.value.trim();
    const messageText = messageInput.value.trim();

    if (!username) {
        alert('Please enter your name!');
        usernameInput.focus();
        return;
    }

    if (messageText) {
        const message = {
            username: username,
            text: messageText,
            timestamp: firebase.database.ServerValue.TIMESTAMP // Firebase server timestamp
        };

        messagesRef.push(message)
            .then(() => {
                console.log('Message sent successfully!');
                messageInput.value = ''; // Clear message input
                localStorage.setItem('chatUsername', username); // Save username for future visits
            })
            .catch((error) => {
                console.error('Error sending message:', error);
                alert('Failed to send message: ' + error.message);
            });
    }
}

// Event Listeners
sendButton.addEventListener('click', sendMessage);

// Send message on Enter key press in message input
messageInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        sendMessage();
    }
});

// Move focus to message input on Enter key press in username input
usernameInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        messageInput.focus();
    }
});

// Function to display a message in the UI
function displayMessage(messageData) {
    const messageElement = document.createElement('div');
    messageElement.classList.add('chat-message');

    // Check if the message is from the current user (basic check)
    // You might want to use a unique user ID from Firebase Auth for a more robust check
    const currentUsername = usernameInput.value.trim();
    if (currentUsername && messageData.username === currentUsername) {
        messageElement.classList.add('self');
    }


    const timestamp = new Date(messageData.timestamp);
    const timeString = timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    messageElement.innerHTML = `
        <strong>${messageData.username}:</strong> ${messageData.text}
        <span class="timestamp">${timeString}</span>
    `;
    chatMessages.appendChild(messageElement);

    // Scroll to the bottom of the chat
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Listen for new messages
messagesRef.orderByChild('timestamp').on('child_added', (snapshot) => {
    const messageData = snapshot.val();
    displayMessage(messageData);
});

// Listen for messages removed (optional, for real-time deletion)
// messagesRef.on('child_removed', (snapshot) => {
//     const removedMessageId = snapshot.key;
//     const messageToRemove = document.querySelector(`[data-message-id="${removedMessageId}"]`);
//     if (messageToRemove) {
//         messageToRemove.remove();
//     }
// });
