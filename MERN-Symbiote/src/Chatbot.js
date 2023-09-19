$(document).ready(function () {
    var messages = []; // Array to store the conversation history

    // Function to add a new message to the chat
    function addMessage(sender, content) {
        var chatContainer = $(".chatbot-body");
        var senderClass = sender === "user" ? "user-message" : "chatbot-message";

        chatContainer.append('<div class="message ' + senderClass + '">' + content + '</div>');

        // Scroll to the bottom of the chat container
        chatContainer.scrollTop(chatContainer.prop("scrollHeight"));
    }

    // Handle send button click or Enter key press
    function handleSendMessage() {
        var messageInput = $("#chat-input");
        var message = messageInput.val().trim();

        if (message !== "") {
            addMessage("user", message);
            messages.push({ role: "user", content: message }); // Add user message to the conversation history
            messageInput.val("");
            getChatbotResponse();
        }
    }

    // Get chatbot response from the server
    function getChatbotResponse() {
        // Make a POST request to the server
        $.post("chatbot.php", { messages: JSON.stringify(messages) }, function (response) {
            addMessage("chatbot", response);
            messages.push({ role: "assistant", content: response }); // Add chatbot response to the conversation history
        });
    }

    // Bind send button click event
    $("#send-button").click(handleSendMessage);

    // Bind Enter key press event
    $("#chat-input").keypress(function (event) {
        if (event.which === 13) {
            handleSendMessage();
        }
    });

    // Pop-out functionality
    var chatbotContainer = $(".chatbot-container");
    var popOutButton = $('<button class="pop-out-button">Chat</button>');

    popOutButton.click(function () {
        chatbotContainer.toggleClass("pop-out");
    });

    chatbotContainer.prepend(popOutButton);
});
