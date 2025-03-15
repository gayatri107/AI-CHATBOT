import { useState } from 'react';
import axios from 'axios';

function App() {
    const [question, setQuestion] = useState('');
    const [messages, setMessages] = useState([]);
    const [errorMessage, setErrorMessage] = useState('');

    async function generateAnswer() {
        if (!question.trim()) return;

        const educationalKeywords = [ 
            'explain', 'define', 'how to', 'history', 'science', 'mathematics', 'what is', 'compare',
            'computer science', 'programming', 'coding', 'algorithm', 'data structure', 'software',
            'hardware', 'network', 'database', 'artificial intelligence', 'machine learning',
            'web development', 'cybersecurity', 'technology', 'innovation', 'digital', 'code',
            'logic', 'systems', 'operating systems', 'cloud computing', 'api', 'framework'
        ];

        const isEducational = educationalKeywords.some((keyword) =>
            question.toLowerCase().includes(keyword)
        );

        if (!isEducational) {
            setErrorMessage('This chatbot is limited to educational questions, especially in the fields of computer science and technology.');
            return;
        }

        setErrorMessage('');

        const userMessage = { text: question, sender: 'user' };
        setMessages([...messages, userMessage]);
        setQuestion('');

        try {
            const response = await axios({
                url: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=AIzaSyDGDh0fsnhQ3Or7gOtRD1RzSr66y0m764s',
                method: 'post',
                data: {
                    contents: [{ parts: [{ text: question }] }],
                },
            });

            let generatedText = 'No response found.';
            if (response.data.candidates && response.data.candidates.length > 0) {
                generatedText = response.data.candidates[0].content.parts[0].text;
            }

            const formattedText = generatedText.replace(/\n/g, '\n\n');
            const botMessage = { text: formattedText, sender: 'bot' };
            setMessages([...messages, userMessage, botMessage]);
        } catch (error) {
            console.error('API error:', error);
            const errorMessage = { text: 'An error occurred. Please try again.', sender: 'bot' };
            setMessages([...messages, userMessage, errorMessage]);
        }
    }

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-3xl flex flex-col h-[600px]">
                <h1 className="text-3xl font-bold text-center text-gray-900 mb-4">AI Chatbot</h1>

                {/* Chat Window */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 rounded-lg shadow-inner">
                    {messages.map((msg, index) => (
                        <div
                            key={index}
                            className={`p-4 rounded-lg max-w-md whitespace-pre-line ${msg.sender === 'user' ? 'bg-blue-500 text-white self-end' : 'bg-gray-300 text-gray-900 self-start'}`}
                        >
                            {msg.text}
                        </div>
                    ))}
                </div>

                {/* Input Field & Button */}
                <div className="mt-4 flex">
                    <textarea
                        value={question}
                        onChange={(e) => setQuestion(e.target.value)}
                        placeholder="Ask me anything..."
                        className="flex-1 p-4 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400 resize-none text-lg"
                        rows="3"
                    ></textarea>
                    <button
                        onClick={generateAnswer}
                        className="ml-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold px-6 py-3 rounded-lg text-lg"
                    >
                        Send
                    </button>
                </div>
                {errorMessage && <p className="text-red-500">{errorMessage}</p>}
            </div>
        </div>
    );
}

export default App;