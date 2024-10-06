// Check if the user is authenticated
const session = window.localStorage.getItem("session");

if (session) {
  document.getElementById("wiki-feature").style.display = "block"; // Show APSIT-Wiki if authenticated
  document.getElementById("logout-btn").style.display = "block"; // Show logout button
  document.getElementById("profile-btn").style.display = "none"; // Hide "Are you from APSIT?"
} else {
  document.getElementById("wiki-feature").style.display = "none"; // Hide APSIT-Wiki if not authenticated
  document.getElementById("logout-btn").style.display = "none"; // Hide logout button
  document.getElementById("profile-btn").style.display = "block"; // Show "Are you from APSIT?"
}

// Function to handle logout
function logout() {
  // Clear the session from local storage
  window.localStorage.removeItem("session");

  // Redirect the user to signin.html
  window.location.href = "/signin.html";
}

const chatbox = document.getElementById("chatbox");
const userMessageElement = document.getElementById("user-message");
const sendBtn = document.getElementById("send-btn");
const chatbotContainer = document.getElementById("chatbot-container");
const chatbotToggler = document.getElementById("chatbot-toggler");
const closeBtn = document.getElementById("close-btn");

let micActive = false;
const recognition = new (window.SpeechRecognition ||
  window.webkitSpeechRecognition)();
recognition.lang = "en-US";
recognition.interimResults = false;

// Clear chat history on page reload
const loadChatHistory = () => {
  localStorage.removeItem("chatHistory");
  chatbox.innerHTML = ""; // Clear any existing messages
};

const saveChatHistory = () => {
  const messages = [];
  document.querySelectorAll("#chatbox li").forEach((message) => {
    messages.push({
      text: message.innerText,
      type: message.classList.contains("outgoing") ? "outgoing" : "incoming",
      timestamp: message.querySelector(".small.text-muted").innerText,
    });
  });
  localStorage.setItem("chatHistory", JSON.stringify(messages));
};

const addChatMessage = (message, type, timestamp) => {
  const chatMessage = document.createElement("li");
  chatMessage.classList.add("chat", type);
  chatMessage.innerHTML = `<p>${message} <span class="small text-muted" style="color:black">(${timestamp})</span></p>`;
  chatbox.appendChild(chatMessage);
  chatbox.scrollTop = chatbox.scrollHeight;
  saveChatHistory();
};

const sendMessage = (message) => {
  if (!message) return;
  const timestamp = new Date().toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
  addChatMessage(message, "outgoing", timestamp);
  handleBotResponse(message);
};

const handleBotResponse = (message) => {
  const typingIndicator = document.createElement("li");
  typingIndicator.classList.add("chat", "incoming");
  typingIndicator.innerHTML = `<div class="typing-indicator"><span class="typing-animation"></span><span class="typing-animation"></span><span class="typing-animation"></span></div>`;
  chatbox.appendChild(typingIndicator);
  chatbox.scrollTop = chatbox.scrollHeight;

  setTimeout(() => {
    chatbox.removeChild(typingIndicator);
    const botResponse = getBotResponse(message);
    const timestamp = new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
    addChatMessage(botResponse, "incoming", timestamp);

    if (!micActive) {
      responsiveVoice.speak(botResponse);
    }
  }, 1000);
};

const getBotResponse = (message) => {
  const responses = {
    hello: "Hello! How can I assist you today?",
    "where is the canteen?":
      "Navigate to the ground floor, enter your current location, and select 'Canteen' as your destination.",
    "where can i find the stationary shop?":
      "Go to the ground floor, input your location, and choose 'Stationary' as your destination.",
    "where is the it faculty room?":
      "Select your current location and set '304D (IT Faculty Room)' as your destination.",
    "how do i reach the hardware workshop for first-year students?":
      "Head to the basement or parking area, enter your location, and mark 'Workshop-1' as your destination.",
    "where is the cafeteria located?":
      "Set your destination to 'Cafeteria-1/-2' and follow the provided directions.",
    "where are the nearest restrooms?":
      "Mark 'Restroom' as your destination and follow the directions provided.",
    "where is the it head of department's room?":
      "Scan for the nearest room, select '318D' as your destination, and follow the blue arrow.",
    "how do i find the main entrance?":
      "The main entrance is indicated by a blue arrow.",
    "is there an elevator nearby?":
      "Select the elevator option and follow the blue path to locate the nearest elevator.",
    "how can i reach the library?":
      "Enter your current location and set your destination to 'Library,' then follow the arrow.",
    "where is the seminar hall?":
      "Select your destination and click the start button to follow the designated path.",
    "how do i get to the reception?":
      "Mark 'Reception' as your destination and follow the path outlined.",
    "where is the principal room?":
      "Set your destination to 'Principal Room,' click the start button, and follow the designated path.",
    "where can i find the boys' common room?":
      "Enter your starting location and set the destination to 'Boys' Common Room,' then follow the path.",
    "how do i reach the physics lab?":
      "Scan for the nearest room, select 'Physics Lab,' and follow the blue arrow.",
    "where is room 304b?":
      "Scan for the nearest room, select '304B,' and follow the blue arrow.",
    "how can i reach the examination cell?":
      "Enter your current location, mark 'Examination Cell' as your destination, and follow the arrow.",
    "where is the music room?":
      "Enter your current location, set your destination to 'Music Room,' and follow the provided path.",
    "how do i report an issue or provide feedback?":
      "You can report issues or provide feedback at the reception desk or by using the feedback form available on the website.",
    "what are the operating hours for the cafeteria?":
      "The cafeteria operates from 8 AM to 8 PM on weekdays. Please check the schedule for weekend hours.",
    "how do i access wi-fi on campus?":
      "Wi-Fi is available throughout the campus. Connect to the network 'Campus Wi-Fi' and use your student credentials to log in.",
    "where is the outdoor seating area?":
      "The outdoor seating area is located in front of the ground floor cafeteria. Follow the path marked 'Cafeteria 2.'",
  };
  return responses[message.toLowerCase()] || "Please visit the Reception";
};

