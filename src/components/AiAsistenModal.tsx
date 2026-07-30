import React, { useState, useRef, useEffect } from 'react';
import { Bot, Send, X, Sparkles, User, RefreshCw } from 'lucide-react';
import { ChatMessage } from '../types';

interface AiAsistenModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenWakaf: () => void;
}

export const AiAsistenModal: React.FC<AiAsistenModalProps> = ({
  isOpen,
  onClose,
  onOpenWakaf,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      sender: 'ai',
      text: "Assalamu'alaikum Warahmatullahi Wabarakatuh! Saya AI Asisten Masjid Citra Sentul Raya. Ada yang dapat saya bantu seputar program Wakaf Pembangunan Masjid, keutamaan wakaf, rekening BSI resmi, atau lokasi di Sirkuit Sentul?",
      timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [inputPrompt, setInputPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  if (!isOpen) return null;

  const quickChips = [
    'Rekening BSI Resmi',
    'Keutamaan Wakaf Masjid',
    'Target Dana Pembangunan',
    'Kontak Pak Leo & Pak Aria',
  ];

  const handleSendMessage = async (textToSend?: string) => {
    const promptText = textToSend || inputPrompt;
    if (!promptText.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: promptText,
      timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputPrompt('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/ai/consultation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: promptText }),
      });

      const data = await response.json();
      const aiReplyText = data.reply || data.error || "Assalamu'alaikum. Mohon maaf, sistem AI sedang menyesuaikan data. Silakan hubungi Pak Leo di +62 812-1920-0400 untuk informasi langsung.";

      const aiMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: aiReplyText,
        timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: 'ai',
          text: "Assalamu'alaikum! Terima kasih telah menghubungi kami. Donasi Wakaf Pembangunan Masjid Citra Sentul Raya dapat disalurkan melalui Bank Syariah Indonesia (BSI) No. Rekening 7257159102 a.n. Masjid Citra Sentul Raya. Konfirmasi donasi hubungi Pak Leo (+62 812-1920-0400) atau Pak Aria (+62 818-1885-1377).",
          timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-hidden">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col h-[85vh] animate-in zoom-in-95 border-2 border-amber-500/30">
        
        {/* Header - Gold / Orange Theme */}
        <div className="bg-gradient-to-r from-amber-600 via-amber-500 to-yellow-500 text-white p-4 flex items-center justify-between border-b border-amber-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white text-amber-600 flex items-center justify-center shadow-md">
              <Bot className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-white flex items-center gap-1.5">
                <span>AI Asisten Masjid Citra Sentul</span>
                <Sparkles className="w-3.5 h-3.5 text-yellow-200 animate-pulse" />
              </h3>
              <span className="text-[10px] text-amber-100 block font-semibold">
                Konsultasi Fiqih Wakaf & Program Masjid
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-amber-700/50 hover:bg-amber-700 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Chat Stream - Black/White Theme */}
        <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-slate-100">
          {messages.map((m) => {
            const isAi = m.sender === 'ai';
            return (
              <div
                key={m.id}
                className={`flex items-start gap-2.5 ${isAi ? '' : 'flex-row-reverse'}`}
              >
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-xs font-bold shadow-sm ${
                    isAi
                      ? 'bg-amber-500 text-white'
                      : 'bg-black text-white'
                  }`}
                >
                  {isAi ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
                </div>

                <div
                  className={`max-w-[80%] rounded-2xl p-3.5 text-xs sm:text-sm leading-relaxed space-y-1 shadow-sm border ${
                    isAi
                      ? 'bg-white text-black border-slate-200 rounded-tl-sm'
                      : 'bg-black text-white border-black rounded-tr-sm font-medium'
                  }`}
                >
                  <p className="whitespace-pre-line">{m.text}</p>
                  <span
                    className={`block text-[9px] text-right font-medium ${
                      isAi ? 'text-slate-400' : 'text-slate-300'
                    }`}
                  >
                    {m.timestamp}
                  </span>
                </div>
              </div>
            );
          })}

          {isLoading && (
            <div className="flex items-center gap-2 text-xs text-black bg-white p-3 rounded-2xl border border-slate-200 w-fit rounded-tl-sm shadow-sm">
              <RefreshCw className="w-4 h-4 animate-spin text-amber-500" />
              <span className="font-medium">AI Asisten sedang mengetik...</span>
            </div>
          )}

          <div ref={chatEndRef} />
        </div>

        {/* Quick Chips - Black/White & Orange */}
        <div className="p-3 bg-white border-t border-slate-200 flex items-center gap-2 overflow-x-auto text-[11px] font-bold no-scrollbar">
          {quickChips.map((chip) => (
            <button
              key={chip}
              onClick={() => handleSendMessage(chip)}
              className="px-3 py-1.5 rounded-full bg-white text-black hover:bg-black hover:text-white border-2 border-black shrink-0 transition-all shadow-sm"
            >
              {chip}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-3 bg-slate-50 border-t border-slate-200 flex items-center gap-2">
          <input
            type="text"
            value={inputPrompt}
            onChange={(e) => setInputPrompt(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Tanya apapun tentang masjid..."
            className="flex-1 px-4 py-2.5 rounded-xl border-2 border-slate-300 text-xs sm:text-sm text-black font-medium focus:outline-hidden focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all bg-white"
          />
          <button
            onClick={() => handleSendMessage()}
            disabled={isLoading || !inputPrompt.trim()}
            className="p-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 disabled:opacity-50 disabled:bg-slate-300 text-white transition-colors shadow-sm"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};
