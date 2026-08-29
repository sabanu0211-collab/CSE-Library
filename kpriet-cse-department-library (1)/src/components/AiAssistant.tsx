import React, { useState } from 'react';
import {
  Sparkles,
  Send,
  Bot,
  User,
  Loader2,
  Lightbulb,
  RotateCcw,
  BookOpen,
  MapPin,
  Award,
  Clock,
} from 'lucide-react';
import { Book } from '../types';
import { generateCurriculumLibrarianResponse } from '../services/curriculumEngine';

interface AiAssistantProps {
  books: Book[];
  onSelectBookByTitle?: (title: string) => void;
  isAdmin?: boolean;
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
}

const QUICK_STARTERS = [
  {
    icon: BookOpen,
    title: 'Semester Textbooks',
    query: 'Which textbooks are prescribed for Semester 3 & Semester 4?',
  },
  {
    icon: MapPin,
    title: 'Find Shelf Location',
    query: 'Where is Cormen Introduction to Algorithms located in the library?',
  },
  {
    icon: Award,
    title: 'GATE CSE Books',
    query: 'What are the top recommended reference books for GATE CSE preparation?',
  },
  {
    icon: Clock,
    title: 'Timings & Loan Rules',
    query: 'What are the library opening hours and book loan rules for students?',
  },
];

