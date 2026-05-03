import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  MessageSquare, 
  X, 
  Send, 
  Sparkles, 
  User, 
  Bot, 
  Loader2,
  Minimize2,
  Maximize2,
  Lightbulb,
  Copy,
  Check,
  RotateCcw
} from 'lucide-react';
import { GoogleGenerativeAI } from "@google/generative-ai";
import Markdown from 'react-markdown';

// Initialize Gemini AI with new API key
const genAI = new GoogleGenerativeAI("AIzaSyDrYbFe7Bch_lPis7jn0MNU-h1tRmN39gQ");

// Mock AI responses for fallback when quota is exceeded
const getAIResponse = (userMessage: string): string => {
  const lowerMessage = userMessage.toLowerCase();
  
  if (lowerMessage.includes('binary search') || lowerMessage.includes('binary tree')) {
    return `**Binary Search** is a fundamental algorithm that efficiently searches sorted data.

## How it works:
1. Start with the middle element of the array
2. If the target value matches, return the index
3. If target < middle, search the left half
4. If target > middle, search the right half
5. Repeat until found or array is exhausted

## Time Complexity:
- **Best Case:** O(1) - middle element is the target
- **Worst Case:** O(log n) - keep dividing the array
- **Space Complexity:** O(1) - constant extra space

## Code Example (JavaScript):
\`\`\`javascript
function binarySearch(arr, target) {
  let left = 0;
  let right = arr.length - 1;
  
  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    
    if (arr[mid] === target) {
      return mid; // Found!
    } else if (arr[mid] < target) {
      left = mid + 1; // Search right half
    } else {
      right = mid - 1; // Search left half
    }
  }
  
  return -1; // Not found
}
\`\`\`

**Key Insight:** Binary search only works on **sorted** arrays and is much faster than linear search for large datasets!`;
  }
  
  if (lowerMessage.includes('linked list')) {
    return `**Linked Lists** are linear data structures where elements are stored in nodes with pointers.

## Types:
- **Singly Linked List:** Each node points to the next
- **Doubly Linked List:** Each node points to both next and previous
- **Circular Linked List:** Last node points back to the first

## Node Structure:
\`\`\`javascript
class Node {
  constructor(data) {
    this.data = data;    // The value
    this.next = null;    // Pointer to next node
  }
}
\`\`\`

## Advantages:
- Dynamic size (can grow/shrink easily)
- Efficient insertion/deletion (O(1) at known position)
- Memory efficient (no wasted space)

## Disadvantages:
- No random access (must traverse to find elements)
- Extra memory for pointers
- More complex implementation than arrays

**Common Operations:**
- **Insert at beginning:** O(1)
- **Delete at beginning:** O(1)
- **Search:** O(n)
- **Insert at end:** O(n) (without tail pointer)`;
  }
  
  if (lowerMessage.includes('sorting') || lowerMessage.includes('sort')) {
    return `**Sorting Algorithms** arrange data in a specific order (usually ascending).

## Common Sorting Algorithms:

### 1. **Bubble Sort** - O(n²)
- Compare adjacent elements and swap if out of order
- Simple but inefficient for large datasets

### 2. **Selection Sort** - O(n²)
- Find minimum element and place at beginning
- Repeat for remaining unsorted portion

### 3. **Insertion Sort** - O(n²)
- Build sorted array one element at a time
- Efficient for small or nearly sorted datasets

### 4. **Quick Sort** - O(n log n) average
- Pick a pivot and partition array around it
- Recursively sort subarrays
- Fast in practice but O(n²) worst case

### 5. **Merge Sort** - O(n log n)
- Divide array into halves, sort, then merge
- Stable and predictable O(n log n) performance

## When to use which:
- **Small datasets:** Insertion Sort
- **General purpose:** Quick Sort
- **Stable sorting needed:** Merge Sort
- **Memory constrained:** Heap Sort

**Key Insight:** No single sorting algorithm is best for all situations!`;
  }
  
  // Default response
  return `Great question about **Data Structures and Algorithms**! 

I'm here to help you understand complex concepts. Here are some topics I can explain in detail:

## 🚀 Popular Topics:
- **Binary Search** and **Binary Trees**
- **Linked Lists** (Singly, Doubly, Circular)
- **Sorting Algorithms** (Bubble, Quick, Merge, etc.)
- **Stack and Queue** implementations
- **Hash Tables** and collision resolution
- **Graph Algorithms** (BFS, DFS, Dijkstra)
- **Dynamic Programming** patterns
- **Recursion** and problem-solving strategies

## 💡 How I can help:
- Explain concepts with simple analogies
- Provide code examples in JavaScript/Java
- Show step-by-step algorithms
- Compare time and space complexity
- Help with debugging and optimization

**Try asking me about:** "What is a binary search tree?" or "How does quick sort work?"

I'm excited to help you master DSA! 🎯`;
};

