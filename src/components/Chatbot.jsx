import React, { useState } from 'react';

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [question, setQuestion] = useState('');
  const [conversation, setConversation] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false); // Track if response is being generated
  const [sessionId, setSessionId] = useState(null); // To store session ID

  const handleSubmit = async () => {
    if (question.trim() === '') return;

    const currentQuestion = question;
    setQuestion('');

    setConversation((prev) => [...prev, { type: 'user', text: currentQuestion }]);
    setIsGenerating(true); // Start generating message

    try {
      const response = await fetch('http://localhost:5000/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          question: currentQuestion,
          session_id: sessionId, // Pass session ID with the request
        }),
      });

      const data = await response.json();
      const assistantAnswer = data.answer;

      setConversation((prev) => [
        ...prev,
        { type: 'assistant', text: assistantAnswer },
      ]);

      // Save the session ID for future interactions
      if (!sessionId) {
        setSessionId(data.session_id);
      }
    } catch (error) {
      console.error("Error:", error);
      setConversation((prev) => [
        ...prev,
        { type: 'assistant', text: 'Sorry, something went wrong. Please try again.' },
      ]);
    } finally {
      setIsGenerating(false); // Stop generating message
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const GeneratingMessage = () => {
    const [dots, setDots] = useState('');
    
    React.useEffect(() => {
      const interval = setInterval(() => {
        setDots((prev) => (prev.length < 3 ? prev + '.' : ''));
      }, 500); // Add dots every 500ms
      return () => clearInterval(interval);
    }, []);

    return <p className="italic text-gray-500">Generating{dots}</p>;
  };

  const formatTextWithLineBreaks = (text) => {
    return text.split('\n').map((item, index) => (
      <p key={index} className="my-1">{item}</p>
    ));
  };

  return (
    <div className="fixed bottom-4 right-4">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-blue-500 text-white p-3 rounded-full shadow-lg hover:bg-blue-600"
      >
        Ask AI Assistant
      </button>
      {isOpen && (
        <div className="bg-white border border-gray-300 shadow-xl rounded-lg p-4 w-[600px] h-[700px] fixed bottom-20 right-4 flex flex-col">
          <h2 className="text-xl font-bold mb-2">AI Assistant</h2>

          <div className="flex-1 overflow-y-auto mb-4 pr-2">
            {conversation.map((item, index) => (
              <div key={index} className={item.type === 'user' ? 'text-right' : 'text-left'}>
                <p
                  className={`${
                    item.type === 'user' ? 'bg-blue-100' : 'bg-gray-200'
                  } p-2 rounded-lg my-1 max-w-xs inline-block break-words w-fit`}
                >
                  {item.type === 'assistant' ? formatTextWithLineBreaks(item.text) : item.text}
                </p>
              </div>
            ))}

            {/* Show Generating message */}
            {isGenerating && (
              <div className="text-left">
                <p className="bg-gray-200 p-2 rounded-lg my-1 max-w-xs inline-block">
                  <GeneratingMessage />
                </p>
              </div>
            )}
          </div>

          <div className="flex flex-col">
            <textarea
              rows="4"
              placeholder="Type your question here..."
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              onKeyDown={handleKeyPress}
              className="w-full border border-gray-300 rounded-lg p-2 mb-2 resize-none"
            ></textarea>

            <button
              onClick={handleSubmit}
              className="bg-blue-500 text-white w-full py-2 rounded-lg hover:bg-blue-600 flex justify-center items-center space-x-2"
              disabled={isGenerating} // Disable button while generating
            >
              <span className="material-icons">send</span>
              <span>Send</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chatbot;
