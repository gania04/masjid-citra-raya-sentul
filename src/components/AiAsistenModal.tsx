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
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col h-[85vh] animate-in zoom-in-95 border-2 border-emerald-500/30">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-900 via-emerald-800 to-emerald-950 text-white p-4 flex items-center justify-between border-b border-emerald-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-lime-400 text-emerald-950 flex items-center justify-center shadow-md">
              <Bot className="w-6 h-6 text-emerald-900" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-white flex items-center gap-1.5">
                <span>AI Asisten Masjid Citra Sentul</span>
                <Sparkles className="w-3.5 h-3.5 text-lime-400 animate-pulse" />
              </h3>
              <span className="text-[10px] text-emerald-300 block">
                Konsultasi Fiqih Wakaf & Program Masjid (Gemini AI)
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-emerald-800/80 hover:bg-emerald-700 text-slate-200 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Chat Stream */}
        <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-slate-50">
          {messages.map((m) => {
            const isAi = m.sender === 'ai';
            return (
              <div
                key={m.id}
                className={`flex items-start gap-2.5 ${isAi ? '' : 'flex-row-reverse'}`}
              >
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-xs font-bold ${
                    isAi
                      ? 'bg-emerald-800 text-lime-300'
                      : 'bg-slate-800 text-white'
                  }`}
                >
                  {isAi ? '🕌' : <User className="w-4 h-4" />}
                </div>

                <div
                  className={`max-w-[80%] rounded-2xl p-3.5 text-xs sm:text-sm leading-relaxed space-y-1 ${
                    isAi
                      ? 'bg-white text-slate-800 border border-slate-200 shadow-2xs'
                      : 'bg-emerald-700 text-white font-medium shadow-2xs'
                  }`}
                >
                  <p className="whitespace-pre-line">{m.text}</p>
                  <span
                    className={`block text-[9px] text-right font-medium ${
                      isAi ? 'text-slate-400' : 'text-emerald-200'
                    }`}
                  >
                    {m.timestamp}
                  </span>
                </div>
              </div>
            );
          })}

          {isLoading && (
            <div className="flex items-center gap-2 text-xs text-slate-500 bg-white p-3 rounded-2xl border border-slate-200 w-fit">
              <RefreshCw className="w-4 h-4 animate-spin text-emerald-600" />
              <span>AI Asisten sedang menyiapkan jawaban...</span>
            </div>
          )}

          <div ref={chatEndRef} />
        </div>

        {/* Quick Chips */}
        <div className="p-2 bg-white border-t border-slate-100 flex items-center gap-1.5 overflow-x-auto text-[11px] font-semibold no-scrollbar">
          {quickChips.map((chip) => (
            <button
              key={chip}
              onClick={() => handleSendMessage(chip)}
              className="px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200 shrink-0 transition-colors"
            >
              {chip}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-3 bg-white border-t border-slate-200 flex items-center gap-2">
          <input
            type="text"
            value={inputPrompt}
            onChange={(e) => setInputPrompt(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Ketik pertanyaan Anda..."
            className="flex-1 px-4 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
          />
          <button
            onClick={() => handleSendMessage()}
            disabled={isLoading || !inputPrompt.trim()}
            className="p-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white transition-colors"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
