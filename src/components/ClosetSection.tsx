import React, { useState } from 'react';
import { ClothingItem, CategoryType } from '../types';
import { getCategoryBadgeColor, translateCategory } from '../utils/camera';
import { Search, Plus, Star, Trash2, Camera, Shirt, Filter, Tag, Calendar, Sparkles } from 'lucide-react';

interface ClosetSectionProps {
  items: ClothingItem[];
  onToggleFavorite: (id: string) => void;
  onDeleteItem: (id: string) => void;
  onOpenScanModal: () => void;
  onAddItemManually: (item: ClothingItem) => void;
}

export const ClosetSection: React.FC<ClosetSectionProps> = ({
  items,
  onToggleFavorite,
  onDeleteItem,
  onOpenScanModal,
  onAddItemManually
}) => {
  const [selectedCategory, setSelectedCategory] = useState<CategoryType | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItem, setSelectedItem] = useState<ClothingItem | null>(null);
  const [showManualAddModal, setShowManualAddModal] = useState(false);

  // Manual Add Form State
  const [newItemName, setNewItemName] = useState('');
  const [newItemCategory, setNewItemCategory] = useState<CategoryType>('top');
  const [newItemSubCategory, setNewItemSubCategory] = useState('');
  const [newItemColor, setNewItemColor] = useState('크림 화이트');
  const [newItemColorHex, setNewItemColorHex] = useState('#FDFBF7');
  const [newItemStyles, setNewItemStyles] = useState('캐주얼, 데일리');

  const categories: { key: CategoryType | 'all'; label: string }[] = [
    { key: 'all', label: '전체 보기' },
    { key: 'top', label: '상의' },
    { key: 'bottom', label: '하의' },
    { key: 'outer', label: '아우터' },
    { key: 'shoes', label: '신발' },
    { key: 'accessory', label: '잡화/액세서리' }
  ];

  const filteredItems = items.filter((item) => {
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesQuery =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.subCategory.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.color.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.styles.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesQuery;
  });

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemName.trim()) return;

    const newItem: ClothingItem = {
      id: `manual-${Date.now()}`,
      name: newItemName.trim(),
      category: newItemCategory,
      subCategory: newItemSubCategory || '기타',
      color: newItemColor,
      colorHex: newItemColorHex,
      season: ['spring', 'summer', 'fall', 'winter'],
      styles: newItemStyles.split(',').map((s) => s.trim()).filter(Boolean),
      favorite: false,
      createdAt: new Date().toISOString().split('T')[0]
    };

    onAddItemManually(newItem);
    setShowManualAddModal(false);
    setNewItemName('');
    setNewItemSubCategory('');
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Control Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <Shirt className="w-5 h-5 text-indigo-600" />
            <h2 className="text-xl font-bold text-stone-900">내 디지털 옷장</h2>
            <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-indigo-100 text-indigo-800">
              총 {items.length}개 의류
            </span>
          </div>
          <p className="text-xs text-stone-500 mt-1">
            카메라로 스캔하여 자동 정돈된 옷장입니다. AI가 옷의 핏, 세부 종류, 색상을 학습하여 코디를 조합합니다.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            id="btn-open-scan-clothing-main"
            onClick={onOpenScanModal}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold bg-indigo-600 text-white hover:bg-indigo-700 transition-colors shadow-sm cursor-pointer"
          >
            <Camera className="w-4 h-4" />
            <span>카메라로 옷 추가</span>
          </button>

          <button
            id="btn-add-manual"
            onClick={() => setShowManualAddModal(true)}
            className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-medium bg-stone-100 text-stone-700 hover:bg-stone-200 border border-stone-200 transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>직접 등록</span>
          </button>
        </div>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Category Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat.key}
              onClick={() => setSelectedCategory(cat.key)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategory === cat.key
                  ? 'bg-stone-900 text-white shadow-xs'
                  : 'bg-white text-stone-600 hover:bg-stone-100 border border-stone-200'
              }`}
            >
              {cat.label}
              {cat.key !== 'all' && (
                <span className="ml-1 text-[10px] opacity-70">
                  ({items.filter((i) => i.category === cat.key).length})
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-64 shrink-0">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
          <input
            type="text"
            placeholder="아이템명, 색상, 스타일 검색..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-white border border-stone-200 rounded-xl text-xs text-stone-800 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
          />
        </div>
      </div>

      {/* Items Grid */}
      {filteredItems.length === 0 ? (
        <div className="bg-white rounded-2xl p-10 text-center border border-dashed border-stone-300">
          <div className="w-12 h-12 rounded-full bg-stone-100 text-stone-400 flex items-center justify-center mx-auto mb-3">
            <Shirt className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-stone-800">등록된 옷이 없습니다</h3>
          <p className="text-xs text-stone-500 mt-1 max-w-sm mx-auto">
            상단 버튼을 눌러 카메라로 옷을 스캔하거나 직접 입력해 옷장을 채워보세요.
          </p>
          <button
            onClick={onOpenScanModal}
            className="mt-4 px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-700 transition-colors inline-flex items-center gap-2"
          >
            <Camera className="w-4 h-4" />
            <span>첫 옷 스캔하러 가기</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3.5">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              onClick={() => setSelectedItem(item)}
              className="group bg-white rounded-2xl border border-stone-200 hover:border-indigo-300 p-3.5 flex flex-col justify-between transition-all duration-200 hover:shadow-md cursor-pointer relative"
            >
              {/* Category & Favorite badge */}
              <div className="flex items-center justify-between gap-2 mb-2.5">
                <span
                  className={`text-[11px] font-semibold px-2 py-0.5 rounded-md border ${getCategoryBadgeColor(
                    item.category
                  )}`}
                >
                  {translateCategory(item.category)} · {item.subCategory}
                </span>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleFavorite(item.id);
                  }}
                  className="text-stone-300 hover:text-amber-400 p-1 rounded-full transition-colors"
                >
                  <Star
                    className={`w-4 h-4 ${
                      item.favorite ? 'text-amber-400 fill-amber-400' : ''
                    }`}
                  />
                </button>
              </div>

              {/* Color indicator visual box */}
              <div className="h-20 rounded-xl bg-stone-50 border border-stone-100 flex items-center justify-center my-1 relative overflow-hidden group-hover:scale-[1.02] transition-transform">
                <div
                  className="w-10 h-10 rounded-full shadow-inner border border-stone-300/60"
                  style={{ backgroundColor: item.colorHex || '#EEEEEE' }}
                />
                <span className="text-[11px] font-medium text-stone-600 absolute bottom-1.5 px-2 py-0.5 bg-white/80 rounded-md backdrop-blur-xs">
                  {item.color}
                </span>
              </div>

              {/* Item Details */}
              <div className="mt-2">
                <h4 className="text-xs sm:text-sm font-bold text-stone-900 group-hover:text-indigo-600 line-clamp-1 transition-colors">
                  {item.name}
                </h4>

                {/* Style tags */}
                <div className="flex flex-wrap gap-1 mt-2">
                  {item.styles.slice(0, 2).map((st, i) => (
                    <span
                      key={i}
                      className="text-[10px] text-stone-600 bg-stone-100 px-1.5 py-0.5 rounded-md"
                    >
                      #{st}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Item Detail Modal */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 relative shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-start justify-between border-b border-stone-100 pb-3">
              <div>
                <span className={`text-xs font-semibold px-2 py-0.5 rounded-md border ${getCategoryBadgeColor(selectedItem.category)}`}>
                  {translateCategory(selectedItem.category)}
                </span>
                <h3 className="text-lg font-bold text-stone-900 mt-1">{selectedItem.name}</h3>
              </div>
              <button
                onClick={() => setSelectedItem(null)}
                className="text-stone-400 hover:text-stone-700 text-lg font-bold p-1"
              >
                ✕
              </button>
            </div>

            {/* Visual Color display */}
            <div className="flex items-center gap-3 bg-stone-50 p-3 rounded-2xl border border-stone-100">
              <div
                className="w-12 h-12 rounded-xl shadow-xs border border-stone-300"
                style={{ backgroundColor: selectedItem.colorHex }}
              />
              <div>
                <p className="text-xs font-medium text-stone-500">주요 메인 색상</p>
                <p className="text-sm font-bold text-stone-900">{selectedItem.color} ({selectedItem.colorHex})</p>
              </div>
            </div>

            {/* Sub details */}
            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between py-1 border-b border-stone-100">
                <span className="text-stone-500">세부 분류</span>
                <span className="font-semibold text-stone-800">{selectedItem.subCategory}</span>
              </div>
              <div className="flex items-center justify-between py-1 border-b border-stone-100">
                <span className="text-stone-500">스타일 태그</span>
                <div className="flex gap-1">
                  {selectedItem.styles.map((s, i) => (
                    <span key={i} className="bg-indigo-50 text-indigo-700 font-medium px-1.5 py-0.5 rounded">
                      #{s}
                    </span>
                  ))}
                </div>
              </div>
              {selectedItem.notes && (
                <div className="pt-1">
                  <span className="text-stone-500 block mb-1">핏감 / 사용자 메모</span>
                  <p className="p-2.5 bg-stone-50 rounded-xl text-stone-700 italic border border-stone-100">
                    "{selectedItem.notes}"
                  </p>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-stone-100">
              <button
                type="button"
                onClick={() => {
                  onDeleteItem(selectedItem.id);
                  setSelectedItem(null);
                }}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-rose-600 bg-rose-50 hover:bg-rose-100 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                <span>아이템 삭제</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedItem(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-stone-900 text-white hover:bg-stone-800 transition-colors"
              >
                닫기
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Manual Add Item Modal */}
      {showManualAddModal && (
        <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <form
            onSubmit={handleManualSubmit}
            className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <h3 className="text-base font-bold text-stone-900">직접 옷 아이템 등록</h3>
              <button
                type="button"
                onClick={() => setShowManualAddModal(false)}
                className="text-stone-400 hover:text-stone-700 font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-stone-700 font-semibold mb-1">의류 이름 *</label>
                <input
                  type="text"
                  required
                  placeholder="예: 와이드 핏 카키 핀턱 팬츠"
                  value={newItemName}
                  onChange={(e) => setNewItemName(e.target.value)}
                  className="w-full px-3 py-2 border border-stone-200 rounded-xl focus:ring-2 focus:ring-indigo-500/30 outline-none text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-stone-700 font-semibold mb-1">카테고리</label>
                  <select
                    value={newItemCategory}
                    onChange={(e) => setNewItemCategory(e.target.value as CategoryType)}
                    className="w-full px-2.5 py-2 border border-stone-200 rounded-xl outline-none text-xs bg-white"
                  >
                    <option value="top">상의</option>
                    <option value="bottom">하의</option>
                    <option value="outer">아우터</option>
                    <option value="shoes">신발</option>
                    <option value="accessory">잡화/액세서리</option>
                  </select>
                </div>

                <div>
                  <label className="block text-stone-700 font-semibold mb-1">세부 종류</label>
                  <input
                    type="text"
                    placeholder="예: 후드티, 슬랙스"
                    value={newItemSubCategory}
                    onChange={(e) => setNewItemSubCategory(e.target.value)}
                    className="w-full px-3 py-2 border border-stone-200 rounded-xl outline-none text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-stone-700 font-semibold mb-1">대표 색상명</label>
                  <input
                    type="text"
                    value={newItemColor}
                    onChange={(e) => setNewItemColor(e.target.value)}
                    className="w-full px-3 py-2 border border-stone-200 rounded-xl outline-none text-xs"
                  />
                </div>

                <div>
                  <label className="block text-stone-700 font-semibold mb-1">컬러 픽</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={newItemColorHex}
                      onChange={(e) => setNewItemColorHex(e.target.value)}
                      className="w-9 h-9 rounded-lg border border-stone-200 cursor-pointer p-0.5"
                    />
                    <span className="text-[11px] font-mono text-stone-600">{newItemColorHex}</span>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-stone-700 font-semibold mb-1">스타일 태그 (쉼표 구분)</label>
                <input
                  type="text"
                  placeholder="캐주얼, 데일리, 스트릿"
                  value={newItemStyles}
                  onChange={(e) => setNewItemStyles(e.target.value)}
                  className="w-full px-3 py-2 border border-stone-200 rounded-xl outline-none text-xs"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowManualAddModal(false)}
                className="px-3.5 py-2 rounded-xl text-stone-600 hover:bg-stone-100 text-xs font-semibold"
              >
                취소
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold"
              >
                옷장에 추가하기
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
