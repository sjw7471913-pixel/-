import React, { useState, useEffect } from 'react';
import { Navbar, NavTab } from './components/Navbar';
import { ClosetSection } from './components/ClosetSection';
import { BodyProfileSection } from './components/BodyProfileSection';
import { OutfitRecommender } from './components/OutfitRecommender';
import { OotdCommunity } from './components/OotdCommunity';
import { AiStylistChat } from './components/AiStylistChat';
import { ShopSection } from './components/ShopSection';
import { OnboardingAuthModal } from './components/OnboardingAuthModal';
import { ClothingScannerModal } from './components/ClothingScannerModal';
import { BodyScannerModal } from './components/BodyScannerModal';
import {
  ClothingItem,
  BodyProfile,
  WeatherData,
  OotdPost,
  OutfitRecommendation,
  UserAccount,
  ChatMessage,
  ShopItem
} from './types';
import {
  INITIAL_CLOTHING_ITEMS,
  INITIAL_BODY_PROFILE,
  CITIES_WEATHER,
  INITIAL_OOTD_POSTS,
  INITIAL_USER_ACCOUNT,
  INITIAL_CHAT_MESSAGES,
  INITIAL_SHOP_ITEMS
} from './data/mockData';

export default function App() {
  const [activeTab, setActiveTab] = useState<NavTab>('recommender');

  // User Account state
  const [user, setUser] = useState<UserAccount>(() => {
    const saved = localStorage.getItem('aifit_user_account');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse user account', e);
      }
    }
    return INITIAL_USER_ACCOUNT;
  });

  // Chat History state
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>(() => {
    const saved = localStorage.getItem('aifit_chat_history');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse chat history', e);
      }
    }
    return INITIAL_CHAT_MESSAGES;
  });

  // Shop Items state
  const [shopItems, setShopItems] = useState<ShopItem[]>(() => {
    const saved = localStorage.getItem('aifit_shop_items');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse shop items', e);
      }
    }
    return INITIAL_SHOP_ITEMS;
  });

  // Closet items state with local persistence
  const [closetItems, setClosetItems] = useState<ClothingItem[]>(() => {
    const saved = localStorage.getItem('aifit_closet_items');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse saved closet items', e);
      }
    }
    return INITIAL_CLOTHING_ITEMS;
  });

  // Body profile state
  const [bodyProfile, setBodyProfile] = useState<BodyProfile>(() => {
    const saved = localStorage.getItem('aifit_body_profile');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse saved body profile', e);
      }
    }
    return INITIAL_BODY_PROFILE;
  });

  // Weather state
  const [weather, setWeather] = useState<WeatherData>(CITIES_WEATHER['서울']);

  // OOTD Community posts state
  const [ootdPosts, setOotdPosts] = useState<OotdPost[]>(() => {
    const saved = localStorage.getItem('aifit_ootd_posts');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse saved posts', e);
      }
    }
    return INITIAL_OOTD_POSTS;
  });

  // Modals
  const [isClothingScanOpen, setIsClothingScanOpen] = useState(false);
  const [isBodyScanOpen, setIsBodyScanOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // Sync state changes to localStorage
  useEffect(() => {
    localStorage.setItem('aifit_user_account', JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    localStorage.setItem('aifit_chat_history', JSON.stringify(chatHistory));
  }, [chatHistory]);

  useEffect(() => {
    localStorage.setItem('aifit_shop_items', JSON.stringify(shopItems));
  }, [shopItems]);

  useEffect(() => {
    localStorage.setItem('aifit_closet_items', JSON.stringify(closetItems));
  }, [closetItems]);

  useEffect(() => {
    localStorage.setItem('aifit_body_profile', JSON.stringify(bodyProfile));
  }, [bodyProfile]);

  useEffect(() => {
    localStorage.setItem('aifit_ootd_posts', JSON.stringify(ootdPosts));
  }, [ootdPosts]);

  // Closet Handlers
  const handleToggleFavorite = (id: string) => {
    setClosetItems(
      closetItems.map((item) =>
        item.id === id ? { ...item, favorite: !item.favorite } : item
      )
    );
  };

  const handleDeleteItem = (id: string) => {
    setClosetItems(closetItems.filter((item) => item.id !== id));
  };

  const handleAddClothingItem = (item: ClothingItem) => {
    setClosetItems([item, ...closetItems]);
  };

  const handleUpdateBodyProfile = (profile: BodyProfile) => {
    setBodyProfile(profile);
    setActiveTab('body_profile');
  };

  // Share generated outfit directly to community feed
  const handleShareOutfitToFeed = (outfit: OutfitRecommendation) => {
    const usedItems = [
      outfit.items.top && { category: '상의', name: outfit.items.top.name },
      outfit.items.bottom && { category: '하의', name: outfit.items.bottom.name },
      outfit.items.outer && { category: '아우터', name: outfit.items.outer.name },
      outfit.items.shoes && { category: '신발', name: outfit.items.shoes.name }
    ].filter(Boolean) as { category: string; name: string }[];

    const newPost: OotdPost = {
      id: `post-${Date.now()}`,
      authorName: user.name || '나의 AI 퍼스널 추천룩',
      authorAvatar: user.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      authorBodyType: bodyProfile.bodyTypeKorean.split(' ')[0] || '웨이브 체형',
      outfitTitle: outfit.title,
      description: `AI 핏코디가 추천해준 ${weather.city} (${weather.temp}°C) 맞춤 룩입니다! ${outfit.bodyFitReason}`,
      imageUrl: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&auto=format&fit=crop&q=80',
      itemsUsed: usedItems.length > 0 ? usedItems : [{ category: '전체', name: 'AI 스캔 코디' }],
      likesCount: 1,
      isLiked: true,
      weatherTag: `${weather.city} ${weather.temp}°C ${weather.condition}`,
      createdAt: '방금 전',
      comments: []
    };

    setOotdPosts([newPost, ...ootdPosts]);
    setActiveTab('community');
  };

  // Feed Actions
  const handleLikePost = (postId: string) => {
    setOotdPosts(
      ootdPosts.map((p) => {
        if (p.id === postId) {
          const isLiked = !p.isLiked;
          return {
            ...p,
            isLiked,
            likesCount: isLiked ? p.likesCount + 1 : p.likesCount - 1
          };
        }
        return p;
      })
    );
  };

  const handleVotePoll = (postId: string, option: 'A' | 'B') => {
    setOotdPosts(
      ootdPosts.map((p) => {
        if (p.id === postId) {
          if (p.userVoted === option) return p; // already voted same
          const votesA = option === 'A' ? (p.pollVotesA || 0) + 1 : (p.pollVotesA || 0) - (p.userVoted === 'A' ? 1 : 0);
          const votesB = option === 'B' ? (p.pollVotesB || 0) + 1 : (p.pollVotesB || 0) - (p.userVoted === 'B' ? 1 : 0);
          return {
            ...p,
            userVoted: option,
            pollVotesA: Math.max(0, votesA),
            pollVotesB: Math.max(0, votesB)
          };
        }
        return p;
      })
    );
  };

  const handleAddComment = (postId: string, content: string) => {
    const newComment = {
      id: `c-${Date.now()}`,
      authorName: user.name || '나',
      authorAvatar: user.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
      content,
      createdAt: '방금 전'
    };

    setOotdPosts(
      ootdPosts.map((p) => (p.id === postId ? { ...p, comments: [...p.comments, newComment] } : p))
    );
  };

  return (
    <div className="min-h-screen bg-stone-50/70 text-stone-900 font-sans antialiased flex flex-col">
      {/* Header Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenClothingScan={() => setIsClothingScanOpen(true)}
        onOpenBodyScan={() => setIsBodyScanOpen(true)}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
        user={user}
        closetCount={closetItems.length}
      />

      {/* Main App Content Viewport */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-6 sm:py-8 space-y-6">
        {activeTab === 'recommender' && (
          <OutfitRecommender
            closetItems={closetItems}
            bodyProfile={bodyProfile}
            weather={weather}
            setWeather={setWeather}
            onOpenClothingScan={() => setIsClothingScanOpen(true)}
            onShareToFeed={handleShareOutfitToFeed}
          />
        )}

        {activeTab === 'chat' && (
          <AiStylistChat
            chatHistory={chatHistory}
            setChatHistory={setChatHistory}
            closetItems={closetItems}
            bodyProfile={bodyProfile}
            weather={weather}
            onNavigateToShop={() => setActiveTab('shop')}
          />
        )}

        {activeTab === 'shop' && (
          <ShopSection
            shopItems={shopItems}
            setShopItems={setShopItems}
            closetItems={closetItems}
            bodyProfile={bodyProfile}
            onAddClothingItem={handleAddClothingItem}
          />
        )}

        {activeTab === 'closet' && (
          <ClosetSection
            items={closetItems}
            onToggleFavorite={handleToggleFavorite}
            onDeleteItem={handleDeleteItem}
            onOpenScanModal={() => setIsClothingScanOpen(true)}
            onAddItemManually={handleAddClothingItem}
          />
        )}

        {activeTab === 'body_profile' && (
          <BodyProfileSection
            profile={bodyProfile}
            onOpenBodyScan={() => setIsBodyScanOpen(true)}
          />
        )}

        {activeTab === 'community' && (
          <OotdCommunity
            posts={ootdPosts}
            onAddPost={(newPost) => setOotdPosts([newPost, ...ootdPosts])}
            onLikePost={handleLikePost}
            onVotePoll={handleVotePoll}
            onAddComment={handleAddComment}
            closetItems={closetItems}
            bodyProfile={bodyProfile}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-stone-200 bg-white/60 py-6 mt-12 text-center text-xs text-stone-500">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p>© 2026 AI 핏코디 — 스마트 퍼스널 옷장 &amp; 체형 맞춤 AI 코디네이터</p>
          <div className="flex items-center gap-3 text-stone-400">
            <span>Gemini 3.6 Vision Powered</span>
            <span>·</span>
            <span>Real-Time Weather Integration</span>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <OnboardingAuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        user={user}
        setUser={setUser}
        bodyProfile={bodyProfile}
        setBodyProfile={setBodyProfile}
      />

      <ClothingScannerModal
        isOpen={isClothingScanOpen}
        onClose={() => setIsClothingScanOpen(false)}
        onScanComplete={handleAddClothingItem}
      />

      <BodyScannerModal
        isOpen={isBodyScanOpen}
        onClose={() => setIsBodyScanOpen(false)}
        onScanComplete={handleUpdateBodyProfile}
      />
    </div>
  );
}
