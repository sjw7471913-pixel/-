import React, { useState } from 'react';
import { ClothingItem, BodyProfile, WeatherData, OutfitRecommendation } from '../types';
import { WeatherWidget } from './WeatherWidget';
import { Sparkles, RefreshCw, Bookmark, Share2, CheckCircle, Shirt, Flame, HelpCircle, ArrowRight } from 'lucide-react';
import { translateCategory } from '../utils/camera';

interface OutfitRecommenderProps {
  closetItems: ClothingItem[];
  bodyProfile: BodyProfile;
  weather: WeatherData;
  setWeather: (w: WeatherData) => void;
  onOpenClothingScan: () => void;
  onShareToFeed: (outfit: OutfitRecommendation) => void;
}

export const OutfitRecommender: React.FC<OutfitRecommenderProps> = ({
  closetItems,
  bodyProfile,
  weather,
  setWeather,
  onOpenClothingScan,
  onShareToFeed
}) => {
  const [occasion, setOccasion] = useState('데일리/일상');
  const [targetStyle, setTargetStyle] = useState('자동 스마트 매칭');
  const [isLoading, setIsLoading] = useState(false);
  const [recommendations, setRecommendations] = useState<OutfitRecommendation[] | null>(null);
  const [savedOutfits, setSavedOutfits] = useState<string[]>([]);
  const [sharedOutfits, setSharedOutfits] = useState<string[]>([]);

  const occasions = ['데일리/일상', '출근/등교룩', '데이트룩', '카페/나들이', '운동/아웃도어', '하객룩/격식'];
  const styles = ['자동 스마트 매칭', '미니멀', '캐주얼', '스트릿', '시티보이', '클래식'];

  const handleGenerateOutfit = async () => {
    setIsLoading(true);

    try {
      const response = await fetch('/api/recommend-outfit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          closetItems,
          bodyProfile,
          weather,
          occasion,
          targetStyle: targetStyle === '자동 스마트 매칭' ? '' : targetStyle
        })
      });

      if (!response.ok) throw new Error('추천 생성에 실패했습니다.');

      const data = await response.json();

      // Hydrate recommended items from actual closet items
      const hydrated: OutfitRecommendation[] = (data.recommendations || []).map((rec: any, idx: number) => {
        const top = closetItems.find((i) => i.id === rec.topItemId) || closetItems.find((i) => i.category === 'top');
        const bottom = closetItems.find((i) => i.id === rec.bottomItemId) || closetItems.find((i) => i.category === 'bottom');
        const outer = closetItems.find((i) => i.id === rec.outerItemId) || closetItems.find((i) => i.category === 'outer');
        const shoes = closetItems.find((i) => i.id === rec.shoesItemId) || closetItems.find((i) => i.category === 'shoes');
        const accessory = closetItems.find((i) => i.id === rec.accessoryItemId) || closetItems.find((i) => i.category === 'accessory');

        return {
          id: rec.id || `rec-${Date.now()}-${idx}`,
          title: rec.title || `${weather.city} ${occasion} 추천 코디`,
          score: rec.score || 96 - idx * 2,
          styleTag: rec.styleTag || targetStyle,
          items: { top, bottom, outer, shoes, accessory },
          weatherReason: rec.weatherReason || `${weather.temp}°C 날씨에 적합한 보온 체감 밸런스입니다.`,
          bodyFitReason: rec.bodyFitReason || `${bodyProfile.bodyTypeKorean} 체형 비율을 최상으로 살려주는 구성입니다.`,
          colorHarmonyReason: rec.colorHarmonyReason || '컬러톤 조합이 세련되고 안정적인 분위기를 선사합니다.',
          createdDate: new Date().toISOString().split('T')[0]
        };
      });

      setRecommendations(hydrated);
    } catch (err) {
      console.error('Error in generating outfit:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleSave = (id: string) => {
    if (savedOutfits.includes(id)) {
      setSavedOutfits(savedOutfits.filter((s) => s !== id));
    } else {
      setSavedOutfits([...savedOutfits, id]);
    }
  };

  return (
    <div className="space-y-6">
      {/* Weather Widget Header */}
      <WeatherWidget weather={weather} setWeather={setWeather} />

      {/* Outfit Controls Box */}
      <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-100 pb-3">
          <div>
            <h3 className="text-base font-bold text-stone-900 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-600" />
              <span>맞춤 코디 시뮬레이터</span>
            </h3>
            <p className="text-xs text-stone-500 mt-0.5">
              내 스캔 옷장({closetItems.length}개)과 {bodyProfile.bodyTypeKorean} 프로필을 연결합니다.
            </p>
          </div>

          <button
            id="btn-generate-outfit-main"
            onClick={handleGenerateOutfit}
            disabled={isLoading || closetItems.length === 0}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold text-xs sm:text-sm hover:from-indigo-700 hover:to-purple-700 shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
          >
            {isLoading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>AI가 코디 조합 중...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>AI 맞춤 코디 추천받기</span>
              </>
            )}
          </button>
        </div>

        {/* TPO & Style Selector */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="text-stone-700 font-bold block mb-1.5">1. 어떤 상황/TPO에 입으시나요?</label>
            <div className="flex flex-wrap gap-1.5">
              {occasions.map((occ) => (
                <button
                  key={occ}
                  type="button"
                  onClick={() => setOccasion(occ)}
                  className={`px-3 py-1.5 rounded-xl font-medium transition-all cursor-pointer ${
                    occasion === occ
                      ? 'bg-stone-900 text-white shadow-xs'
                      : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                  }`}
                >
                  {occ}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-stone-700 font-bold block mb-1.5">2. 원하는 스타일 무드</label>
            <div className="flex flex-wrap gap-1.5">
              {styles.map((st) => (
                <button
                  key={st}
                  type="button"
                  onClick={() => setTargetStyle(st)}
                  className={`px-3 py-1.5 rounded-xl font-medium transition-all cursor-pointer ${
                    targetStyle === st
                      ? 'bg-purple-600 text-white shadow-xs'
                      : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Warning if closet has very few items */}
      {closetItems.length < 3 && (
        <div className="bg-amber-50 border border-amber-200 p-3.5 rounded-2xl flex items-center justify-between text-xs text-amber-900">
          <div className="flex items-center gap-2">
            <Flame className="w-4 h-4 text-amber-600 shrink-0" />
            <span>옷장에 옷이 적습니다. 카테고리별로 스캔해주시면 훨씬 풍성한 코디가 생성됩니다!</span>
          </div>
          <button
            onClick={onOpenClothingScan}
            className="px-3 py-1 rounded-lg bg-amber-600 text-white font-bold hover:bg-amber-700 shrink-0 ml-2"
          >
            옷 스캔하기
          </button>
        </div>
      )}

      {/* Generated Recommendations List */}
      {recommendations ? (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-stone-900 flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-indigo-600" />
              <span>AI가 완성한 스페셜 코디 매칭 ({recommendations.length}개)</span>
            </h3>

            <button
              onClick={handleGenerateOutfit}
              className="text-xs text-stone-500 hover:text-indigo-600 font-semibold flex items-center gap-1"
            >
              <RefreshCw className="w-3.5 h-3.5" /> 다른 코디 조합하기
            </button>
          </div>

          <div className="grid grid-cols-1 gap-6">
            {recommendations.map((rec) => {
              const isSaved = savedOutfits.includes(rec.id);
              const isShared = sharedOutfits.includes(rec.id);

              return (
                <div
                  key={rec.id}
                  className="bg-white rounded-3xl border border-stone-200 shadow-md p-5 sm:p-6 space-y-5 relative overflow-hidden"
                >
                  {/* Score badge & Title Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-100 pb-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-100 text-indigo-800">
                          #{rec.styleTag}
                        </span>
                        <span className="text-xs text-stone-400">· {rec.createdDate}</span>
                      </div>
                      <h4 className="text-lg font-bold text-stone-900">{rec.title}</h4>
                    </div>

                    {/* Compatibility Match Meter */}
                    <div className="flex items-center gap-2 bg-gradient-to-r from-indigo-50 to-purple-50 px-3.5 py-2 rounded-2xl border border-indigo-100/80 shrink-0">
                      <Sparkles className="w-4 h-4 text-indigo-600" />
                      <div>
                        <span className="text-[10px] text-stone-500 font-semibold block uppercase">
                          체형·날씨 궁합
                        </span>
                        <span className="text-sm font-extrabold text-indigo-600">
                          {rec.score}% MATCH
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Items Grid Layout */}
                  <div className="space-y-2">
                    <span className="text-xs font-bold text-stone-700 block">
                      👕 내 옷장 아이템 조합:
                    </span>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                      {rec.items.top && (
                        <div className="p-3 rounded-2xl bg-stone-50 border border-stone-200 text-xs space-y-1">
                          <span className="text-[10px] font-bold text-amber-700 bg-amber-100 px-1.5 py-0.5 rounded">
                            상의
                          </span>
                          <p className="font-bold text-stone-900 line-clamp-1">{rec.items.top.name}</p>
                          <p className="text-[11px] text-stone-500">{rec.items.top.color}</p>
                        </div>
                      )}

                      {rec.items.bottom && (
                        <div className="p-3 rounded-2xl bg-stone-50 border border-stone-200 text-xs space-y-1">
                          <span className="text-[10px] font-bold text-blue-700 bg-blue-100 px-1.5 py-0.5 rounded">
                            하의
                          </span>
                          <p className="font-bold text-stone-900 line-clamp-1">{rec.items.bottom.name}</p>
                          <p className="text-[11px] text-stone-500">{rec.items.bottom.color}</p>
                        </div>
                      )}

                      {rec.items.outer && (
                        <div className="p-3 rounded-2xl bg-stone-50 border border-stone-200 text-xs space-y-1">
                          <span className="text-[10px] font-bold text-stone-700 bg-stone-200 px-1.5 py-0.5 rounded">
                            아우터
                          </span>
                          <p className="font-bold text-stone-900 line-clamp-1">{rec.items.outer.name}</p>
                          <p className="text-[11px] text-stone-500">{rec.items.outer.color}</p>
                        </div>
                      )}

                      {rec.items.shoes && (
                        <div className="p-3 rounded-2xl bg-stone-50 border border-stone-200 text-xs space-y-1">
                          <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded">
                            신발
                          </span>
                          <p className="font-bold text-stone-900 line-clamp-1">{rec.items.shoes.name}</p>
                          <p className="text-[11px] text-stone-500">{rec.items.shoes.color}</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* 3-Point Reasoning Section */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2 text-xs">
                    <div className="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-100 space-y-1">
                      <span className="font-bold text-amber-900 flex items-center gap-1.5">
                        ☀️ 날씨 맞춤 포인트
                      </span>
                      <p className="text-amber-950 leading-relaxed text-[11px]">
                        {rec.weatherReason}
                      </p>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-purple-50/70 border border-purple-100 space-y-1">
                      <span className="font-bold text-purple-900 flex items-center gap-1.5">
                        🧍 체형 비율 보정
                      </span>
                      <p className="text-purple-950 leading-relaxed text-[11px]">
                        {rec.bodyFitReason}
                      </p>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-indigo-50/70 border border-indigo-100 space-y-1">
                      <span className="font-bold text-indigo-900 flex items-center gap-1.5">
                        🎨 색상 &amp; 무드 조화
                      </span>
                      <p className="text-indigo-950 leading-relaxed text-[11px]">
                        {rec.colorHarmonyReason}
                      </p>
                    </div>
                  </div>

                  {/* Actions Bar */}
                  <div className="flex items-center justify-between pt-3 border-t border-stone-100 text-xs">
                    <button
                      onClick={() => toggleSave(rec.id)}
                      className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl font-semibold transition-colors cursor-pointer ${
                        isSaved
                          ? 'bg-amber-100 text-amber-900'
                          : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                      }`}
                    >
                      <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-amber-600 text-amber-600' : ''}`} />
                      <span>{isSaved ? '저장됨' : '북마크 저장'}</span>
                    </button>

                    <button
                      onClick={() => {
                        if (!isShared) {
                          onShareToFeed(rec);
                          setSharedOutfits([...sharedOutfits, rec.id]);
                        }
                      }}
                      className={`flex items-center gap-1.5 px-4 py-2 rounded-xl font-bold transition-all cursor-pointer ${
                        isShared
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs'
                      }`}
                    >
                      <Share2 className="w-4 h-4" />
                      <span>{isShared ? 'OOTD 공유 완료✓' : '친구들과 OOTD 공유하기'}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* Initial Promo State */
        <div className="bg-white rounded-3xl p-8 sm:p-12 text-center border border-stone-200 shadow-xs space-y-4">
          <div className="w-16 h-16 rounded-3xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto shadow-inner">
            <Sparkles className="w-8 h-8" />
          </div>

          <div className="max-w-md mx-auto space-y-1">
            <h3 className="text-lg font-extrabold text-stone-900">
              오늘 무슨 옷 입을지 고민되시나요?
            </h3>
            <p className="text-xs text-stone-500 leading-relaxed">
              상단의 버튼을 클릭하면 AI가 사용자의 <strong>실제 스캔한 옷장 아이템</strong>과{' '}
              <strong>{bodyProfile.bodyTypeKorean}</strong>, 그리고{' '}
              <strong>{weather.city}의 실시간 날씨({weather.temp}°C)</strong>를 종합하여 완벽한 스타일링을 조합해드립니다.
            </p>
          </div>

          <button
            onClick={handleGenerateOutfit}
            disabled={isLoading || closetItems.length === 0}
            className="px-6 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs sm:text-sm shadow-md transition-all inline-flex items-center gap-2 cursor-pointer"
          >
            <Sparkles className="w-4 h-4" />
            <span>AI 맞춤 코디 바로 생성하기</span>
          </button>
        </div>
      )}
    </div>
  );
};
