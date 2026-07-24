import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage, ClothingItem, BodyProfile, WeatherData } from '../types';
import { MessageSquare, Send, Sparkles, User, RefreshCw, Shirt, UserCheck, ShoppingBag, Lightbulb } from 'lucide-react';

interface AiStylistChatProps {
  chatHistory: ChatMessage[];
  setChatHistory: React.Dispatch<React.SetStateAction<ChatMessage[]>>;
  closetItems: ClothingItem[];
  bodyProfile: BodyProfile;
  weather: WeatherData;
  onNavigateToShop: () => void;
}

export const AiStylistChat: React.FC<AiStylistChatProps> = ({
  chatHistory,
  setChatHistory,
  closetItems,
  bodyProfile,
  weather,
  onNavigateToShop
}) => {
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const samplePrompts = [
    '👗 오늘 소개팅/데이트에 어울리는 착장 제안해줘!',
    '🛍️ 요즘 내 옷장에 부족해서 구매해야 할 옷이 뭐야?',
    '🧥 클래식 베이지 트렌치코트에 어울리는 하의 조합은?',
    '🎨 여름 쿨톤에 어울리는 상하의 색 조합 팁 알려줘'
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatHistory, isTyping]);

  const handleSendMessage = async (textToSend?: string) => {
    const query = textToSend || inputText;
    if (!query.trim() || isTyping) return;

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text: query.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setChatHistory((prev) => [...prev, userMsg]);
    if (!textToSend) setInputText('');
    setIsTyping(true);

    try {
      const response = await fetch('/api/ai-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userMessage: query.trim(),
          closetItems,
          bodyProfile,
          weather
        })
      });

      if (!response.ok) throw new Error('상담 응답에 실패했습니다.');

      const data = await response.json();

      const aiMsg: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        sender: 'ai',
        text: data.text || '죄송합니다. 대화를 분석하는데 오류가 발생했습니다.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setChatHistory((prev) => [...prev, aiMsg]);
    } catch (err) {
      console.error('Error sending AI chat message:', err);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="space-y-4 max-w-4xl mx-auto">
      {/* Context Badge Header Bar */}
      <div className="bg-gradient-to-r from-purple-900 via-indigo-900 to-stone-900 text-white rounded-3xl p-4 sm:p-5 shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center shrink-0 border border-white/20">
            <Sparkles className="w-5 h-5 text-amber-300" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-extrabold text-sm sm:text-base">AI 퍼스널 스타일리스트 핏코디</h3>
              <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 px-2 py-0.5 rounded-full font-bold">
                ● 실시간 상담 중
              </span>
            </div>
            <p className="text-xs text-stone-300/90 mt-0.5">
              체형: <span className="font-bold text-purple-200">{bodyProfile.bodyTypeKorean}</span> · 소장 옷장:{' '}
              <span className="font-bold text-indigo-200">{closetItems.length}개</span> · {weather.city} {weather.temp}°C
            </p>
          </div>
        </div>

        <button
          onClick={onNavigateToShop}
          className="self-start sm:self-center px-3.5 py-1.5 rounded-xl bg-white/15 hover:bg-white/25 text-white text-xs font-bold transition-all flex items-center gap-1.5 border border-white/20 shrink-0 cursor-pointer"
        >
          <ShoppingBag className="w-3.5 h-3.5 text-amber-300" />
          <span>부족한 옷 구매 스토어 보기</span>
        </button>
      </div>

      {/* Main Chat Box Container */}
      <div className="bg-white rounded-3xl border border-stone-200 shadow-md flex flex-col h-[560px] overflow-hidden">
        {/* Messages Viewport */}
        <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4 bg-stone-50/50">
          {chatHistory.map((msg) => {
            const isAi = msg.sender === 'ai';
            return (
              <div
                key={msg.id}
                className={`flex gap-3 max-w-[85%] ${isAi ? 'self-start' : 'self-end flex-row-reverse ml-auto'}`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-xs font-bold ${
                    isAi
                      ? 'bg-gradient-to-tr from-indigo-600 to-purple-600 text-white shadow-xs'
                      : 'bg-stone-800 text-white'
                  }`}
                >
                  {isAi ? <Sparkles className="w-4 h-4" /> : <User className="w-4 h-4" />}
                </div>

                <div className="space-y-1">
                  <div
                    className={`p-4 rounded-2xl text-xs sm:text-sm leading-relaxed whitespace-pre-line shadow-2xs ${
                      isAi
                        ? 'bg-white text-stone-900 border border-stone-200/80 rounded-tl-xs'
                        : 'bg-indigo-600 text-white rounded-tr-xs'
                    }`}
                  >
                    {msg.text}
                  </div>
                  <span
                    className={`text-[10px] text-stone-400 block ${isAi ? 'text-left pl-1' : 'text-right pr-1'}`}
                  >
                    {msg.timestamp}
                  </span>
                </div>
              </div>
            );
          })}

          {isTyping && (
            <div className="flex gap-3 max-w-[80%] self-start">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-600 to-purple-600 text-white flex items-center justify-center shrink-0 text-xs">
                <Sparkles className="w-4 h-4 animate-spin" />
              </div>
              <div className="p-4 rounded-2xl bg-white border border-stone-200 text-xs text-stone-500 rounded-tl-xs flex items-center gap-2">
                <RefreshCw className="w-3.5 h-3.5 animate-spin text-indigo-600" />
                <span>AI 스타일리스트가 체형 및 옷장 데이터를 분석하여 답변 작성 중...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Sample Prompts */}
        <div className="px-4 py-2 bg-stone-100/70 border-t border-stone-200 flex items-center gap-2 overflow-x-auto text-xs no-scrollbar">
          <Lightbulb className="w-3.5 h-3.5 text-amber-500 shrink-0" />
          <span className="text-[11px] font-bold text-stone-500 shrink-0">추천 질문:</span>
          {samplePrompts.map((p, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(p.replace(/^[^\s]+\s/, ''))}
              disabled={isTyping}
              className="px-3 py-1 rounded-full bg-white hover:bg-stone-200 border border-stone-200 text-stone-700 text-[11px] font-medium whitespace-nowrap transition-colors shrink-0 cursor-pointer"
            >
              {p}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="p-3 sm:p-4 bg-white border-t border-stone-200 flex items-center gap-2"
        >
          <input
            type="text"
            placeholder="코디, 스타일링, 색상 조화, 쇼핑 추천 등 질문을 적어보세요..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            disabled={isTyping}
            className="flex-1 bg-stone-50 border border-stone-200 rounded-2xl px-4 py-2.5 text-xs sm:text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
          />
          <button
            type="submit"
            disabled={!inputText.trim() || isTyping}
            className="px-5 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white font-bold text-xs sm:text-sm shadow-md transition-all flex items-center gap-1.5 cursor-pointer shrink-0"
          >
            <span>전송</span>
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
