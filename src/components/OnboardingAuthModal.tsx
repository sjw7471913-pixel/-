import React, { useState } from 'react';
import { UserAccount, BodyProfile } from '../types';
import { User, Sparkles, CheckCircle, ShieldCheck, Mail, Lock, ArrowRight } from 'lucide-react';

interface OnboardingAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserAccount;
  setUser: (u: UserAccount) => void;
  bodyProfile: BodyProfile;
  setBodyProfile: (b: BodyProfile) => void;
}

export const OnboardingAuthModal: React.FC<OnboardingAuthModalProps> = ({
  isOpen,
  onClose,
  user,
  setUser,
  bodyProfile,
  setBodyProfile
}) => {
  const [step, setStep] = useState<'auth' | 'preferences'>('auth');
  const [nameInput, setNameInput] = useState(user.name || '');
  const [emailInput, setEmailInput] = useState(user.email || '');
  const [heightInput, setHeightInput] = useState(bodyProfile.heightCm || 165);
  const [weightInput, setWeightInput] = useState(bodyProfile.weightKg || 52);
  const [selectedStyles, setSelectedStyles] = useState<string[]>(
    user.preferredStyles.length > 0 ? user.preferredStyles : ['미니멀', '스마트 캐주얼']
  );

  if (!isOpen) return null;

  const styleOptions = ['미니멀', '스마트 캐주얼', '크롭/하이웨스트', '스트릿/힙', '클래식/포멀', '시티보이', '로맨틱/페미닌'];

  const toggleStyle = (style: string) => {
    if (selectedStyles.includes(style)) {
      setSelectedStyles(selectedStyles.filter((s) => s !== style));
    } else {
      setSelectedStyles([...selectedStyles, style]);
    }
  };

  const handleComplete = (e: React.FormEvent) => {
    e.preventDefault();
    setUser({
      ...user,
      isLoggedIn: true,
      name: nameInput.trim() || '김패션',
      email: emailInput.trim() || 'fashion.user@aifit.com',
      preferredStyles: selectedStyles
    });

    setBodyProfile({
      ...bodyProfile,
      heightCm: Number(heightInput),
      weightKg: Number(weightInput)
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-stone-950/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 space-y-6 shadow-2xl relative border border-stone-100 overflow-hidden">
        {/* Background Decorative Blur */}
        <div className="absolute -top-12 -right-12 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold border border-indigo-100">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI 핏코디 멤버십 진입</span>
          </div>
          <h2 className="text-2xl font-extrabold text-stone-900 tracking-tight">
            {step === 'auth' ? '스마트 옷장 로그인 / 회원가입' : '내 체형 &amp; 스타일 취향 설정'}
          </h2>
          <p className="text-xs text-stone-500">
            {step === 'auth'
              ? 'AI 가 내 옷장과 체형을 스캔하여 완벽한 스타일을 맞춤 제안해 드립니다.'
              : '체형 분석과 스마트 추천의 신뢰도를 높이기 위한 기본 프로필입니다.'}
          </p>
        </div>

        {step === 'auth' ? (
          <div className="space-y-4">
            {/* Quick Social Buttons */}
            <div className="space-y-2">
              <button
                type="button"
                onClick={() => setStep('preferences')}
                className="w-full py-3 px-4 rounded-2xl bg-[#FEE500] hover:bg-[#FADA0A] text-[#191919] font-bold text-xs sm:text-sm shadow-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <span className="font-extrabold">💬 카카오 1초 간편 로그인/가입</span>
              </button>

              <button
                type="button"
                onClick={() => setStep('preferences')}
                className="w-full py-3 px-4 rounded-2xl bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <span className="font-extrabold">🌐 Google 계정으로 계속하기</span>
              </button>
            </div>

            <div className="relative flex py-1 items-center">
              <div className="flex-grow border-t border-stone-200"></div>
              <span className="flex-shrink mx-3 text-stone-400 text-[11px] font-medium">또는 이메일 가입</span>
              <div className="flex-grow border-t border-stone-200"></div>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                setStep('preferences');
              }}
              className="space-y-3 text-xs"
            >
              <div>
                <label className="text-stone-700 font-bold block mb-1">이름 / 닉네임 *</label>
                <div className="relative">
                  <User className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    required
                    placeholder="예: 김패션"
                    value={nameInput}
                    onChange={(e) => setNameInput(e.target.value)}
                    className="w-full border border-stone-200 rounded-xl pl-9 pr-3 py-2 focus:ring-2 focus:ring-indigo-500/30 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-stone-700 font-bold block mb-1">이메일 주소 *</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
                  <input
                    type="email"
                    required
                    placeholder="user@example.com"
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    className="w-full border border-stone-200 rounded-xl pl-9 pr-3 py-2 focus:ring-2 focus:ring-indigo-500/30 outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-1.5 mt-2 cursor-pointer"
              >
                <span>다음: 내 취향 설정하기</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>
        ) : (
          <form onSubmit={handleComplete} className="space-y-4 text-xs">
            {/* Specs Input */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-stone-700 font-bold block mb-1">키 (cm)</label>
                <input
                  type="number"
                  min="130"
                  max="210"
                  value={heightInput}
                  onChange={(e) => setHeightInput(Number(e.target.value))}
                  className="w-full border border-stone-200 rounded-xl px-3 py-2 font-bold text-stone-900 focus:ring-2 focus:ring-indigo-500/30 outline-none"
                />
              </div>

              <div>
                <label className="text-stone-700 font-bold block mb-1">몸무게 (kg)</label>
                <input
                  type="number"
                  min="30"
                  max="150"
                  value={weightInput}
                  onChange={(e) => setWeightInput(Number(e.target.value))}
                  className="w-full border border-stone-200 rounded-xl px-3 py-2 font-bold text-stone-900 focus:ring-2 focus:ring-indigo-500/30 outline-none"
                />
              </div>
            </div>

            {/* Preferred Styles */}
            <div>
              <label className="text-stone-700 font-bold block mb-1.5">선호하는 스타일 무드 (복수 선택)</label>
              <div className="flex flex-wrap gap-1.5">
                {styleOptions.map((st) => {
                  const isSel = selectedStyles.includes(st);
                  return (
                    <button
                      key={st}
                      type="button"
                      onClick={() => toggleStyle(st)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                        isSel
                          ? 'bg-indigo-600 text-white shadow-xs'
                          : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                      }`}
                    >
                      {st}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="pt-2 flex items-center justify-between gap-2 border-t border-stone-100">
              <button
                type="button"
                onClick={() => setStep('auth')}
                className="px-4 py-2 rounded-xl text-stone-500 hover:text-stone-800 font-medium cursor-pointer"
              >
                이전
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs sm:text-sm shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <CheckCircle className="w-4 h-4" />
                <span>시작하기 &amp; AI 옷장 연결</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
