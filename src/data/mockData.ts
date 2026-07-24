import { ClothingItem, BodyProfile, WeatherData, OotdPost } from '../types';

export const INITIAL_CLOTHING_ITEMS: ClothingItem[] = [
  {
    id: 'item-1',
    name: '오버핏 오프화이트 라운드 니트',
    category: 'top',
    subCategory: '니트/스웨터',
    color: '오프화이트',
    colorHex: '#F8F6F0',
    season: ['spring', 'fall', 'winter'],
    styles: ['미니멀', '캐주얼', '데일리'],
    favorite: true,
    notes: '소매 감성이 예쁘고 화사한 밝은 톤 니트',
    createdAt: '2026-07-20'
  },
  {
    id: 'item-2',
    name: '크롭 빈티지 그레이 후드티',
    category: 'top',
    subCategory: '후드티',
    color: '차콜 그레이',
    colorHex: '#4A4A4A',
    season: ['spring', 'fall', 'winter'],
    styles: ['스트릿', '스포티', '캐주얼'],
    favorite: false,
    notes: '허리 라인을 살려주는 크롭핏',
    createdAt: '2026-07-21'
  },
  {
    id: 'item-3',
    name: '하이웨스트 스트레이트 중청 데님',
    category: 'bottom',
    subCategory: '데님 팬츠',
    color: '인디고 블루',
    colorHex: '#2B4C7E',
    season: ['spring', 'summer', 'fall', 'winter'],
    styles: ['캐주얼', '미니멀', '시티보이'],
    favorite: true,
    notes: '다리가 길어 보이는 스트레이트핏 하이웨스트 데님',
    createdAt: '2026-07-18'
  },
  {
    id: 'item-4',
    name: '세미 와이드 핀턱 블랙 슬랙스',
    category: 'bottom',
    subCategory: '슬랙스',
    color: '블랙',
    colorHex: '#1A1A1A',
    season: ['spring', 'summer', 'fall', 'winter'],
    styles: ['포멀', '스마트 캐주얼', '출근룩'],
    favorite: true,
    notes: '핀턱 주름으로 핏이 자연스럽고 길어 보임',
    createdAt: '2026-07-19'
  },
  {
    id: 'item-5',
    name: '클래식 베이지 트렌치코트',
    category: 'outer',
    subCategory: '트렌치코트',
    color: '클래식 베이지',
    colorHex: '#D2B48C',
    season: ['spring', 'fall'],
    styles: ['클래식', '스마트 캐주얼', '출근룩'],
    favorite: true,
    notes: '어깨 라인이 둥글게 떨어져 무드 연출 최고',
    createdAt: '2026-07-15'
  },
  {
    id: 'item-6',
    name: '숏 패딩 카키 재킷',
    category: 'outer',
    subCategory: '점퍼/패딩',
    color: '카키',
    colorHex: '#4B5320',
    season: ['winter'],
    styles: ['스트릿', '스포티', '캐주얼'],
    favorite: false,
    createdAt: '2026-07-10'
  },
  {
    id: 'item-7',
    name: '화이트 레더 로우 스니커즈',
    category: 'shoes',
    subCategory: '스니커즈',
    color: '화이트',
    colorHex: '#FFFFFF',
    season: ['spring', 'summer', 'fall', 'winter'],
    styles: ['미니멀', '캐주얼', '데일리'],
    favorite: true,
    notes: '모든 코디에 매칭하기 쉬운 만능 신발',
    createdAt: '2026-07-12'
  },
  {
    id: 'item-8',
    name: '블랙 체인 미니 숄더백',
    category: 'accessory',
    subCategory: '가방',
    color: '블랙',
    colorHex: '#222222',
    season: ['spring', 'summer', 'fall', 'winter'],
    styles: ['데이트룩', '포멀', '페미닌'],
    favorite: true,
    createdAt: '2026-07-22'
  }
];

export const INITIAL_BODY_PROFILE: BodyProfile = {
  bodyType: 'wave',
  bodyTypeKorean: '웨이브 체형 (상체 슬림, 허리선 강조 추천)',
  bodyDescription: '상체가 상대적으로 슬림하고 목선과 상체 라인이 섬세합니다. 허리선을 포인트를 주거나 하이웨스트 라인을 활용하면 다리가 길어보이고 매력적인 비율이 완성됩니다.',
  heightCm: 165,
  weightKg: 52,
  personalColor: '여름 쿨 둔/봄 브라이트',
  preferredFit: ['하이웨스트 팬츠', '크롭 상의', '스퀘어넥/V넥', '벨티드 아우터'],
  recommendedSilhouettes: ['허리선을 잡아주는 크롭 상의', '하이웨스트 스트레이트/A라인 팬츠', '라인이 잡힌 트렌치 코트'],
  avoidStyles: ['체형을 가리는 무겁고 기장이 긴 오버핏 루즈 베스트', '로우 라이즈 팬츠'],
  scannedAt: '2026-07-24'
};

