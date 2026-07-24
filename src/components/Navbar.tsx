import React from 'react';
import { Shirt, Camera, Sparkles, UserCheck, Users, MessageSquare, ShoppingBag, User } from 'lucide-react';
import { UserAccount } from '../types';

export type NavTab = 'recommender' | 'closet' | 'chat' | 'shop' | 'body_profile' | 'community';

interface NavbarProps {
  activeTab: NavTab;
  setActiveTab: (tab: NavTab) => void;
  onOpenClothingScan: () => void;
  onOpenBodyScan: () => void;
  onOpenAuthModal: () => void;
  user: UserAccount;
  closetCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onOpenClothingScan,
  onOpenBodyScan,
  onOpenAuthModal,
  user,
  closetCount,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-stone-200">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between gap-2">
        {/* Brand Logo */}
        <div 
          onClick={() => setActiveTab('recommender')}
          className="flex items-center gap-2.5 cursor-pointer group select-none shrink-0"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-500 flex items-center justify-center text-white shadow-md shadow-indigo-200 group-hover:scale-105 transition-transform">
            <Sparkles className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-lg tracking-tight text-stone-900">
                AI 핏코디
              </span>
              <span className="text-[10px] font-semibold uppercase tracking-widest px-1.5 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-100 hidden sm:inline-block">
                STYLING AI
              </span>
            </div>
            <p className="text-xs text-stone-500 hidden md:block">
              카메라 스캔 기반 퍼스널 옷장 &amp; 맞춤 코디
            </p>
          </div>
        </div>

        {/* Action Scan Buttons & User Profile */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            id="btn-scan-clothing"
            onClick={onOpenClothingScan}
            className="flex items-center gap-1.5 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl text-xs sm:text-sm font-medium text-stone-800 bg-stone-100 hover:bg-stone-200 border border-stone-200 transition-colors shadow-xs cursor-pointer"
          >
            <Camera className="w-4 h-4 text-indigo-600" />
            <span className="hidden xs:inline">옷</span> 스캔
          </button>
          
          <button
            id="btn-scan-body"
            onClick={onOpenBodyScan}
            className="flex items-center gap-1.5 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl text-xs sm:text-sm font-medium text-stone-800 bg-stone-100 hover:bg-stone-200 border border-stone-200 transition-colors shadow-xs cursor-pointer"
          >
            <UserCheck className="w-4 h-4 text-purple-600" />
            <span className="hidden xs:inline">체형</span> 스캔
          </button>

          {/* Login / User Profile Modal Trigger */}
          <button
            id="btn-open-auth-modal"
            onClick={onOpenAuthModal}
            className="flex items-center gap-1.5 px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-900 border border-indigo-200/80 transition-colors cursor-pointer text-xs font-bold"
          >
            {user.isLoggedIn ? (
              <>
                <img src={user.avatarUrl} alt={user.name} className="w-5 h-5 rounded-full object-cover" />
                <span className="hidden md:inline line-clamp-1 max-w-[80px]">{user.name}</span>
              </>
            ) : (
              <>
                <User className="w-4 h-4 text-indigo-600" />
                <span>로그인/가입</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main Tab Navigation */}
      <nav className="max-w-6xl mx-auto px-2 flex border-t border-stone-100 overflow-x-auto no-scrollbar">
        <button
          id="tab-recommender"
          onClick={() => setActiveTab('recommender')}
          className={`flex-1 min-w-[90px] py-3 px-2 text-xs sm:text-sm font-medium flex items-center justify-center gap-1.5 border-b-2 transition-all whitespace-nowrap ${
            activeTab === 'recommender'
              ? 'border-indigo-600 text-indigo-600 bg-indigo-50/40'
              : 'border-transparent text-stone-500 hover:text-stone-800 hover:bg-stone-50/50'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>AI 코디</span>
        </button>

        <button
          id="tab-chat"
          onClick={() => setActiveTab('chat')}
          className={`flex-1 min-w-[90px] py-3 px-2 text-xs sm:text-sm font-medium flex items-center justify-center gap-1.5 border-b-2 transition-all whitespace-nowrap ${
            activeTab === 'chat'
              ? 'border-indigo-600 text-indigo-600 bg-indigo-50/40'
              : 'border-transparent text-stone-500 hover:text-stone-800 hover:bg-stone-50/50'
          }`}
        >
          <MessageSquare className="w-4 h-4 text-indigo-600" />
          <span>AI 패션 상담</span>
        </button>

        <button
          id="tab-shop"
          onClick={() => setActiveTab('shop')}
          className={`flex-1 min-w-[100px] py-3 px-2 text-xs sm:text-sm font-medium flex items-center justify-center gap-1.5 border-b-2 transition-all whitespace-nowrap ${
            activeTab === 'shop'
              ? 'border-indigo-600 text-indigo-600 bg-indigo-50/40'
              : 'border-transparent text-stone-500 hover:text-stone-800 hover:bg-stone-50/50'
          }`}
        >
          <ShoppingBag className="w-4 h-4 text-amber-600" />
          <span>옷 구매 스토어</span>
        </button>

        <button
          id="tab-closet"
          onClick={() => setActiveTab('closet')}
          className={`flex-1 min-w-[90px] py-3 px-2 text-xs sm:text-sm font-medium flex items-center justify-center gap-1.5 border-b-2 transition-all whitespace-nowrap ${
            activeTab === 'closet'
              ? 'border-indigo-600 text-indigo-600 bg-indigo-50/40'
              : 'border-transparent text-stone-500 hover:text-stone-800 hover:bg-stone-50/50'
          }`}
        >
          <Shirt className="w-4 h-4" />
          <span>디지털 옷장</span>
          <span className="px-1.5 py-0.2 rounded-full text-[11px] bg-stone-200 text-stone-700 font-semibold">
            {closetCount}
          </span>
        </button>

        <button
          id="tab-body-profile"
          onClick={() => setActiveTab('body_profile')}
          className={`flex-1 min-w-[90px] py-3 px-2 text-xs sm:text-sm font-medium flex items-center justify-center gap-1.5 border-b-2 transition-all whitespace-nowrap ${
            activeTab === 'body_profile'
              ? 'border-indigo-600 text-indigo-600 bg-indigo-50/40'
              : 'border-transparent text-stone-500 hover:text-stone-800 hover:bg-stone-50/50'
          }`}
        >
          <UserCheck className="w-4 h-4" />
          <span>체형 프로필</span>
        </button>

        <button
          id="tab-community"
          onClick={() => setActiveTab('community')}
          className={`flex-1 min-w-[90px] py-3 px-2 text-xs sm:text-sm font-medium flex items-center justify-center gap-1.5 border-b-2 transition-all whitespace-nowrap ${
            activeTab === 'community'
              ? 'border-indigo-600 text-indigo-600 bg-indigo-50/40'
              : 'border-transparent text-stone-500 hover:text-stone-800 hover:bg-stone-50/50'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>OOTD 피드</span>
        </button>
      </nav>
    </header>
  );
};
