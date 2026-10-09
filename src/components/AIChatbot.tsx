import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { askStoreAssistant, ChatMessage } from '../lib/ai-assistant';
import {
  MessageSquare,
  X,
  Send,
  Sparkles,
  Bot,
  User as UserIcon,
  RotateCcw,
  Boxes
} from 'lucide-react';

interface AIChatbotProps {
  storeId: string;
  storeName: string;
}

const WELCOME_MESSAGE =
  "Hi! I'm your store assistant. Ask me things like:\n• Top 5 selling products this month\n• Which products are low on stock?\n• Revenue this week vs last week";

const SUGGESTIONS = [
  'Top 5 selling products this month',
  'Which products are low on stock?',
  'Revenue this week vs last week',
  'How many orders by status?',
  'Total products in catalog'
];

export const AIChatbot: React.FC<AIChatbotProps> = ({ storeId, storeName }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: WELCOME_MESSAGE
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen, isLoading]);

  const handleSend = async (textToSend?: string) => {
    const text = (textToSend || inputValue).trim();
    if (!text || isLoading) return;

    const userMsg: ChatMessage = {
      id: `user_${Date.now()}`,
      role: 'user',
      content: text
    };

    setMessages(prev => [...prev, userMsg]);
    if (!textToSend) setInputValue('');
    setIsLoading(true);

    try {
      const response = await askStoreAssistant(storeId, text);
      const assistantMsg: ChatMessage = {
        id: `asst_${Date.now()}`,
        role: 'assistant',
        content: response.text,
        toolUsed: response.toolUsed,
        data: response.rawData
      };
      setMessages(prev => [...prev, assistantMsg]);
    } catch {
      setMessages(prev => [
        ...prev,
        {
          id: `err_${Date.now()}`,
          role: 'assistant',
          content: "I don't have that data."
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setMessages([
      {
        id: 'welcome',
        role: 'assistant',
        content: WELCOME_MESSAGE
      }
    ]);
  };

  return (
    <>
      {/* FLOATING ACTION BUTTON (Positioned safely above mobile bottom nav) */}
      {!isOpen && (
        <motion.button
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsOpen(true)}
          className="fixed bottom-20 md:bottom-6 right-4 md:right-6 z-40 w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-indigo-600 text-white shadow-xl shadow-indigo-600/30 flex items-center justify-center cursor-pointer hover:bg-indigo-700 transition-colors"
          aria-label="Open Store AI Assistant"
        >
          <MessageSquare className="w-5 h-5 md:w-6 md:h-6" />
          <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-amber-400 rounded-full border-2 border-white" />
        </motion.button>
      )}

      {/* CHAT PANEL: Responsive Bottom Sheet on Mobile / Floating Card on Desktop */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-end justify-center sm:justify-end sm:p-6 bg-black/40 sm:bg-transparent backdrop-blur-xs sm:backdrop-blur-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 50 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="w-full sm:w-[410px] h-[82vh] sm:h-[560px] bg-white rounded-t-3xl sm:rounded-2xl shadow-2xl border border-slate-200/90 flex flex-col overflow-hidden"
            >
              {/* Mobile handle indicator */}
              <div className="w-12 h-1 bg-slate-300 rounded-full mx-auto mt-2 sm:hidden" />

              {/* Header */}
              <div className="p-3.5 sm:p-4 bg-slate-900 text-white flex items-center justify-between shrink-0">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-8 h-8 rounded-lg bg-indigo-500/30 border border-indigo-400/40 flex items-center justify-center text-amber-300 shrink-0">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-bold text-xs sm:text-sm tracking-tight text-white flex items-center gap-1.5">
                      <span>Store AI Assistant</span>
                      <span className="text-[10px] font-mono text-indigo-300 bg-indigo-950 px-1.5 py-0.2 rounded border border-indigo-800">
                        Live Data
                      </span>
                    </h3>
                    <p className="text-[10px] text-slate-400 truncate max-w-[180px]">
                      {storeName}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={handleReset}
                    className="p-2 text-slate-400 hover:text-white transition-colors cursor-pointer"
                    title="Reset conversation"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-2 text-slate-400 hover:text-white transition-colors cursor-pointer"
                    title="Close assistant"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Messages Body */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50/50 text-xs">
                {messages.map(msg => (
                  <div
                    key={msg.id}
                    className={`flex gap-2.5 ${
                      msg.role === 'user' ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    {msg.role === 'assistant' && (
                      <div className="w-6 h-6 rounded-md bg-indigo-100 text-indigo-700 flex items-center justify-center shrink-0 mt-0.5">
                        <Bot className="w-3.5 h-3.5" />
                      </div>
                    )}

                    <div
                      className={`max-w-[85%] rounded-2xl p-3 leading-relaxed whitespace-pre-wrap ${
                        msg.role === 'user'
                          ? 'bg-slate-900 text-white shadow-xs'
                          : 'bg-white text-slate-800 border border-slate-200/80 shadow-xs'
                      }`}
                    >
                      {msg.content}

                      {msg.toolUsed && (
                        <div className="mt-2 pt-2 border-t border-slate-100 flex items-center gap-1 text-[10px] text-indigo-600 font-mono">
                          <Boxes className="w-3 h-3" />
                          <span>Tool: {msg.toolUsed}</span>
                        </div>
                      )}
                    </div>

                    {msg.role === 'user' && (
                      <div className="w-6 h-6 rounded-md bg-slate-900 text-white flex items-center justify-center shrink-0 mt-0.5">
                        <UserIcon className="w-3.5 h-3.5" />
                      </div>
                    )}
                  </div>
                ))}

                {isLoading && (
                  <div className="flex gap-2.5 justify-start">
                    <div className="w-6 h-6 rounded-md bg-indigo-100 text-indigo-700 flex items-center justify-center shrink-0 mt-0.5">
                      <Bot className="w-3.5 h-3.5" />
                    </div>
                    <div className="bg-white rounded-2xl p-3 border border-slate-200/80 shadow-xs text-slate-500 italic flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-indigo-600 animate-ping" />
                      <span>Assistant is thinking...</span>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Suggested Question Chips (Scrollable touch row) */}
              <div className="px-3 py-2 bg-white border-t border-slate-100 flex gap-1.5 overflow-x-auto scrollbar-none shrink-0">
                {SUGGESTIONS.map((s, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSend(s)}
                    className="min-h-[32px] px-3 py-1 rounded-full bg-slate-100 hover:bg-slate-200 active:bg-slate-300 text-slate-700 text-[11px] font-semibold whitespace-nowrap transition-colors shrink-0 cursor-pointer"
                  >
                    {s}
                  </button>
                ))}
              </div>

              {/* Input Bar */}
              <div className="p-3 bg-white border-t border-slate-200 shrink-0">
                <form
                  onSubmit={e => {
                    e.preventDefault();
                    handleSend();
                  }}
                  className="flex items-center gap-2"
                >
                  <input
                    type="text"
                    value={inputValue}
                    onChange={e => setInputValue(e.target.value)}
                    placeholder="Ask stock, sales, metrics..."
                    disabled={isLoading}
                    className="flex-1 min-h-[44px] px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  <button
                    type="submit"
                    disabled={!inputValue.trim() || isLoading}
                    className="min-h-[44px] min-w-[44px] flex items-center justify-center bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 disabled:opacity-40 transition-colors cursor-pointer shrink-0"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
