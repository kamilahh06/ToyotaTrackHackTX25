// import { useState, useRef, useEffect } from 'react';
// import { Button } from './ui/button';
// import { Input } from './ui/input';
// import { Card } from './ui/card';
// import { Send, Bot, User } from 'lucide-react';

// interface Message {
//   id: string;
//   text: string;
//   sender: 'user' | 'bot';
//   timestamp: Date;
// }

// export function ChatBot() {
//   const [messages, setMessages] = useState<Message[]>([
//     {
//       id: '1',
//       text: "Hi! I'm your Toyota virtual assistant. I can help answer questions about your financing options, vehicle features, or next steps. What would you like to know?",
//       sender: 'bot',
//       timestamp: new Date(),
//     },
//   ]);
//   const [inputValue, setInputValue] = useState('');
//   const messagesEndRef = useRef<HTMLDivElement>(null);

//   const scrollToBottom = () => {
//     messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
//   };

//   useEffect(() => {
//     scrollToBottom();
//   }, [messages]);

//   const generateBotResponse = (userMessage: string): string => {
//     const lowerMessage = userMessage.toLowerCase();

//     if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
//       return "Hello!";
//     } else {
//       return " 6 7 ";
//     }
//   };

//   const handleSend = () => {
//     if (!inputValue.trim()) return;

//     const userMessage: Message = {
//       id: Date.now().toString(),
//       text: inputValue,
//       sender: 'user',
//       timestamp: new Date(),
//     };

//     setMessages((prev) => [...prev, userMessage]);
//     setInputValue('');

//     // Simulate bot typing delay
//     setTimeout(() => {
//       const botResponse: Message = {
//         id: (Date.now() + 1).toString(),
//         text: generateBotResponse(inputValue),
//         sender: 'bot',
//         timestamp: new Date(),
//       };
//       setMessages((prev) => [...prev, botResponse]);
//     }, 1000);
//   };

//   const handleKeyPress = (e: React.KeyboardEvent) => {
//     if (e.key === 'Enter') {
//       handleSend();
//     }
//   };

//   return (
//     <Card className="bg-white rounded-lg shadow-lg p-6 h-[500px] flex flex-col">
//       <div className="flex items-center gap-3 mb-4 pb-4 border-b">
//         <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
//           <Bot className="w-6 h-6 text-red-600" />
//         </div>
//         <div>
//           <h3 className="text-red-600">Toyota Assistant</h3>
//           <p className="text-gray-600">Online now</p>
//         </div>
//       </div>

//       {/* Messages Container */}
//       <div className="flex-1 overflow-y-auto space-y-4 mb-4">
//         {messages.map((message) => (
//           <div
//             key={message.id}
//             className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
//           >
//             <div className={`flex gap-2 max-w-[80%] ${message.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
//               <div
//                 className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
//                   message.sender === 'user' ? 'bg-red-600' : 'bg-gray-200'
//                 }`}
//               >
//                 {message.sender === 'user' ? (
//                   <User className="w-5 h-5 text-white" />
//                 ) : (
//                   <Bot className="w-5 h-5 text-gray-600" />
//                 )}
//               </div>
//               <div
//                 className={`rounded-2xl px-4 py-3 ${
//                   message.sender === 'user'
//                     ? 'bg-red-600 text-white rounded-tr-none'
//                     : 'bg-gray-100 text-gray-800 rounded-tl-none'
//                 }`}
//               >
//                 <p>{message.text}</p>
//                 <p
//                   className={`mt-1 ${
//                     message.sender === 'user' ? 'text-red-100' : 'text-gray-500'
//                   }`}
//                 >
//                   {message.timestamp.toLocaleTimeString([], {
//                     hour: '2-digit',
//                     minute: '2-digit',
//                   })}
//                 </p>
//               </div>
//             </div>
//           </div>
//         ))}
//         <div ref={messagesEndRef} />
//       </div>