const BOT_ICON_URL = "https://api.dicebear.com/7.x/bottts-neutral/svg?seed=AlgoVision&backgroundColor=636b2f"; // Brand-aligned bot icon

interface Message {
  role: 'user' | 'bot';
  content: string;
  timestamp: Date;
}

export default function AITutor() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true); // Default to expanded for better viewpoint
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'bot',
      content: "Hi! I'm your **AlgoVision AI Tutor**. I can help you understand complex algorithms, explain data structures with analogies, and even help you debug your code. \n\nWhat would you like to learn today?",
      timestamp: new Date()
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<number | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (text?: string) => {
    const messageText = text || input;
    if (!messageText.trim() || isLoading) return;

    const userMessage: Message = {
      role: 'user',
      content: messageText,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // Try to use real Gemini API first
      const model = genAI.getGenerativeModel({ model: "gemini-pro" });
      
      const prompt = `You are a friendly and expert DSA tutor for the AlgoVision platform. 
      Your goal is to help students master Data Structures and Algorithms.
      
      Guidelines:
      - Explain concepts clearly using simple analogies.
      - Provide code snippets in JavaScript or Java when relevant.
      - Use Markdown for structure (bolding, lists, code blocks).
      - Be encouraging and patient.
      - Keep responses concise but comprehensive.
      
      User Question: ${messageText}`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const aiResponse = response.text();

      const botMessage: Message = {
        role: 'bot',
        content: aiResponse || "I'm sorry, I couldn't process that. Could you try rephrasing?",
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error("Gemini API Error:", error);
      
      // Fallback to mock responses if API fails (quota exceeded, etc.)
      const aiResponse = getAIResponse(messageText);

      const botMessage: Message = {
        role: 'bot',
        content: aiResponse,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = (text: string, id: number) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const clearChat = () => {
    setMessages([
      {
        role: 'bot',
        content: "Chat cleared! How else can I help you with Data Structures and Algorithms?",
        timestamp: new Date()
      }
    ]);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ 
              opacity: 1, 
              scale: 1, 
              y: 0,
              height: isMinimized ? '80px' : isExpanded ? '85vh' : 'min(650px, 80vh)',
              width: isExpanded ? 'min(1200px, 95vw)' : 'min(450px, 90vw)'
            }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-slate-200/50 dark:border-slate-800/50 overflow-hidden flex flex-col mb-4"
          >
            {/* Header */}
            <div className="px-6 py-4 flex items-center justify-between shrink-0 border-b border-slate-100 dark:border-slate-800/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl overflow-hidden flex items-center justify-center">
                  <img 
                    src={BOT_ICON_URL} 
                    alt="AlgoVision AI" 
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white text-sm">AlgoVision AI</h3>
                  <div className="flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                    <span className="text-[10px] font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Online</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button 
                  onClick={clearChat}
                  className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                  title="Clear"
                >
                  <RotateCcw size={16} />
                </button>
                <button 
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                  title={isExpanded ? "Collapse" : "Expand"}
                >
                  {isExpanded ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
                </button>
                <button 
                  onClick={() => setIsMinimized(!isMinimized)}
                  className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                  title={isMinimized ? "Expand" : "Minimize"}
                >
                  {isMinimized ? <Maximize2 size={16} /> : <Minimize2 size={16} />}
                </button>
                <button 
                  onClick={() => setIsOpen(false)}
                  className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors text-slate-400 hover:text-red-500"
                  title="Close"
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            {!isMinimized && (
              <>
                {/* Chat Area */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-hide">
                  {messages.map((msg, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      {msg.role === 'bot' && (
                        <div className="w-8 h-8 rounded-lg overflow-hidden shrink-0 mt-1">
                          <img 
                            src={BOT_ICON_URL} 
                            alt="Bot" 
                            className="w-full h-full object-cover"
                            referrerPolicy="no-referrer"
                          />
                        </div>
                      )}
                      <div className={`max-w-[85%] ${msg.role === 'user' ? 'order-1' : 'order-2'}`}>
                        <div className={`p-4 rounded-2xl text-sm leading-relaxed ${
                          msg.role === 'user' 
                            ? 'bg-brand-primary text-white rounded-tr-none' 
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-tl-none'
                        }`}>
                          <div className="prose prose-sm dark:prose-invert max-w-none">
                            <Markdown>{msg.content}</Markdown>
                          </div>
                        </div>
                        <span className="text-[10px] mt-1.5 block text-slate-400 font-medium px-1">
                          {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </motion.div>
                  ))}
                  {isLoading && (
                    <div className="flex justify-start">
                      <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded-2xl rounded-tl-none">
                        <div className="flex gap-1.5">
                          <div className="w-1.5 h-1.5 bg-brand-accent rounded-full animate-bounce [animation-delay:-0.3s]" />
                          <div className="w-1.5 h-1.5 bg-brand-accent rounded-full animate-bounce [animation-delay:-0.15s]" />
                          <div className="w-1.5 h-1.5 bg-brand-accent rounded-full animate-bounce" />
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <div className="p-4 bg-white/50 dark:bg-slate-900/50 border-t border-slate-100 dark:border-slate-800">
                  <form 
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleSend();
                    }}
                    className="relative flex items-center gap-2"
                  >
                    <input
                      type="text"
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      placeholder="Ask a question..."
                      className="flex-1 px-4 py-3 bg-slate-100 dark:bg-slate-800 border-none rounded-xl text-sm focus:ring-2 focus:ring-brand-primary/20 outline-none dark:text-white placeholder:text-slate-500"
                    />
                    <button
                      type="submit"
                      disabled={!input.trim() || isLoading}
                      className="p-3 bg-brand-primary hover:bg-brand-dark disabled:bg-slate-200 dark:disabled:bg-slate-700 text-white rounded-xl transition-all active:scale-95 shrink-0"
                    >
                      {isLoading ? <Loader2 className="animate-spin" size={18} /> : <Send size={18} />}
                    </button>
                  </form>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.05, y: -5 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(true)}
        className={`w-20 h-20 bg-white dark:bg-slate-900 rounded-full shadow-[0_20px_50px_rgba(0,0,0,0.2)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.4)] transition-all flex items-center justify-center group ring-1 ring-slate-100 dark:ring-slate-800 overflow-hidden ${isOpen ? 'hidden' : 'flex'}`}
      >
        <div className="relative w-full h-full">
          <img 
            src={BOT_ICON_URL} 
            alt="Open AI Tutor" 
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            referrerPolicy="no-referrer"
          />
          <div className="absolute top-2 right-2 w-3.5 h-3.5 bg-green-500 border-2 border-white dark:border-slate-900 rounded-full shadow-sm" />
        </div>
      </motion.button>
    </div>
  );
}