export const CITIES_WEATHER: Record<string, WeatherData> = {
  '서울': {
    city: '서울',
    temp: 23,
    condition: '맑고 선선함',
    icon: 'Sun',
    highTemp: 26,
    lowTemp: 18,
    humidity: 52,
    uvIndex: '보통',
    dressingTip: '아침저녁으로는 쌀쌀할 수 있으니 가벼운 가디건이나 코트 레이어드가 적합합니다.'
  },
  '부산': {
    city: '부산',
    temp: 25,
    condition: '구름 조금, 해안바람',
    icon: 'CloudSun',
    highTemp: 27,
    lowTemp: 20,
    humidity: 65,
    uvIndex: '높음',
    dressingTip: '바람이 불어 쾌적하며, 얇은 긴소매나 상의에 데님 팬츠 조합을 추천합니다.'
  },
  '제주': {
    city: '제주',
    temp: 26,
    condition: '화창함',
    icon: 'Sun',
    highTemp: 28,
    lowTemp: 21,
    humidity: 60,
    uvIndex: '매우 높음',
    dressingTip: '햇빛이 강하므로 모자나 선글라스 액세서리와 함께 밝은 톤 반소매/얇은 상의가 잘 어울립니다.'
  },
  '도쿄': {
    city: '도쿄',
    temp: 21,
    condition: '소나기 약간',
    icon: 'CloudRain',
    highTemp: 23,
    lowTemp: 17,
    humidity: 78,
    uvIndex: '낮음',
    dressingTip: '비 소식이 있으므로 발수가 잘 되는 아우터나 어두운 컬러 스니커즈를 권장합니다.'
  },
  '뉴욕': {
    city: '뉴욕',
    temp: 18,
    condition: '쌀쌀한 바람',
    icon: 'Wind',
    highTemp: 20,
    lowTemp: 12,
    humidity: 45,
    uvIndex: '보통',
    dressingTip: '도심 바람이 차가울 수 있어 트렌치코트나 스웨터 착용이 필수입니다.'
  }
};

export const INITIAL_USER_ACCOUNT = {
  isLoggedIn: true,
  name: '김패션 (Kim Fashion)',
  email: 'fashion.kim@aifit.com',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  preferredStyles: ['미니멀', '스마트 캐주얼', '크롭/하이웨스트'],
  styleGoals: '내 체형 장점(슬림한 허리 라인)을 살리고 출근과 주말 모임 모두 커버하는 세련된 착장 완성'
};

export const INITIAL_CHAT_MESSAGES = [
  {
    id: 'msg-1',
    sender: 'ai' as const,
    text: '안녕하세요, Kim님! 저는 당신의 퍼스널 AI 패션 컨설턴트입니다. 👗✨\n\n현재 고객님의 [웨이브 체형 프로필]과 [스캔 옷장 8개 아이템]을 모두 파악하고 있어요.\n\n오늘 어떤 코디 고민이나 스타일에 대해 이야기해볼까요?\n• "오늘 소개팅에 어떤 옷 조합이 좋을까?"\n• "가지고 있는 트렌치코트에 어울리는 다른 하의 추천해줘"\n• "요즘 내 옷장에 부족해서 새로 구매하면 좋을 옷이 뭐야?"',
    timestamp: '방금 전'
  }
];

export const INITIAL_SHOP_ITEMS = [
  {
    id: 'shop-1',
    name: '퍼스널 핏 하이웨스트 언발란스 스커트',
    category: 'bottom' as const,
    subCategory: '스커트',
    price: 49000,
    originalPrice: 65000,
    imageUrl: 'https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?w=500&auto=format&fit=crop&q=80',
    brand: 'AIFIT STUDIO SELECT',
    reasonForRecommendation: '고객님의 웨이브 체형의 다리를 가장 길어보이게 만들어주는 필수 스커트입니다. 소장하신 [오프화이트 니트] 및 [블랙 가방]과 100% 코디 매칭됩니다.',
    matchPercentage: 99,
    isOwned: false, // 필요한 옷
    purchaseUrl: 'https://example.com/item/1',
    inWishlist: false
  },
  {
    id: 'shop-2',
    name: '실키 라운드 크롭 블라우스 (소프트 핑크)',
    category: 'top' as const,
    subCategory: '블라우스',
    price: 38000,
    originalPrice: 48000,
    imageUrl: 'https://images.unsplash.com/photo-1604176354204-9268737828e4?w=500&auto=format&fit=crop&q=80',
    brand: 'MOOD & COLOR',
    reasonForRecommendation: '여름 쿨톤 / 봄 브라이트 퍼스널 컬러에 화사함을 더해주는 상의입니다. 소장하신 [하이웨스트 데님]과 매칭 시 데이트룩이 완성됩니다.',
    matchPercentage: 97,
    isOwned: false, // 필요한 옷
    purchaseUrl: 'https://example.com/item/2',
    inWishlist: true
  },
  {
    id: 'shop-3',
    name: '소프트 보더 크롭 벨티드 자켓',
    category: 'outer' as const,
    subCategory: '자켓',
    price: 89000,
    originalPrice: 119000,
    imageUrl: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=500&auto=format&fit=crop&q=80',
    brand: 'URBAN MINIMAL',
    reasonForRecommendation: '출근룩 및 포멀한 자리에 아우터가 부족한 고객님의 옷장을 보완해주는 1순위 추천 자켓입니다.',
    matchPercentage: 96,
    isOwned: false, // 필요한 옷
    purchaseUrl: 'https://example.com/item/3',
    inWishlist: false
  },
  {
    id: 'shop-4',
    name: '오버핏 오프화이트 라운드 니트',
    category: 'top' as const,
    subCategory: '니트',
    price: 52000,
    imageUrl: 'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=500&auto=format&fit=crop&q=80',
    brand: 'DAILY BASIC',
    reasonForRecommendation: '이미 스캔하여 [내 옷장에 소장 중인 아이템]입니다.',
    matchPercentage: 100,
    isOwned: true, // 이미 보유
    inWishlist: false
  },
  {
    id: 'shop-5',
    name: '클래식 베이지 트렌치코트',
    category: 'outer' as const,
    subCategory: '트렌치코트',
    price: 139000,
    imageUrl: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=500&auto=format&fit=crop&q=80',
    brand: 'CLASSIC HERITAGE',
    reasonForRecommendation: '이미 스캔하여 [내 옷장에 소장 중인 아이템]입니다.',
    matchPercentage: 100,
    isOwned: true, // 이미 보유
    inWishlist: false
  },
  {
    id: 'shop-6',
    name: '레더 청키 플랫 로퍼 (딥 차콜)',
    category: 'shoes' as const,
    subCategory: '로퍼',
    price: 64000,
    originalPrice: 79000,
    imageUrl: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=500&auto=format&fit=crop&q=80',
    brand: 'SHOES LAB',
    reasonForRecommendation: '스니커즈 외에 단정한 로퍼 구두가 없어, 단정한 슬랙스와의 조합을 위해 필요한 아이템입니다.',
    matchPercentage: 94,
    isOwned: false, // 필요한 옷
    purchaseUrl: 'https://example.com/item/6',
    inWishlist: false
  }
];