//       {/* Input Area */}
//       <div className="flex gap-2 pt-4 border-t">
//         <Input
//           value={inputValue}
//           onChange={(e) => setInputValue(e.target.value)}
//           onKeyPress={handleKeyPress}
//           placeholder="Type your message..."
//           className="flex-1"
//         />
//         <Button
//           onClick={handleSend}
//           className="bg-red-600 hover:bg-red-700 px-4"
//           disabled={!inputValue.trim()}
//         >
//           <Send className="w-5 h-5" />
//         </Button>
//       </div>
//     </Card>
//   );
// }

import { useState, useRef, useEffect } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card } from './ui/card';
import { Send, Bot, User } from 'lucide-react';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

interface ChatBotProps {
  backendUrl?: string; // e.g. http://localhost:8080
  userProfile?: any;   // whatever you pass from ResultsPage
}

export function ChatBot({ backendUrl = "http://localhost:8080", userProfile }: ChatBotProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      text: "Hi! I'm your Toyota assistant. Ask me about financing options, credit impact, or which trims fit your budget.",
      sender: 'bot',
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [sessionId, setSessionId] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // initialize/get a stable session id
  useEffect(() => {
    const existing = localStorage.getItem('chatSessionId');
    if (existing) {
      setSessionId(existing);
    } else {
      const sid = (globalThis.crypto?.randomUUID?.() || `s_${Date.now()}_${Math.random().toString(36).slice(2)}`);
      localStorage.setItem('chatSessionId', sid);
      setSessionId(sid);
    }
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  useEffect(() => { scrollToBottom(); }, [messages]);

  const sendToBackend = async (userText: string) => {
    const url = `${backendUrl}/api/chat`;
    const body = {
      message: userText,
      sessionId,
      userProfile, // include finance/vehicle context
    };

    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const detail = await res.text().catch(() => "");
      throw new Error(`HTTP ${res.status} ${res.statusText} ${detail}`);
    }
    return res.json();
  };

  const handleSend = async () => {
    const text = inputValue.trim();
    if (!text) return;

    const userMessage: Message = {
      id: `u_${Date.now()}`,
      text,
      sender: 'user',
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');

    try {
      setLoading(true);
      const data = await sendToBackend(text);
      const botText = data?.reply || "Sorry, I couldn't generate a response.";

      const botMessage: Message = {
        id: `b_${Date.now()}`,
        text: botText,
        sender: 'bot',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, botMessage]);
    } catch (err: any) {
      console.error("Chat error:", err);
      const botMessage: Message = {
        id: `b_err_${Date.now()}`,
        text: "Sorry—I'm having trouble reaching the server. Please try again.",
        sender: 'bot',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, botMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown: React.KeyboardEventHandler<HTMLInputElement> = (e) => {
    if (e.key === 'Enter' && !loading) handleSend();
  };

  return (
    <Card className="bg-white rounded-lg shadow-lg p-6 h-[500px] flex flex-col">
      <div className="flex items-center gap-3 mb-4 pb-4 border-b">
        <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
          <Bot className="w-6 h-6 text-red-600" />
        </div>
        <div>
          <h3 className="text-red-600">Toyota Assistant</h3>
          <p className="text-gray-600">{loading ? "Thinking…" : "Online now"}</p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-4 mb-4">
        {messages.map((message) => (
          <div key={message.id} className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`flex gap-2 max-w-[80%] ${message.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${message.sender === 'user' ? 'bg-red-600' : 'bg-gray-200'}`}>
                {message.sender === 'user' ? <User className="w-5 h-5 text-white" /> : <Bot className="w-5 h-5 text-gray-600" />}
              </div>
              <div className={`rounded-2xl px-4 py-3 ${message.sender === 'user' ? 'bg-red-600 text-white rounded-tr-none' : 'bg-gray-100 text-gray-800 rounded-tl-none'}`}>
                <p className="whitespace-pre-wrap">{message.text}</p>
                <p className={`mt-1 ${message.sender === 'user' ? 'text-red-100' : 'text-gray-500'}`}>
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="flex gap-2 pt-4 border-t">
        <Input
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask about financing, credit, trims, etc…"
          className="flex-1"
        />
        <Button onClick={handleSend} className="bg-red-600 hover:bg-red-700 px-4" disabled={!inputValue.trim() || loading}>
          <Send className="w-5 h-5" />
        </Button>
      </div>
    </Card>
  );
}