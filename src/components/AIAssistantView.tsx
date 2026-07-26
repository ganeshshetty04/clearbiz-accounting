import React, { useState, useRef, useEffect } from 'react';
import { 
  Bot, 
  Send, 
  Sparkles, 
  Plus, 
  CheckCircle, 
  HelpCircle, 
  User, 
  Loader2, 
  ShieldAlert,
  Lightbulb
} from 'lucide-react';
import { ChatMessage, ExpenseItem, CategoryType } from '../types';

interface AIAssistantViewProps {
  onAddSuggestedExpense: (expense: Omit<ExpenseItem, 'id' | 'createdAt' | 'updatedAt' | 'isSynced'>) => void;
  easyMode: boolean;
}

export const AIAssistantView: React.FC<AIAssistantViewProps> = ({
  onAddSuggestedExpense,
  easyMode,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg_init',
      sender: 'assistant',
      text: "Hello! I'm your AI Business Accounting Assistant. Tell me about any business purchase in natural language (e.g., 'Spent $65 at Staples for printer paper today') or ask any small business tax deduction questions!",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      taxTip: "Tip: Type or speak any transaction and I will auto-categorize it for IRS Schedule C reporting.",
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || inputText;
    if (!text.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: 'msg_' + Date.now(),
      sender: 'user',
      text: text.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputText('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/assistant/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text }),
      });
      const data = await res.json();

      if (data.success) {
        const botMsg: ChatMessage = {
          id: 'msg_bot_' + Date.now(),
          sender: 'assistant',
          text: data.reply || "I've processed your request.",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          suggestedExpense: data.suggestedExpense,
          taxTip: data.taxTip,
        };
        setMessages((prev) => [...prev, botMsg]);
      } else {
        const errorBotMsg: ChatMessage = {
          id: 'msg_err_' + Date.now(),
          sender: 'assistant',
          text: 'I could not parse that request. Please try rephrasing your expense details.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        setMessages((prev) => [...prev, errorBotMsg]);
      }
    } catch (e) {
      console.error(e);
      const errorBotMsg: ChatMessage = {
        id: 'msg_err_' + Date.now(),
        sender: 'assistant',
        text: 'Connection error while communicating with AI Assistant.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorBotMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddSuggested = (suggested: Partial<ExpenseItem>) => {
    onAddSuggestedExpense({
      merchant: suggested.merchant || 'Business Vendor',
      amount: suggested.amount || 0,
      currency: 'USD',
      category: (suggested.category as CategoryType) || 'Office Supplies & Equipment',
      date: suggested.date || new Date().toISOString().split('T')[0],
      paymentMethod: 'Credit Card',
      taxDeductible: suggested.taxDeductible ?? true,
      notes: suggested.notes || 'Auto-categorized by AI Assistant',
    });

    const confirmMsg: ChatMessage = {
      id: 'msg_conf_' + Date.now(),
      sender: 'assistant',
      text: `Added **${suggested.merchant || 'Expense'}** ($${suggested.amount}) under **${suggested.category}** to your expense records!`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setMessages((prev) => [...prev, confirmMsg]);
  };

  const presetPrompts = [
    'Paid $45.50 for client lunch at Starbucks yesterday',
    'Spent $180 on Adobe Creative Suite software annual subscription',
    'Is a home office desk and chair tax deductible?',
    'Categorize $65 Uber rideshare from airport to conference',
  ];

  return (
    <div className="space-y-4 pb-20 md:pb-6 max-w-4xl mx-auto">
      
      {/* Title */}
      <div className="flex items-center space-x-3">
        <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl border border-blue-200">
          <Bot className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-slate-900">AI Accounting Assistant</h2>
          <p className="text-xs text-slate-500">
            NLP powered by Gemini 3.6 Flash. Speak or type expenses to auto-categorize.
          </p>
        </div>
      </div>

      {/* Preset Suggestion Chips */}
      <div className="flex items-center space-x-2 overflow-x-auto no-scrollbar py-1">
        <span className="text-[11px] font-bold text-slate-400 uppercase shrink-0 flex items-center space-x-1">
          <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
          <span>Quick Ask:</span>
        </span>
        {presetPrompts.map((prompt, idx) => (
          <button
            key={idx}
            onClick={() => handleSendMessage(prompt)}
            className="px-3 py-1.5 bg-white hover:bg-blue-50 border border-slate-200 rounded-full text-xs text-slate-700 font-medium shrink-0 transition-colors"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Chat Messages Container */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-6 shadow-xs min-h-[420px] max-h-[550px] overflow-y-auto flex flex-col space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex space-x-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {msg.sender === 'assistant' && (
              <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 border border-blue-200 flex items-center justify-center shrink-0 font-bold text-xs mt-1">
                <Bot className="w-4 h-4" />
              </div>
            )}

            <div className={`max-w-md sm:max-w-lg rounded-2xl p-4 text-xs sm:text-sm ${
              msg.sender === 'user'
                ? 'bg-blue-600 text-white rounded-br-none'
                : 'bg-slate-100 text-slate-900 rounded-bl-none border border-slate-200/80'
            }`}>
              <div className="whitespace-pre-wrap">{msg.text}</div>

              {/* Tax Tip Callout */}
              {msg.taxTip && (
                <div className="mt-2.5 p-2.5 bg-amber-50 border border-amber-200 rounded-xl text-amber-900 text-xs flex items-start space-x-2">
                  <Sparkles className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                  <span>{msg.taxTip}</span>
                </div>
              )}

              {/* Suggested Expense Interactive Card */}
              {msg.suggestedExpense && (
                <div className="mt-3 p-3 bg-white border border-slate-200 rounded-xl shadow-xs text-slate-900">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2 mb-2">
                    <span className="text-[11px] font-bold text-blue-600 uppercase tracking-wider">
                      Parsed Expense Suggestion
                    </span>
                    <span className="text-xs font-extrabold text-slate-900">
                      ${msg.suggestedExpense.amount?.toFixed(2)}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs mb-3">
                    <div>
                      <span className="text-slate-400 block text-[10px]">Merchant</span>
                      <strong className="font-semibold">{msg.suggestedExpense.merchant}</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">Category</span>
                      <strong className="font-semibold">{msg.suggestedExpense.category}</strong>
                    </div>
                  </div>

                  <button
                    onClick={() => handleAddSuggested(msg.suggestedExpense!)}
                    className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold text-xs shadow-xs transition-colors flex items-center justify-center space-x-1.5"
                  >
                    <Plus className="w-4 h-4" />
                    <span>One-Tap Add to Expenses</span>
                  </button>
                </div>
              )}

              <div className="text-[10px] text-slate-400 mt-1 text-right">
                {msg.timestamp}
              </div>
            </div>

            {msg.sender === 'user' && (
              <div className="w-8 h-8 rounded-xl bg-slate-900 text-white flex items-center justify-center shrink-0 font-bold text-xs mt-1">
                <User className="w-4 h-4" />
              </div>
            )}
          </div>
        ))}

        {isLoading && (
          <div className="flex items-center space-x-2 text-slate-400 text-xs p-2">
            <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
            <span>AI is analyzing expense tax rules...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage();
        }}
        className="flex items-center space-x-2"
      >
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Describe an expense or ask a tax question (e.g. 'Spent $35 on printer paper at Office Depot')"
          className="flex-1 px-4 py-3 text-xs sm:text-sm bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none text-slate-900 shadow-xs"
        />
        <button
          type="submit"
          disabled={!inputText.trim() || isLoading}
          className="px-5 py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold rounded-xl shadow-xs transition-colors flex items-center space-x-1"
        >
          <Send className="w-4 h-4" />
          <span className="hidden sm:inline text-xs">Send</span>
        </button>
      </form>

    </div>
  );
};
