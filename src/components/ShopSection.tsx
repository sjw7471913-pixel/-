import React, { useState } from 'react';
import { ShopItem, ClothingItem, BodyProfile } from '../types';
import { ShoppingBag, CheckCircle, Sparkles, Heart, ExternalLink, Plus, Filter, Shirt, ShieldCheck, ArrowUpRight } from 'lucide-react';

interface ShopSectionProps {
  shopItems: ShopItem[];
  setShopItems: React.Dispatch<React.SetStateAction<ShopItem[]>>;
  closetItems: ClothingItem[];
  bodyProfile: BodyProfile;
  onAddClothingItem: (item: ClothingItem) => void;
}

export const ShopSection: React.FC<ShopSectionProps> = ({
  shopItems,
  setShopItems,
  closetItems,
  bodyProfile,
  onAddClothingItem
}) => {
  const [filterMode, setFilterMode] = useState<'all' | 'needed' | 'owned'>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [addedItemIds, setAddedItemIds] = useState<string[]>([]);

  const toggleWishlist = (id: string) => {
    setShopItems(
      shopItems.map((item) =>
        item.id === id ? { ...item, inWishlist: !item.inWishlist } : item
      )
    );
  };

  // Simulate purchasing/adding item directly into user's closet
  const handleBuyAndAddToCloset = (shopItem: ShopItem) => {
    if (addedItemIds.includes(shopItem.id)) return;

    const newClosetItem: ClothingItem = {
      id: `item-bought-${Date.now()}`,
      name: shopItem.name,
      category: shopItem.category,
      subCategory: shopItem.subCategory,
      color: '추천 매칭 컬러',
      colorHex: '#4A4A4A',
      season: ['spring', 'summer', 'fall', 'winter'],
      styles: ['AI 매칭 추천', '스마트 캐주얼'],
      favorite: true,
      notes: `AI 핏코디 스토어에서 새로 구매하여 등록한 아이템 (${shopItem.reasonForRecommendation})`,
      createdAt: new Date().toISOString().split('T')[0]
    };

    onAddClothingItem(newClosetItem);
    setAddedItemIds([...addedItemIds, shopItem.id]);

    // Update item status in shop
    setShopItems(
      shopItems.map((i) => (i.id === shopItem.id ? { ...i, isOwned: true } : i))
    );
  };

  const filteredItems = shopItems.filter((item) => {
    if (filterMode === 'needed' && item.isOwned) return false;
    if (filterMode === 'owned' && !item.isOwned) return false;
    if (selectedCategory !== 'all' && item.category !== selectedCategory) return false;
    return true;
  });

  const neededCount = shopItems.filter((i) => !i.isOwned).length;
  const ownedCount = shopItems.filter((i) => i.isOwned).length;

  return (
    <div className="space-y-6">
      {/* Top AI Wardrobe Gap Analysis Card */}
      <div className="bg-gradient-to-r from-amber-900 via-stone-900 to-indigo-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="absolute -right-12 -bottom-12 w-64 h-64 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/20 border border-amber-300/30 text-amber-200 text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>AI 옷장 결공백 진단 &amp; 스마트 스토어</span>
            </div>

            <span className="text-xs text-stone-300 bg-white/10 px-3 py-1 rounded-full backdrop-blur-xs font-semibold">
              소장 옷 {ownedCount}개 · 필요한 옷 {neededCount}개 추천 중
            </span>
          </div>

          <div className="max-w-2xl space-y-1.5">
            <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight">
              {bodyProfile.bodyTypeKorean} 맞춤 필수 보완 스타일
            </h2>
            <p className="text-xs sm:text-sm text-stone-200/90 leading-relaxed">
              현재 보유 중인 상의·데님에 비해 <strong>하체 다리 길이를 극대화할 스커트</strong>와{' '}
              <strong>단정한 로퍼 신발</strong>이 부족합니다. 아래 추천 아이템을 채우면 코디 조합 가능 수가{' '}
              <strong className="text-amber-300">+12가지 이상</strong> 증가합니다!
            </p>
          </div>
        </div>
      </div>

      {/* Filter Mode Control Tabs (Possessed vs Needed) */}
      <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Toggle Owned vs Needed */}
        <div className="flex items-center gap-1.5 bg-stone-100 p-1 rounded-2xl">
          <button
            onClick={() => setFilterMode('all')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              filterMode === 'all'
                ? 'bg-white text-stone-900 shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            전체 ({shopItems.length})
          </button>
          <button
            onClick={() => setFilterMode('needed')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              filterMode === 'needed'
                ? 'bg-amber-500 text-white shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>🛒 필요한 추천 구매 옷 ({neededCount})</span>
          </button>
          <button
            onClick={() => setFilterMode('owned')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              filterMode === 'owned'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <Shirt className="w-3.5 h-3.5" />
            <span>👕 이미 소장한 내 옷 ({ownedCount})</span>
          </button>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1 overflow-x-auto text-xs no-scrollbar">
          {['all', 'top', 'bottom', 'outer', 'shoes'].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-[11px] font-semibold transition-colors cursor-pointer shrink-0 ${
                selectedCategory === cat
                  ? 'bg-stone-900 text-white'
                  : 'bg-stone-50 text-stone-600 hover:bg-stone-100'
              }`}
            >
              {cat === 'all'
                ? '전체 카테고리'
                : cat === 'top'
                ? '상의'
                : cat === 'bottom'
                ? '하의'
                : cat === 'outer'
                ? '아우터'
                : '신발'}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Store Items */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.map((item) => {
          const isAddedToCloset = addedItemIds.includes(item.id) || item.isOwned;

          return (
            <div
              key={item.id}
              className="bg-white rounded-3xl border border-stone-200 shadow-xs hover:shadow-md transition-all overflow-hidden flex flex-col justify-between"
            >
              <div className="space-y-3">
                {/* Image Container with Badges */}
                <div className="relative aspect-4/3 bg-stone-100 overflow-hidden">
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />

                  {/* Owned vs Needed Badge */}
                  <div className="absolute top-3 left-3 flex flex-col gap-1">
                    {item.isOwned ? (
                      <span className="px-2.5 py-1 rounded-full bg-stone-900/90 text-white text-[10px] font-bold backdrop-blur-xs flex items-center gap-1">
                        <CheckCircle className="w-3 h-3 text-emerald-400" />
                        <span>내 옷장에 소장 중</span>
                      </span>
                    ) : (
                      <span className="px-2.5 py-1 rounded-full bg-amber-500 text-white text-[10px] font-extrabold shadow-xs flex items-center gap-1">
                        <ShoppingBag className="w-3 h-3" />
                        <span>AI 추천 보완 옷</span>
                      </span>
                    )}
                  </div>

                  {/* Match Percentage Tag */}
                  <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-white/90 text-indigo-700 font-extrabold text-[11px] shadow-xs backdrop-blur-xs">
                    {item.matchPercentage}% MATCH
                  </div>

                  {/* Wishlist Heart */}
                  <button
                    onClick={() => toggleWishlist(item.id)}
                    className="absolute bottom-3 right-3 w-8 h-8 rounded-full bg-white/80 hover:bg-white text-stone-700 flex items-center justify-center backdrop-blur-xs shadow-xs transition-colors cursor-pointer"
                  >
                    <Heart
                      className={`w-4 h-4 ${
                        item.inWishlist ? 'fill-rose-500 text-rose-500' : ''
                      }`}
                    />
                  </button>
                </div>

                {/* Details Body */}
                <div className="p-4 space-y-2">
                  <div className="space-y-0.5">
                    <span className="text-[10px] font-bold text-stone-400 block uppercase">
                      {item.brand}
                    </span>
                    <h3 className="font-bold text-sm text-stone-900 line-clamp-1">{item.name}</h3>
                  </div>

                  {/* Price */}
                  <div className="flex items-baseline gap-2">
                    <span className="text-base font-extrabold text-stone-900">
                      {item.price.toLocaleString()}원
                    </span>
                    {item.originalPrice && (
                      <span className="text-xs text-stone-400 line-through">
                        {item.originalPrice.toLocaleString()}원
                      </span>
                    )}
                  </div>

                  {/* AI Recommendation Reason */}
                  <div className="p-2.5 rounded-xl bg-indigo-50/70 border border-indigo-100 text-[11px] text-indigo-950 leading-relaxed space-y-0.5">
                    <span className="font-bold text-indigo-900 flex items-center gap-1 text-[10px]">
                      <Sparkles className="w-3 h-3 text-indigo-600" />
                      <span>AI 추천 분석:</span>
                    </span>
                    <p>{item.reasonForRecommendation}</p>
                  </div>
                </div>
              </div>

              {/* Action Footer */}
              <div className="p-4 pt-0">
                {item.isOwned ? (
                  <div className="w-full py-2.5 rounded-xl bg-stone-100 text-stone-600 font-bold text-xs text-center flex items-center justify-center gap-1.5">
                    <CheckCircle className="w-4 h-4 text-emerald-600" />
                    <span>이미 옷장에 등록되어 있는 아이템입니다</span>
                  </div>
                ) : (
                  <button
                    onClick={() => handleBuyAndAddToCloset(item)}
                    disabled={isAddedToCloset}
                    className="w-full py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 disabled:bg-emerald-600 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    {isAddedToCloset ? (
                      <>
                        <CheckCircle className="w-4 h-4" />
                        <span>구매완료! 내 옷장에 바로 추가됨</span>
                      </>
                    ) : (
                      <>
                        <Plus className="w-4 h-4" />
                        <span>구매하기 &amp; 내 옷장에 바로 등록</span>
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
