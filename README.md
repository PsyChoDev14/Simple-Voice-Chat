# Voice Chat Application

This is a simple voice chat application that allows users to create their own voice chat servers and connect to each other using their IP addresses. The application features a sound bar that displays the microphone's input levels in real time.

## Features

- Create your own voice chat server.
- Join a voice chat server using an IP address.
- Real-time display of microphone input levels using a sound bar.

## Technologies Used

- HTML, CSS, JavaScript for the frontend
- Node.js, Express, Socket.io for the backend
- WebRTC for real-time communication
- Web Audio API for audio input analysis

## Setup and Installation

### Prerequisites

- Node.js installed on your machine.
- Internet connection to fetch external IP address.

### Installation

1. Clone the repository:

    ```bash
    git clone https://github.com/your-username/voice-chat-app.git
    cd voice-chat-app
    ```

2. Install dependencies:

    ```bash
    npm install
    ```

3. Run the server:

    ```bash
    node server.js
    ```

4. Open your browser and navigate to `http://localhost:3000`.

## Usage

### Creating a Server

1. Click on the "Create Server" button.
2. The server address will be displayed. Share this address with others who want to join your voice chat.

### Joining a Server

1. Enter the server address provided by the server creator in the input field.
2. Click the "Join Server" button.
3. Click the "Start Chat" button to start the voice chat.

### Leaving the Chat

1. Click the "Leave Chat" button to leave the voice chat.

## Project Structure

```plaintext
voice-chat-app/
├── public/
│   ├── index.html
│   ├── styles.css
│   └── script.js
├── server.js
├── package.json
└── package-lock.json
