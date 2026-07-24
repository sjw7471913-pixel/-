export type CategoryType = 'top' | 'bottom' | 'outer' | 'shoes' | 'accessory';

export interface ClothingItem {
  id: string;
  name: string;
  category: CategoryType;
  subCategory: string; // e.g. "후드티", "크롭 티셔츠", "와이드 데님", "카디건"
  color: string; // Color name e.g. "크림 아이보리", "차콜 그레이"
  colorHex: string; // #F5F5DC
  season: ('spring' | 'summer' | 'fall' | 'winter')[];
  styles: string[]; // e.g. ["캐주얼", "스트릿", "미니멀"]
  imageUrl?: string;
  notes?: string;
  favorite?: boolean;
  createdAt: string;
}

export interface BodyProfile {
  bodyType: 'wave' | 'straight' | 'natural' | 'hourglass' | 'rectangle' | 'inverted_triangle' | 'pear';
  bodyTypeKorean: string; // e.g. "웨이브 체형 (상체 슬림, 하체 유연)"
  bodyDescription: string;
  heightCm?: number;
  weightKg?: number;
  personalColor: string; // e.g. "봄 브라이트 / 여쿨 라트"
  preferredFit: string[]; // e.g. ["오버핏", "하이웨스트", "크롭"]
  recommendedSilhouettes: string[]; // e.g. ["A라인 스커트", "하이웨스트 팬츠", "크롭 상의"]
  avoidStyles: string[]; // e.g. ["루즈핏 베스트", "로우라이즈"]
  scannedAt?: string;
}

export interface WeatherData {
  city: string;
  temp: number; // Celsius
  condition: string; // e.g. "맑음", "흐림", "구름조금", "소나기", "쌀쌀한 바람"
  icon: string; // e.g. "Sun", "CloudRain", etc.
  highTemp: number;
  lowTemp: number;
  humidity: number;
  uvIndex: string;
  dressingTip: string;
}

export interface OutfitRecommendation {
  id: string;
  title: string; // e.g. "도시적인 세미 캐주얼 출근룩"
  score: number; // e.g. 96
  styleTag: string; // e.g. "스마트 캐주얼"
  items: {
    top?: ClothingItem;
    bottom?: ClothingItem;
    outer?: ClothingItem;
    shoes?: ClothingItem;
    accessory?: ClothingItem;
  };
  weatherReason: string; // 날씨 맞춤 이유
  bodyFitReason: string; // 체형 보정 이유
  colorHarmonyReason: string; // 색상 조화 포인트
  createdDate: string;
}

export interface PostComment {
  id: string;
  authorName: string;
  authorAvatar: string;
  content: string;
  createdAt: string;
}

export interface UserAccount {
  isLoggedIn: boolean;
  name: string;
  email: string;
  avatarUrl: string;
  preferredStyles: string[];
  styleGoals?: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
  suggestedItems?: ClothingItem[];
  suggestedShopItems?: ShopItem[];
}

export interface ShopItem {
  id: string;
  name: string;
  category: CategoryType;
  subCategory: string;
  price: number;
  originalPrice?: number;
  imageUrl: string;
  brand: string;
  reasonForRecommendation: string;
  matchPercentage: number;
  isOwned?: boolean; // 내 옷장 소장 여부 vs 필요한 추천 구매 옷
  purchaseUrl?: string;
  inWishlist?: boolean;
}

export interface OotdPost {
  id: string;
  authorName: string;
  authorAvatar: string;
  authorBodyType?: string;
  outfitTitle: string;
  description: string;
  imageUrl?: string;
  itemsUsed: { category: string; name: string }[];
  likesCount: number;
  isLiked?: boolean;
  comments: PostComment[];
  weatherTag: string; // e.g. "서울 22°C 맑음"
  locationTag?: string;
  createdAt: string;
  pollOptionA?: string;
  pollOptionB?: string;
  pollVotesA?: number;
  pollVotesB?: number;
  userVoted?: 'A' | 'B';
}
