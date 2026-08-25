import React, { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, Bot, User, MessageSquare, Compass, Lightbulb, RefreshCw } from 'lucide-react';
import { DreamEntry, ChatMessage, DreamSymbol } from '../types';
import { fetchJson } from '../utils/apiClient';
import { useLanguage } from '../context/LanguageContext';

interface SymbolChatProps {
  dream: DreamEntry;
  onUpdateDream: (updatedDream: DreamEntry) => void;
  activeSymbolFocus?: DreamSymbol | null;
}

export const SymbolChat: React.FC<SymbolChatProps> = ({
  dream,
  onUpdateDream,
  activeSymbolFocus,
}) => {
  const { t, language } = useLanguage();
  const [inputText, setInputText] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [selectedSymbolName, setSelectedSymbolName] = useState<string | null>(
    activeSymbolFocus?.name || null
  );

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (activeSymbolFocus) {
      setSelectedSymbolName(activeSymbolFocus.name);
    }
  }, [activeSymbolFocus]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [dream.chatHistory, isSending]);

  const handleSendMessage = async (textToSend?: string, specificSymbol?: string) => {
    const message = textToSend || inputText;
    if (!message.trim() || isSending) return;

    const userMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text: message.trim(),
      timestamp: new Date().toISOString(),
      relatedSymbol: specificSymbol || selectedSymbolName || undefined,
    };

    const updatedHistory = [...dream.chatHistory, userMessage];
    onUpdateDream({
      ...dream,
      chatHistory: updatedHistory,
    });

    setInputText('');
    setIsSending(true);

    try {
      const data = await fetchJson<{ reply: string }>('/api/symbol-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          dreamContext: {
            title: dream.title,
            transcription: dream.transcription,
            interpretation: dream.interpretation,
          },
          history: updatedHistory.slice(-8), // Keep recent conversation window
          message: message.trim(),
          targetSymbol: specificSymbol || selectedSymbolName || undefined,
          language: language,
        }),
      });

      const assistantMessage: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        sender: 'assistant',
        text: data.reply,
        timestamp: new Date().toISOString(),
        relatedSymbol: specificSymbol || selectedSymbolName || undefined,
      };

      onUpdateDream({
        ...dream,
        chatHistory: [...updatedHistory, assistantMessage],
      });
    } catch (err: any) {
      console.error('Chat error:', err);
      const errorMessage: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        sender: 'assistant',
        text: language === 'it' 
          ? "L'inconscio è vasto ed enigmatico. Si è verificata una breve interruzione di connessione, ma rifletti su quale sensazione corporea ti suscita questo simbolo."
          : 'The subconscious is vast and enigmatic. I encountered a momentary difficulty connecting, but reflect on what this symbol makes you feel in your body.',
        timestamp: new Date().toISOString(),
      };
      onUpdateDream({
        ...dream,
        chatHistory: [...updatedHistory, errorMessage],
      });
    } finally {
      setIsSending(false);
    }
  };

  const handleSymbolChipClick = (symbol: DreamSymbol) => {
    setSelectedSymbolName(symbol.name);
    const inquiry = language === 'it'
      ? `Parlami del significato archetipico di "${symbol.name}" in questo sogno, e cosa implica per la mia vita da sveglio.`
      : `Tell me more about the archetypal meaning of "${symbol.name}" in this dream, and what it implies for my waking life.`;
    setInputText(inquiry);
  };

  const symbolsList = dream.interpretation?.symbols || [];

  return (
    <div className="flex flex-col h-full bg-[#0d1322] rounded-2xl border border-slate-800 overflow-hidden shadow-xl">
      {/* Chat Header */}
      <div className="p-4 border-b border-slate-800/80 bg-slate-900/60 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center">
            <Bot className="w-4 h-4 text-indigo-300" />
          </div>
          <div>
            <h3 className="text-xs sm:text-sm font-semibold text-slate-100 flex items-center gap-2">
              <span>{t.symbolDialogueHeader}</span>
              <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                {t.activeBadge}
              </span>
            </h3>
            <p className="text-[11px] text-slate-400">
              {t.chatSubtitle}
            </p>
          </div>
        </div>
      </div>

      {/* Symbol Quick Inquiries Carousel */}
      {symbolsList.length > 0 && (
        <div className="px-4 py-2.5 bg-slate-900/40 border-b border-slate-800/60">
          <div className="flex items-center gap-1.5 text-[11px] text-slate-400 mb-1.5">
            <Compass className="w-3 h-3 text-amber-400" />
            <span>{t.selectSymbolToInquire}</span>
          </div>
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
            {symbolsList.map((sym) => {
              const isSelected = selectedSymbolName === sym.name;
              return (
                <button
                  key={sym.name}
                  id={`symbol-chip-${sym.name.replace(/\s+/g, '-').toLowerCase()}`}
                  onClick={() => handleSymbolChipClick(sym)}
                  className={`px-2.5 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-all flex items-center gap-1.5 ${
                    isSelected
                      ? 'bg-indigo-600/40 text-indigo-200 border border-indigo-400/50 shadow-sm'
                      : 'bg-slate-800/70 text-slate-300 border border-slate-700 hover:bg-slate-700/80 hover:text-white'
                  }`}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                  <span>{sym.name}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-[300px]">
        {dream.chatHistory.map((msg) => {
          const isUser = msg.sender === 'user';
          return (
            <div
              key={msg.id}
              className={`flex gap-3 text-xs leading-relaxed ${
                isUser ? 'justify-end' : 'justify-start'
              }`}
            >
              {!isUser && (
                <div className="w-7 h-7 rounded-lg bg-indigo-900/50 border border-indigo-500/30 flex items-center justify-center shrink-0 mt-0.5">
                  <Bot className="w-3.5 h-3.5 text-indigo-300" />
                </div>
              )}

              <div
                className={`max-w-[85%] rounded-2xl p-3.5 shadow-md ${
                  isUser
                    ? 'bg-indigo-600 text-white rounded-br-none border border-indigo-400/30'
                    : 'bg-[#141c30] text-slate-200 rounded-bl-none border border-slate-700/80'
                }`}
              >
                {msg.relatedSymbol && (
                  <div className="text-[10px] uppercase font-mono tracking-wider text-amber-300/90 mb-1.5 flex items-center gap-1">
                    <Sparkles className="w-2.5 h-2.5" />
                    <span>{t.inquiringSymbol} {msg.relatedSymbol}</span>
                  </div>
                )}
                <div className="space-y-2 whitespace-pre-line">
                  {msg.text}
                </div>
                <div
                  className={`text-[9px] mt-2 font-mono ${
                    isUser ? 'text-indigo-200/70 text-right' : 'text-slate-400'
                  }`}
                >
                  {new Date(msg.timestamp).toLocaleTimeString(language === 'it' ? 'it-IT' : 'en-US', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </div>
              </div>

              {isUser && (
                <div className="w-7 h-7 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center shrink-0 mt-0.5">
                  <User className="w-3.5 h-3.5 text-slate-300" />
                </div>
              )}
            </div>
          );
        })}

        {isSending && (
          <div className="flex gap-3 justify-start text-xs">
            <div className="w-7 h-7 rounded-lg bg-indigo-900/50 border border-indigo-500/30 flex items-center justify-center shrink-0">
              <Bot className="w-3.5 h-3.5 text-indigo-300 animate-pulse" />
            </div>
            <div className="bg-[#141c30] rounded-2xl rounded-bl-none p-3.5 border border-slate-700/80 text-slate-400 flex items-center gap-2">
              <RefreshCw className="w-3.5 h-3.5 animate-spin text-indigo-400" />
              <span>{t.analystContemplating}</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Follow-up Prompts */}
      <div className="px-4 py-2 bg-slate-900/30 border-t border-slate-800/60 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
        <span className="text-[10px] text-slate-500 shrink-0 font-medium">{t.suggestions}</span>
        <button
          onClick={() => handleSendMessage(t.suggestionCompensatory)}
          className="text-[11px] text-slate-400 hover:text-amber-200 bg-slate-800/50 hover:bg-slate-800 border border-slate-700/70 rounded-lg px-2 py-1 whitespace-nowrap transition-colors"
        >
          {language === 'it' ? 'Messaggio compensatorio?' : 'Compensatory message?'}
        </button>
        <button
          onClick={() => handleSendMessage(t.suggestionActiveImagination)}
          className="text-[11px] text-slate-400 hover:text-amber-200 bg-slate-800/50 hover:bg-slate-800 border border-slate-700/70 rounded-lg px-2 py-1 whitespace-nowrap transition-colors"
        >
          {language === 'it' ? 'Immaginazione attiva' : 'Active imagination exercise'}
        </button>
        <button
          onClick={() => handleSendMessage(t.suggestionSetting)}
          className="text-[11px] text-slate-400 hover:text-amber-200 bg-slate-800/50 hover:bg-slate-800 border border-slate-700/70 rounded-lg px-2 py-1 whitespace-nowrap transition-colors"
        >
          {language === 'it' ? 'Simbolismo ambientazione' : 'Setting symbolism'}
        </button>
      </div>

      {/* Input Area */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage();
        }}
        className="p-3 bg-slate-900/80 border-t border-slate-800 flex items-center gap-2"
      >
        <input
          id="symbol-chat-input"
          type="text"
          placeholder={
            selectedSymbolName
              ? t.chatInputFocusedPlaceholder.replace('{symbol}', selectedSymbolName)
              : t.chatInputPlaceholder
          }
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          disabled={isSending}
          className="flex-1 bg-[#12192c] border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-indigo-500"
        />
        <button
          id="send-symbol-chat-btn"
          type="submit"
          disabled={!inputText.trim() || isSending}
          className="p-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white transition-all shadow-md hover:scale-105 active:scale-95"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};