// Handle microphone input
recognition.addEventListener("result", (event) => {
  const transcript = event.results[0][0].transcript;
  sendMessage(transcript);
});

// Send button event listener
sendBtn.addEventListener("click", () => {
  const userMessage = userMessageElement.value;
  userMessageElement.value = "";
  sendMessage(userMessage);
});

// Toggle chatbot display
chatbotToggler.addEventListener("click", () => {
  chatbotContainer.style.display =
    chatbotContainer.style.display === "none" ? "block" : "none";
});

// Close chatbot button
closeBtn.addEventListener("click", () => {
  chatbotContainer.style.display = "none";
});

// Load chat history when the page loads
document.addEventListener("DOMContentLoaded", loadChatHistory);

/* Recommended Topics Feature */

const recommendedTopics = [
  "Where is the canteen?",
  "where can i find the stationary shop?",
  "where is the it faculty room?",
  "How do I reach the hardware workshop for first-year students?",
  "Where is the cafeteria located?",
  "Where are the nearest restrooms?",
  "Where is the IT Head of Department's room?",
  "How do I find the main entrance?",
  "Is there an elevator nearby?",
  "How can I reach the library?",
  "Where is the seminar hall?",
  "How do I get to the reception?",
  "Where is the Principal room?",
  "Where can I find the Boy's common room?",
  "How do I reach the physics lab?",
  "Where is room 304B?",
  "How can I reach the Examination Cell?",
  "Where is the music room?",
  "How do I report an issue or provide feedback?",
  "What are the operating hours for the cafeteria?",
  "How do I access Wi-Fi on campus?",
  "Where is the outdoor seating area?",
];

const topicListElement = document.getElementById("topic-list");
const refreshBtn = document.getElementById("refresh-btn");

const displayRecommendedTopics = () => {
  topicListElement.innerHTML = "";
  const randomTopics = getRandomTopics(3);
  randomTopics.forEach((topic) => {
    const topicElement = document.createElement("li");
    topicElement.textContent = topic;
    topicElement.addEventListener("click", () => {
      // Check if there is a bot response for the topic
      const botResponse = getBotResponse(topic);
      const timestamp = new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
      if (botResponse) {
        addChatMessage(topic, "outgoing", timestamp);
        addChatMessage(botResponse, "incoming", timestamp);
      } else {
        addChatMessage(topic, "outgoing", timestamp);
        addChatMessage("Please visit the Reception", "incoming", timestamp);
      }
    });
    topicListElement.appendChild(topicElement);
  });
};

const getRandomTopics = (count) => {
  const shuffled = recommendedTopics.sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

// Refresh recommended topics
refreshBtn.addEventListener("click", displayRecommendedTopics);
displayRecommendedTopics();

jQuery(document).ready(function () {
  jQuery(".faq-question").click(function () {
    jQuery(this).next(".faq-answer").toggle();
  });
});

const feedbackForm = document.getElementById("feedback-form");
const feedbackMessage = document.getElementById("feedback-message");

feedbackForm.addEventListener("submit", function (e) {
  e.preventDefault();

  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const feedbackType = document.getElementById("feedback-type").value;
  const feedbackText = document.getElementById("feedback").value.trim();
  const rating = document.getElementById("rating").value;

  if (name && email && feedbackType && feedbackText && rating) {
    // Simulate form submission
    feedbackMessage.textContent = "Thank you for your feedback, " + name + "!";
    feedbackMessage.style.color = "green";

    // Optionally send the feedback to a server via an API (uncomment to use)
    // submitFeedback(name, email, feedbackType, feedbackText, rating);

    // Reset the form
    feedbackForm.reset();
  } else {
    feedbackMessage.textContent = "Please fill in all fields!";
    feedbackMessage.style.color = "red";
  }
});

// Function to handle API submission (Optional)
function submitFeedback(name, email, feedbackType, feedbackText, rating) {
  const data = {
    name: name,
    email: email,
    feedbackType: feedbackType,
    feedback: feedbackText,
    rating: rating,
  };

  fetch("/submit-feedback", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then((response) => response.json())
    .then((data) => {
      feedbackMessage.textContent = "Thank you for your feedback!";
      feedbackMessage.style.color = "green";
      feedbackForm.reset();
    })
    .catch((error) => {
      feedbackMessage.textContent =
        "Error submitting feedback. Please try again later.";
      feedbackMessage.style.color = "red";
    });
}
