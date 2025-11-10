// Fitness-related icons for the background
const FITNESS_ICONS = [
    'fa-dumbbell', 'fa-heartbeat', 'fa-running', 'fa-bicycle', 'fa-swimmer',
    'fa-fire', 'fa-apple-alt', 'fa-hamburger', 'fa-weight', 'fa-walking',
    'fa-heart', 'fa-tint', 'fa-bolt', 'fa-moon', 'fa-sun', 'fa-cloud',
    'fa-leaf', 'fa-seedling', 'fa-spa', 'fa-burn', 'fa-fire-alt', 'fa-drumstick-bite'
];

// Fitness tips and motivational quotes
const FITNESS_TIPS = [
    "Stay hydrated! Drink at least 8 glasses of water daily.",
    "Aim for 7-9 hours of sleep for optimal recovery.",
    "Consistency is key - even short workouts add up!",
    "Don't forget to warm up before exercising.",
    "Mix cardio and strength training for best results."
];

document.addEventListener('DOMContentLoaded', function() {
    const chatMessages = document.getElementById('chat-messages');
    const userInput = document.getElementById('user-input');
    const sendButton = document.getElementById('send-button');
    const fitnessIcons = document.getElementById('fitnessIcons');
    let isTyping = false;

    // Create floating fitness icons
    function createFloatingIcons() {
        const iconCount = 15;
        for (let i = 0; i < iconCount; i++) {
            const icon = document.createElement('i');
            const randomIcon = FITNESS_ICONS[Math.floor(Math.random() * FITNESS_ICONS.length)];
            icon.className = `fas ${randomIcon} fitness-icon`;
            
            // Random position and animation delay
            icon.style.left = `${Math.random() * 100}%`;
            icon.style.animationDelay = `${Math.random() * 5}s`;
            icon.style.animationDuration = `${10 + Math.random() * 20}s`;
            
            fitnessIcons.appendChild(icon);
        }
    }

    // Show random fitness tip
    function showRandomTip() {
        const tip = FITNESS_TIPS[Math.floor(Math.random() * FITNESS_TIPS.length)];
        const tipElement = document.createElement('div');
        tipElement.className = 'fitness-tip';
        tipElement.textContent = `💡 ${tip}`;
        chatMessages.appendChild(tipElement);
        scrollToBottom();
    }

    // Auto-scroll to bottom of chat
    function scrollToBottom() {
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    // Format current time
    function getCurrentTime() {
        const now = new Date();
        return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }

    // Show typing indicator
    function showTypingIndicator() {
        if (isTyping) return;
        
        isTyping = true;
        const typingDiv = document.createElement('div');
        typingDiv.className = 'typing-indicator';
        typingDiv.id = 'typing-indicator';
        typingDiv.innerHTML = `
            <div class="typing-dot"></div>
            <div class="typing-dot"></div>
            <div class="typing-dot"></div>
        `;
        chatMessages.appendChild(typingDiv);
        scrollToBottom();
    }

    // Hide typing indicator
    function hideTypingIndicator() {
        isTyping = false;
        const typingIndicator = document.getElementById('typing-indicator');
        if (typingIndicator) {
            typingIndicator.remove();
        }
    }

    // Add quick reply buttons
    function addQuickReplies(replies) {
        const quickRepliesDiv = document.createElement('div');
        quickRepliesDiv.className = 'quick-replies';
        
        replies.forEach(reply => {
            const button = document.createElement('button');
            button.className = 'quick-reply';
            button.textContent = reply;
            button.onclick = () => {
                userInput.value = reply;
                sendMessage();
            };
            quickRepliesDiv.appendChild(button);
        });
        
        return quickRepliesDiv;
    }

    // Add message to chat
    function addMessage(message, isUser = false) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${isUser ? 'user-message' : 'bot-message'} new-message`;
        
        // Create message header with timestamp
        const time = getCurrentTime();
        const messageHeader = document.createElement('div');
        messageHeader.className = 'message-header';
        
        // Add avatar for bot messages
        if (!isUser) {
            const avatar = document.createElement('div');
            avatar.className = 'message-avatar';
            avatar.innerHTML = '<i class="fas fa-dumbbell"></i>';
            messageHeader.appendChild(avatar);
        }
        
        // Add timestamp
        const timeSpan = document.createElement('span');
        timeSpan.className = 'message-time';
        timeSpan.textContent = time;
        messageHeader.appendChild(timeSpan);
        
        // Create message content
        const messageContent = document.createElement('div');
        messageContent.className = 'message-content';
        
        // Process message with emoji replacements and formatting
        message = formatMessage(message);
        
        // Replace newlines with <br> and split into paragraphs
        const paragraphs = message.split('\n').filter(p => p.trim() !== '');
        let htmlContent = '';
        
        paragraphs.forEach(p => {
            // Check if the line starts with a number or bullet point
            if (/^\d+\.\s/.test(p) || /^-\s/.test(p)) {
                // It's a list item
                const listItems = p.split(/\n/).filter(item => item.trim() !== '');
                htmlContent += '<ul class="message-list">';
                listItems.forEach(item => {
                    // Remove the number or bullet and trim
                    const text = item.replace(/^\d+\.\s|^-\s/, '').trim();
                    htmlContent += `<li>${text}</li>`;
                });
                htmlContent += '</ul>';
            } else if (p.startsWith('## ')) {
                // Heading
                htmlContent += `<h4>${p.substring(3).trim()}</h4>`;
            } else if (p.trim() !== '') {
                // Regular paragraph
                htmlContent += `<p>${p}</p>`;
            }
        });
        
        messageContent.innerHTML = htmlContent;
        
        // Add quick replies for bot messages
        if (!isUser && message.length < 200) {
            const quickReplies = generateQuickReplies(message);
            if (quickReplies.length > 0) {
                messageContent.appendChild(addQuickReplies(quickReplies));
            }
        }
        
        // Assemble the message
        messageDiv.appendChild(messageHeader);
        messageDiv.appendChild(messageContent);
        
        // Add to chat
        chatMessages.appendChild(messageDiv);
        scrollToBottom();
        
        // Remove new-message class after animation
        setTimeout(() => {
            messageDiv.classList.remove('new-message');
        }, 200);
        
        return messageDiv;
    }
    
    // Format message with emoji replacements and other formatting
    function formatMessage(message) {
        // Add emoji replacements
        const emojiMap = {
            '\bworkout\b': '💪',
            '\bexercise\b': '🏋️',
            '\bdiet\b': '🥗',
            '\bnutrition\b': '🍎',
            '\bcardio\b': '🏃',
            '\bprotein\b': '🥩',
            '\bwater\b': '💧',
            '\bsleep\b': '😴',
            '\bgoal\b': '🎯',
            '\bsuccess\b': '✨',
            '\bgood job\b': '👏',
            '\bwell done\b': '👍',
            '\bperfect\b': '✅',
            '\bimportant\b': '❗',
            '\btip\b': '💡',
            '\bwarning\b': '⚠️',
            '\bquestion\b': '❓',
            '\bhelp\b': '❔',
            '\bidea\b': '💭',
            '\bstar\b': '⭐',
            '\bfire\b': '🔥',
            '\bheart\b': '❤️',
            '\bmuscle\b': '💪',
            '\brunning\b': '🏃',
            '\bcycling\b': '🚴',
            '\bswimming\b': '🏊'
        };
        
        // Apply emoji replacements
        for (const [key, emoji] of Object.entries(emojiMap)) {
            const regex = new RegExp(key, 'gi');
            message = message.replace(regex, `${emoji} `);
        }
        
        return message;
    }
    
    // Generate context-aware quick replies
    function generateQuickReplies(message) {
        const messageLower = message.toLowerCase();
        
        if (messageLower.includes('workout') || messageLower.includes('exercise')) {
            return [
                'Show me a beginner workout',
                'Best exercises for weight loss',
                'How to build muscle?'
            ];
        } else if (messageLower.includes('diet') || messageLower.includes('nutrition')) {
            return [
                'Healthy meal ideas',
                'Best protein sources',
                'Meal prep tips'
            ];
        } else if (messageLower.includes('weight') || messageLower.includes('lose')) {
            return [
                'Best cardio for weight loss',
                'How to lose belly fat?',
                'Weight loss meal plan'
            ];
        } else if (messageLower.includes('muscle') || messageLower.includes('strength')) {
            return [
                'Best exercises for muscle gain',
                'How much protein do I need?',
                'Rest days for muscle growth'
            ];
        }
        
        return [
            'Workout plans',
            'Diet and nutrition',
            'Weight loss tips',
            'Muscle building'
        ];
    }

    // Send message to server and get response
    async function sendMessage() {
        const message = userInput.value.trim();
        if (message === '' || sendButton.classList.contains('sending')) return;

        // Add user message to chat
        addMessage(message, true);
        userInput.value = '';
        
        // Show loading state
        sendButton.classList.add('sending');
        userInput.disabled = true;

        try {
            // Show typing indicator
            showTypingIndicator();
            
            // Simulate typing delay
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            const response = await fetch('/get_response', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ message: message })
            });

            const data = await response.json();
            
            // Hide typing indicator
            hideTypingIndicator();
            
            // Add bot response to chat
            setTimeout(() => {
                addMessage(data.response);
            }, 300);

        } catch (error) {
            console.error('Error:', error);
            hideTypingIndicator();
            addMessage("Sorry, I'm having trouble connecting to the server. Please try again later.");
        } finally {
            // Reset UI
            sendButton.classList.remove('sending');
            userInput.disabled = false;
            userInput.focus();
        }
    }

    // Event listeners
    sendButton.addEventListener('click', sendMessage);
    
    userInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });

    // Initialize the chat
    function initChat() {
        createFloatingIcons();
        
        // Initial greeting with a slight delay
        setTimeout(() => {
            showTypingIndicator();
            
            setTimeout(() => {
                hideTypingIndicator();
                addMessage("Hello! I'm your Fitness Assistant. 💪\n\nI can help you with:\n🏋️ Workout plans and exercises\n🥗 Diet and nutrition advice\n⚖️ Weight management\n💪 Muscle building\n🏃 Cardio training\n\nWhat would you like to work on today?");
                
                // Show a random tip after 5 seconds
                setTimeout(showRandomTip, 5000);
            }, 1500);
        }, 1000);
        
        // Show a new tip every 2 minutes
        setInterval(showRandomTip, 120000);
    }
    
    // Quick reply function
    window.sendQuickMessage = function(message) {
        userInput.value = message;
        sendMessage();
    };
    
    // Initialize the chat
    initChat();
});

// Handle Enter key press
function handleKeyPress(e) {
    if (e.key === 'Enter') {
        document.getElementById('send-button').click();
    }
}