export const AiAssistant: React.FC<AiAssistantProps> = ({
  books,
  onSelectBookByTitle,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'ai',
      text: `### 🎓 Welcome to KPRIET CSE Library AI Advisor

I am trained on the **Department of Computer Science & Engineering** curriculum and the physical library collection in **Block II, Room CS-204**.

How can I assist you today?
• **Course Textbooks**: Ask about prescribed books for courses like *CS3351 Data Structures*, *CS3451 OS*, *CS3452 DBMS*, or *AL3452 AI*.
• **Shelf Locator**: Find exact shelf racks (*CSE-01 to CSE-08*) and live availability.
• **GATE CSE Preparation**: Get subject-wise reference author guides.
• **Library Policies**: Check borrowing limits, renewals, and timings.`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const [inputQuery, setInputQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = async (queryText: string) => {
    const textToSend = queryText || inputQuery;
    if (!textToSend.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: textToSend.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputQuery('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/gemini/assist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: textToSend.trim(),
          currentBooks: books,
        }),
      });

      let aiResponseText = '';
      if (response.ok) {
        const data = await response.json();
        aiResponseText = data.response;
      }

      if (!aiResponseText || aiResponseText.trim().length === 0) {
        aiResponseText = generateCurriculumLibrarianResponse(textToSend.trim(), books);
      }

      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: aiResponseText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch (error) {
      const fallbackText = generateCurriculumLibrarianResponse(textToSend.trim(), books);
      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: fallbackText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, aiMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const renderFormattedMessage = (content: string) => {
    return (
      <div className="space-y-2 text-xs leading-relaxed">
        {content.split('\n\n').map((block, idx) => {
          if (block.startsWith('### ')) {
            return (
              <h3 key={idx} className="text-sm font-bold text-amber-300 pt-0.5">
                {block.replace('### ', '')}
              </h3>
            );
          }
          if (block.startsWith('#### ')) {
            return (
              <h4 key={idx} className="text-xs font-bold text-slate-100 pt-0.5">
                {block.replace('#### ', '')}
              </h4>
            );
          }
          if (block.includes('\n• ') || block.startsWith('• ') || block.includes('\n- ') || block.startsWith('- ')) {
            const items = block.split(/\n[•\-]\s*|^[•\-]\s*/).filter(Boolean);
            return (
              <ul key={idx} className="space-y-1 pl-1">
                {items.map((item, itemIdx) => (
                  <li key={itemIdx} className="flex items-start gap-1.5 text-slate-200">
                    <span className="text-amber-400 mt-0.5">•</span>
                    <span>{parseInlineFormatting(item)}</span>
                  </li>
                ))}
              </ul>
            );
          }
          return <p key={idx} className="text-slate-200">{parseInlineFormatting(block)}</p>;
        })}
      </div>
    );
  };

  const parseInlineFormatting = (text: string) => {
    const parts = text.split(/(\*\*.*?\*\*|\`.*?\`)/g);
    return parts.map((part, index) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return (
          <strong key={index} className="text-amber-300 font-semibold">
            {part.slice(2, -2)}
          </strong>
        );
      }
      if (part.startsWith('`') && part.endsWith('`')) {
        return (
          <span key={index} className="font-mono bg-slate-900 text-amber-400 px-1 py-0.5 rounded text-[11px] border border-slate-800">
            {part.slice(1, -1)}
          </span>
        );
      }
      return part;
    });
  };

  return (
    <div className="bg-slate-900 rounded-2xl border border-slate-800 shadow-xl overflow-hidden flex flex-col h-[650px] max-w-4xl mx-auto">
      {/* Clean Chat Header */}
      <div className="px-5 py-3.5 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500 to-amber-600 flex items-center justify-center text-slate-950 font-bold shadow-md">
            <Sparkles className="w-4 h-4 text-slate-950" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-sm text-slate-100">
                KPRIET CSE AI Librarian
              </h3>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-emerald-950 text-emerald-300 border border-emerald-800">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                Online
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Department of Computer Science and Engineering • Block II CS-204
            </p>
          </div>
        </div>

        <button
          onClick={() =>
            setMessages([
              {
                id: `welcome-${Date.now()}`,
                sender: 'ai',
                text: `### 📚 How can I help you today?\nAsk about prescribed textbooks (e.g. **CS3351 Data Structures**, **CS3451 OS**, **CS3452 DBMS**), locate rack numbers, or check **GATE CSE** books!`,
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              },
            ])
          }
          className="text-xs text-slate-400 hover:text-slate-200 px-2.5 py-1 rounded-lg bg-slate-800/80 hover:bg-slate-800 transition-colors flex items-center gap-1.5"
          title="Start a new conversation"
        >
          <RotateCcw className="w-3 h-3" />
          <span>Clear</span>
        </button>
      </div>

      {/* Messages Thread */}
      <div className="flex-1 p-5 overflow-y-auto space-y-4 text-xs">
        {messages.map((msg) => {
          const isAi = msg.sender === 'ai';
          return (
            <div
              key={msg.id}
              className={`flex gap-3 max-w-[85%] ${isAi ? 'self-start' : 'ml-auto flex-row-reverse'}`}
            >
              <div
                className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 text-xs ${
                  isAi
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                    : 'bg-amber-500 text-slate-950 font-bold'
                }`}
              >
                {isAi ? <Bot className="w-3.5 h-3.5" /> : <User className="w-3.5 h-3.5" />}
              </div>

              <div
                className={`p-3.5 rounded-2xl shadow-xs leading-relaxed ${
                  isAi
                    ? 'bg-slate-950 border border-slate-800 text-slate-200 rounded-tl-none'
                    : 'bg-amber-500 text-slate-950 font-medium rounded-tr-none'
                }`}
              >
                {isAi ? renderFormattedMessage(msg.text) : <div className="whitespace-pre-wrap">{msg.text}</div>}
                <div
                  className={`text-[9px] text-right pt-1.5 ${
                    isAi ? 'text-slate-500' : 'text-slate-900/70 font-semibold'
                  }`}
                >
                  {msg.timestamp}
                </div>
              </div>
            </div>
          );
        })}

        {/* Quick starter cards on first message */}
        {messages.length === 1 && (
          <div className="pt-2">
            <div className="text-[11px] text-slate-400 mb-2 font-medium flex items-center gap-1.5">
              <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
              <span>Suggested quick questions:</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {QUICK_STARTERS.map((item, idx) => {
                const Icon = item.icon;
                return (
                  <button
                    key={idx}
                    onClick={() => handleSendMessage(item.query)}
                    className="p-2.5 rounded-xl bg-slate-950/70 hover:bg-slate-800 border border-slate-800/80 hover:border-slate-700 text-left transition-all text-xs group"
                  >
                    <div className="flex items-center gap-2 font-medium text-slate-200 group-hover:text-amber-300">
                      <Icon className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
                      <span>{item.title}</span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1 line-clamp-1">
                      {item.query}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {isLoading && (
          <div className="flex gap-3 max-w-[85%] self-start">
            <div className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center justify-center flex-shrink-0">
              <Bot className="w-3.5 h-3.5 animate-spin" />
            </div>
            <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 text-slate-300 rounded-tl-none flex items-center gap-2">
              <Loader2 className="w-3.5 h-3.5 animate-spin text-amber-400" />
              <span>Checking syllabus and live shelf availability...</span>
            </div>
          </div>
        )}
      </div>

      {/* Input Box */}
      <div className="p-3.5 bg-slate-950 border-t border-slate-800">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage(inputQuery);
          }}
          className="flex items-center gap-2"
        >
          <input
            id="ai-query-input"
            type="text"
            placeholder="Ask about textbooks, shelf rack location, GATE prep, or loan rules..."
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            disabled={isLoading}
            className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-slate-100 placeholder-slate-500 text-xs focus:outline-none focus:border-amber-500 transition-colors"
          />
          <button
            id="btn-send-ai-query"
            type="submit"
            disabled={!inputQuery.trim() || isLoading}
            className="p-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-40 text-slate-950 font-bold transition-all shadow-xs active:scale-95 flex-shrink-0 flex items-center gap-1.5 text-xs"
          >
            <Send className="w-4 h-4" />
            <span className="hidden sm:inline">Ask</span>
          </button>
        </form>
      </div>
    </div>
  );
};