export const INITIAL_OOTD_POSTS: OotdPost[] = [
  {
    id: 'post-1',
    authorName: '지민 스타일 (Jimin)',
    authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    authorBodyType: '웨이브 체형 (164cm)',
    outfitTitle: '서울 가을 입구, 트렌치코트 스마트 출근룩 ✨',
    description: 'AI 핏코디가 추천해준 베이지 트렌치 x 하이웨스트 데님 조합! 허리선을 벨트로 살짝 잡아주니까 웨이브 체형 단점이 완벽히 커버돼요 핏 대만족!!',
    imageUrl: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&auto=format&fit=crop&q=80',
    itemsUsed: [
      { category: '아우터', name: '클래식 베이지 트렌치코트' },
      { category: '상의', name: '오프화이트 라운드 니트' },
      { category: '하의', name: '하이웨스트 데님' },
      { category: '신발', name: '화이트 스니커즈' }
    ],
    likesCount: 34,
    isLiked: true,
    weatherTag: '서울 23°C 맑음',
    locationTag: '성수동 성수카페거리',
    createdAt: '2시간 전',
    comments: [
      {
        id: 'c1',
        authorName: '민서_Daily',
        authorAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&auto=format&fit=crop&q=80',
        content: '트렌치 핏 너무 예쁜데요! 어디 거인가요?',
        createdAt: '1시간 전'
      },
      {
        id: 'c2',
        authorName: 'AI 코디 매니저',
        authorAvatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=100&auto=format&fit=crop&q=80',
        content: '체형 보정 점수 98점 코디입니다! 하이웨스트 데님 덕분에 다리 비율이 완벽해 보여요 👍',
        createdAt: '30분 전'
      }
    ]
  },
  {
    id: 'post-2',
    authorName: '현우 (Hyunwoo)',
    authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    authorBodyType: '스트레이트 체형 (178cm)',
    outfitTitle: '오늘 데이트 어떤 코디가 더 나을까요? 투표해주세요! 🗳️',
    description: '오늘 저녁 한남동 데이트인데 AI가 두 가지 선택지를 제시해줬어요. 여러분의 선택은?',
    imageUrl: 'https://images.unsplash.com/photo-1488161628813-04466f872be2?w=800&auto=format&fit=crop&q=80',
    itemsUsed: [
      { category: '상의', name: '차콜 크롭 후드 vs 브라운 니트' },
      { category: '하의', name: '블랙 핀턱 슬랙스' }
    ],
    likesCount: 19,
    isLiked: false,
    weatherTag: '서울 21°C',
    locationTag: '한남동',
    createdAt: '4시간 전',
    pollOptionA: 'A. 단정하고 세련된 브라운 니트 + 슬랙스',
    pollOptionB: 'B. 힙하고 편안한 차콜 후드 + 슬랙스',
    pollVotesA: 28,
    pollVotesB: 12,
    userVoted: 'A',
    comments: [
      {
        id: 'c3',
        authorName: '소희',
        authorAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80',
        content: '데이트엔 당연히 A 니트죠!! 무드가 대박입니다',
        createdAt: '3시간 전'
      }
    ]
  }
];
