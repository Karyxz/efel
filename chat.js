// Mock data for demonstration purposes
let currentServer = 'Abyss';
let currentChannel = 'general';
const servers = {
    'Abyss': ['general', 'mystery', 'unknown'],
    'Nebula': ['stargazing', 'blackholes'],
    'Cosmos': ['planets', 'galaxies']
};
let onlineUsers = ['User123', 'CosmicExplorer', 'StarDust'];

// DOM Elements
const serverList = document.getElementById('serverList');
const channelList = document.getElementById('channelList');
const messageArea = document.getElementById('messageArea');
const messageInput = document.getElementById('messageInput');
const currentChannelHeader = document.getElementById('currentChannel');
const onlineUsersCount = document.getElementById('onlineUsersCount');
const onlineUsersList = document.getElementById('onlineUsersList');
const addServerIcon = document.getElementById('addServerIcon');
const addChannelIcon = document.getElementById('addChannelIcon');
const settingsIcon = document.getElementById('settingsIcon');

// Modals
const createServerModal = document.getElementById('createServerModal');
const createChannelModal = document.getElementById('createChannelModal');
const settingsModal = document.getElementById('settingsModal');

// Initialize the chat
function initializeChat() {
    updateServerList();
    updateChannelList();
    updateOnlineUsers();
    addEventListeners();
}

// Update server list
function updateServerList() {
    serverList.innerHTML = '';
    Object.keys(servers).forEach(server => {
        const serverIcon = document.createElement('div');
        serverIcon.className = 'server-icon';
        serverIcon.textContent = server[0].toUpperCase();
        serverIcon.onclick = () => switchServer(server);
        serverList.appendChild(serverIcon);
    });
    serverList.appendChild(addServerIcon);
}

// Update channel list
function updateChannelList() {
    channelList.innerHTML = '';
    servers[currentServer].forEach(channel => {
        const li = document.createElement('li');
        li.textContent = channel;
        li.onclick = () => switchChannel(channel);
        channelList.appendChild(li);
    });
}

// Switch server
function switchServer(server) {
    currentServer = server;
    currentChannel = servers[server][0];
    updateChannelList();
    updateCurrentChannel();
}

// Switch channel
function switchChannel(channel) {
    currentChannel = channel;
    updateCurrentChannel();
}

// Update current channel display
function updateCurrentChannel() {
    currentChannelHeader.textContent = `#${currentChannel}`;
    // Here you would typically load messages for the current channel
}

// Update online users
function updateOnlineUsers() {
    onlineUsersCount.textContent = `${onlineUsers.length} online`;
    onlineUsersList.innerHTML = '';
    onlineUsers.forEach(user => {
        const li = document.createElement('li');
        li.textContent = user;
        onlineUsersList.appendChild(li);
    });
}

// Add event listeners
function addEventListeners() {
    messageInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') sendMessage();
    });

    addServerIcon.onclick = () => createServerModal.style.display = 'block';
    addChannelIcon.onclick = () => createChannelModal.style.display = 'block';
    settingsIcon.onclick = () => settingsModal.style.display = 'block';

    document.querySelectorAll('.close-modal').forEach(btn => {
        btn.onclick = () => {
            createServerModal.style.display = 'none';
            createChannelModal.style.display = 'none';
            settingsModal.style.display = 'none';
        };
    });

    document.getElementById('createServerBtn').onclick = createServer;
    document.getElementById('createChannelBtn').onclick = createChannel;
}

// Send message
function sendMessage() {
    const content = messageInput.value.trim();
    if (content) {
        const message = {
            user: 'User123',
            content: content,
            timestamp: new Date().toLocaleTimeString()
        };
        displayMessage(message);
        messageInput.value = '';
    }
}

// Display message
function displayMessage(message) {
    const messageElement = document.createElement('div');
    messageElement.className = 'message';
    messageElement.innerHTML = `
        <div class="message-header">
            <div class="avatar">${message.user[0]}</div>
            <span class="username">${message.user}</span>
            <span class="timestamp">${message.timestamp}</span>
        </div>
        <div class="message-content">${message.content}</div>
    `;
    messageArea.prepend(messageElement);
}

// Create new server
function createServer() {
    const serverName = document.getElementById('newServerName').value.trim();
    if (serverName && !servers[serverName]) {
        servers[serverName] = ['general'];
        updateServerList();
        createServerModal.style.display = 'none';
    }
}

// Create new channel
function createChannel() {
    const channelName = document.getElementById('newChannelName').value.trim();
    if (channelName && !servers[currentServer].includes(channelName)) {
        servers[currentServer].push(channelName);
        updateChannelList();
        createChannelModal.style.display = 'none';
    }
}
async function getMessages(channel) {
    try {
        const response = await fetch(`http://localhost:5000/api/messages/${channel}`, {
            headers: {
                'x-auth-token': localStorage.getItem('token')
            }
        });
        if (!response.ok) {
            throw new Error('Failed to fetch messages');
        }
        const messages = await response.json();
        displayMessages(messages);
    } catch (error) {
        console.error('Error fetching messages:', error);
    }
}

async function sendMessage(content, channel) {
    try {
        const response = await fetch('http://localhost:5000/api/messages', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-auth-token': localStorage.getItem('token')
            },
            body: JSON.stringify({ content, channel })
        });
        if (!response.ok) {
            throw new Error('Failed to send message');
        }
        const message = await response.json();
        displayMessage(message);
    } catch (error) {
        console.error('Error sending message:', error);
    }
}

function displayMessages(messages) {
    const messageArea = document.getElementById('messageArea');
    messageArea.innerHTML = '';
    messages.forEach(message => displayMessage(message));
}

function displayMessage(message) {
    const messageArea = document.getElementById('messageArea');
    const messageElement = document.createElement('div');
    messageElement.className = 'message';
    messageElement.innerHTML = `
        <div class="message-header">
            <span class="username">${message.sender.username}</span>
            <span class="timestamp">${new Date(message.createdAt).toLocaleString()}</span>
        </div>
        <div class="message-content">${message.content}</div>
    `;
    messageArea.appendChild(messageElement);
}

// Call getMessages when switching channels or initializing the chat
function switchChannel(channel) {
    currentChannel = channel;
    updateCurrentChannel();
    getMessages(channel);
}

// Call sendMessage when the user submits a new message
messageInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        const content = messageInput.value.trim();
        if (content) {
            sendMessage(content, currentChannel);
            messageInput.value = '';
        }
    }
});
// Initialize the chat when the page loads
window.onload = initializeChat;
