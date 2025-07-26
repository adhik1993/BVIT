// Self-executing async function to initialize Firebase
(async function() {
    try {
        console.log('Starting Firebase initialization...');
        
        // Check if Firebase is already initialized
        if (typeof firebase !== 'undefined' && firebase.apps.length) {
            console.log('Firebase already initialized');
            window.db = firebase.database();
            window.auth = firebase.auth();
            return;
        }

        console.log('Loading Firebase SDKs...');
        // Load Firebase SDKs
        await Promise.all([
            loadScript('https://www.gstatic.com/firebasejs/8.10.0/firebase-app.js'),
            loadScript('https://www.gstatic.com/firebasejs/8.10.0/firebase-database.js'),
            loadScript('https://www.gstatic.com/firebasejs/8.10.0/firebase-auth.js')
        ]);
        console.log('Firebase SDKs loaded');

        // Initialize Firebase if not already initialized
        if (!firebase.apps.length) {
            console.log('Initializing Firebase app...');
            firebase.initializeApp({
                apiKey: "AIzaSyDClVT8h1T6mBcfD4USQU3a6iINmyWTNmk",
                authDomain: "attendance-66f11.firebaseapp.com",
                databaseURL: "https://attendance-66f11-default-rtdb.firebaseio.com",
                projectId: "attendance-66f11",
                storageBucket: "attendance-66f11.appspot.com",
                messagingSenderId: "1041295884103",
                appId: "1:1041295884103:web:e7748b4c5a881e315b5662",
                measurementId: "G-7VNETMRH26"
            });
            console.log('Firebase app initialized');
        }

        // Get database and auth references
        window.db = firebase.database();
        window.auth = firebase.auth();
        
        // Test database connection
        console.log('Testing database connection...');
        const connectedRef = window.db.ref(".info/connected");
        connectedRef.on("value", (snap) => {
            if (snap.val() === true) {
                console.log("Database connected");
            } else {
                console.log("Database not connected");
            }
        });

        // Log initialization
        console.log('Firebase initialized successfully');
    } catch (error) {
        console.error('Error initializing Firebase:', error);
    }
})();

// Helper function to load scripts
function loadScript(src) {
    return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = src;
        script.onload = () => {
            console.log('Script loaded:', src);
            resolve();
        };
        script.onerror = (error) => {
            console.error('Script load error:', src, error);
            reject(error);
        };
        document.head.appendChild(script);
    });
}

// Telegram Configuration
const TELEGRAM_BOT_TOKEN = '8302014924:AAEw6J8psK6P8Ve2Iw9KaWbqVLmBVTMPXE8'; // New bot token

// Function to send Telegram message directly to phone number
async function sendTelegramMessage(message, phoneNumber) {
    // Remove +91 or any other prefix
    phoneNumber = phoneNumber.replace(/^\+91/, '');
    
    try {
        // Use Telegram's direct messaging API
        const telegramUrl = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
        
        // First try to get chat ID from phone number
        const response = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/getChat?chat_id=${phoneNumber}`);
        const data = await response.json();
        
        if (data.ok) {
            // If successful, send message using chat ID
            const chatId = data.result.id;
            const messageResponse = await fetch(telegramUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    chat_id: chatId,
                    text: message,
                    parse_mode: 'HTML'
                })
            });
            
            const messageData = await messageResponse.json();
            console.log('Message sent successfully:', messageData);
            return messageData;
        } else {
            // If chat not found, try sending to phone number directly
            const directResponse = await fetch(telegramUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    chat_id: phoneNumber,
                    text: message,
                    parse_mode: 'HTML'
                })
            });
            
            const directData = await directResponse.json();
            console.log('Message sent directly:', directData);
            return directData;
        }
    } catch (error) {
        console.error('Error sending message:', error);
        throw error;
    }
}

// Function to format attendance message
function formatAttendanceMessage(teacherName, className, subject, presentCount, totalCount, date) {
    const percentage = Math.round((presentCount/totalCount) * 100);
    let statusEmoji = percentage >= 75 ? '✅' : '⚠️';
    
    return `
<b>📊 Attendance Update</b>

👨‍🏫 Teacher: ${teacherName}
📚 Class: ${className}
📖 Subject: ${subject}
📅 Date: ${date}

✅ Present: ${presentCount}
👥 Total Students: ${totalCount}
📊 Percentage: ${percentage}%

${statusEmoji} Status: ${percentage >= 75 ? 'Good' : 'Below Required'}
`;
}

// Function to test Telegram connection
async function testTelegramConnection(chatId) {
    const testMessage = `
<b>🔔 Test Notification</b>

Your Telegram notifications are set up successfully!
You will receive attendance updates here.

Your Chat ID: ${chatId}
`;
    try {
        await sendTelegramMessage(testMessage, chatId);
        return true;
    } catch (error) {
        console.error('Telegram test failed:', error);
        return false;
    }
}

// Function to format teacher login message
function formatTeacherLoginMessage(teacherName, loginTime) {
    return `
<b>👨‍🏫 Teacher Login</b>

Name: ${teacherName}
Time: ${loginTime}
`;
}

// Function to format new teacher message
function formatNewTeacherMessage(teacherName, departments, classes) {
    return `
<b>🆕 New Teacher Added</b>

Name: ${teacherName}
Departments: ${departments.map(d => d.name).join(', ')}
Classes: ${classes.join(', ')}
`;
}

// Fast2SMS Configuration
const FAST2SMS_API_KEY = 'YOUR_FAST2SMS_API_KEY'; // Replace with your Fast2SMS API key

// Function to send SMS
async function sendSMS(message, phoneNumber) {
    const url = 'https://www.fast2sms.com/dev/bulkV2';
    
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'authorization': FAST2SMS_API_KEY,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                route: 'v3',
                sender_id: 'BVITMS',
                message: message,
                language: 'english',
                flash: 0,
                numbers: phoneNumber
            })
        });

        const data = await response.json();
        console.log('SMS sent:', data);
        return data;
    } catch (error) {
        console.error('Error sending SMS:', error);
        throw error;
    }
}

// Export functions
window.sendTelegramMessage = sendTelegramMessage;
window.formatAttendanceMessage = formatAttendanceMessage;
window.testTelegramConnection = testTelegramConnection;
window.formatTeacherLoginMessage = formatTeacherLoginMessage;
window.formatNewTeacherMessage = formatNewTeacherMessage; 
window.sendSMS = sendSMS; 