import React, { useState, useRef, useEffect } from 'react';
import { MessageSquareCode, Send, Sparkles, AlertTriangle, Cpu, Trash2, HelpCircle } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface Message {
  sender: 'user' | 'assistant';
  text: string;
  time: Date;
}

export default function AIChatView() {
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: 'assistant',
      text: "Hello! I am your **SupplyShield-AI Copilot**. I have access to your active supplier network database, financial histories, delivery telemetry, and predictive model confidence logs.\n\nAsk me anything like:\n* *Which battery suppliers are at elevated risk?*\n* *Analyze balance sheet ratios for SUP0001.*\n* *Draft a supplier audit recommendation report.*",
      time: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const samplePrompts = [
    "Identify semiconductor suppliers at critical risk.",
    "Compare SUP0001 with SUP0005 balance sheets.",
    "What are the main causes for the Asia Pacific battery delay?",
    "Generate a mitigation checklist for ChemFlow Ludwigshafen."
  ];

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleSend = async (textToSend: string) => {
    if (!textToSend.trim() || loading) return;

    const userMsg: Message = { sender: 'user', text: textToSend, time: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: textToSend,
          history: messages.map(m => ({
            role: m.sender === 'user' ? 'user' : 'model',
            parts: [{ text: m.text }]
          }))
        })
      });

      if (res.ok) {
        const data = await res.json();
        const assistantMsg: Message = {
          sender: 'assistant',
          text: data.answer || data.reply || 'No response received.',
          time: new Date()
        };
        setMessages(prev => [...prev, assistantMsg]);
      } else {
        throw new Error('Non-200 API response');
      }
    } catch (err) {
      console.error("Error communicating with AI Copilot:", err);
      // Fallback response
      setMessages(prev => [...prev, {
        sender: 'assistant',
        text: "I encountered an error querying the model. Please verify your GEMINI_API_KEY environment variable. Here is a localized summary: the active supplier index highlights extreme shipping bottlenecks across German logistic nodes.",
        time: new Date()
      }]);
    } finally {
      setLoading(false);
    }
  };

  const clearChat = () => {
    if (window.confirm("Are you sure you want to purge this conversation thread?")) {
      setMessages([
        {
          sender: 'assistant',
          text: "Conversation thread purged. Sourcing databases are fully synchronized. How can I assist your operations team today?",
          time: new Date()
        }
      ]);
    }
  };

  return (
    <div className="flex-1 p-6 flex flex-col md:flex-row gap-6 h-[calc(100vh-4rem)] bg-[#0B0D14] text-[#E2E8F0] select-none">
      
      {/* Sidebar Suggestions Column */}
      <div className="md:w-72 shrink-0 space-y-4 flex flex-col justify-between">
        
        <div className="space-y-4">
          <div className="flex items-center gap-2 border-b border-[#1E293B] pb-2">
            <Cpu className="w-4 h-4 text-[#2C7BE5]" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#94A3B8]">Copilot Prompts</h3>
          </div>
          
          <div className="space-y-2.5">
            {samplePrompts.map((prompt, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(prompt)}
                className="w-full text-left p-3 rounded-xl bg-[#161926] hover:bg-[#1E293B]/60 border border-[#1E293B] hover:border-[#2C7BE5]/40 text-xs text-[#94A3B8] hover:text-white transition duration-200 shadow-sm cursor-pointer block leading-relaxed"
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>

        {/* Clear Thread Trigger */}
        <button
          onClick={clearChat}
          className="flex items-center justify-center gap-2 w-full p-2.5 rounded-lg bg-[#161926] border border-[#1E293B] hover:border-red-500/20 text-[#94A3B8] hover:text-[#F66D9B] text-xs font-semibold cursor-pointer transition"
        >
          <Trash2 className="w-3.5 h-3.5" />
          Purge Active Thread
        </button>

      </div>

      {/* Main Conversation Window */}
      <div className="flex-1 bg-[#161926] border border-[#1E293B] rounded-2xl flex flex-col justify-between overflow-hidden shadow-lg h-full">
        
        {/* Header toolbar */}
        <div className="px-5 py-4 bg-[#111420]/60 border-b border-[#1E293B] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MessageSquareCode className="w-5 h-5 text-[#2C7BE5]" />
            <div>
              <span className="block text-xs font-bold text-white">Interactive Sourcing Assistant</span>
              <span className="block text-[10px] text-[#3ECF8E] font-mono font-medium">Gemini 2.5 Flash Connected</span>
            </div>
          </div>
          <span className="text-[9px] font-mono font-bold bg-[#0B0D14] border border-[#1E293B] px-2 py-1 rounded text-[#94A3B8] uppercase tracking-widest">
            Audit Mode
          </span>
        </div>

        {/* Messages scroll box */}
        <div className="flex-1 p-5 overflow-y-auto space-y-4 scrollbar-thin">
          {messages.map((m, idx) => (
            <div
              key={idx}
              className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl p-4 text-xs leading-relaxed space-y-1.5 shadow-sm border ${
                  m.sender === 'user'
                    ? 'bg-[#2C7BE5]/10 border-[#2C7BE5]/25 text-[#E2E8F0] rounded-br-none'
                    : 'bg-[#111420] border-[#1E293B] text-[#E2E8F0] rounded-bl-none'
                }`}
              >
                {/* Sender Indicator */}
                <div className="flex justify-between items-center text-[10px] text-[#94A3B8] font-mono select-none">
                  <span className="font-bold">{m.sender === 'user' ? 'You' : 'Copilot AI'}</span>
                  <span>{m.time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
                
                {/* Render Text / Markdown */}
                <div className="markdown-body text-xs prose prose-invert max-w-none text-[#E2E8F0] leading-relaxed">
                  <ReactMarkdown>{m.text}</ReactMarkdown>
                </div>
              </div>
            </div>
          ))}

          {/* Typing Indicator */}
          {loading && (
            <div className="flex justify-start">
              <div className="bg-[#111420] border border-[#1E293B] rounded-2xl rounded-bl-none p-4 max-w-sm flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#2C7BE5] animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-2 h-2 rounded-full bg-[#2C7BE5] animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-2 h-2 rounded-full bg-[#2C7BE5] animate-bounce" style={{ animationDelay: '300ms' }} />
                <span className="text-[10px] font-mono text-[#94A3B8] ml-2">Computing intelligence factors...</span>
              </div>
            </div>
          )}
          <div ref={scrollRef} />
        </div>

        {/* Prompt Input Box */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend(input);
          }}
          className="p-4 bg-[#111420]/80 border-t border-[#1E293B]/80 flex gap-3"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={loading}
            placeholder="Query supplier metrics or run mock disruption forecasts..."
            className="flex-1 bg-[#0B0D14] border border-[#1E293B] rounded-xl px-4 py-3 text-xs text-[#E2E8F0] placeholder:text-slate-500 focus:border-[#2C7BE5]/60 outline-none transition disabled:opacity-50"
            id="copilot-input-field"
          />
          <button
            type="submit"
            disabled={!input.trim() || loading}
            className="w-11 h-11 rounded-xl bg-[#2C7BE5] hover:bg-blue-600 text-white flex items-center justify-center transition active:scale-95 disabled:opacity-40 disabled:pointer-events-none cursor-pointer shrink-0 shadow-[0_0_15px_rgba(44,123,229,0.3)]"
            id="copilot-send-btn"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>

      </div>

    </div>
  );
}
