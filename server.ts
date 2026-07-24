import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Body parser limit for camera captured base64 images
  app.use(express.json({ limit: '15mb' }));

  // Initialize Gemini AI Client lazily or safely
  const getAi = () => {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.warn('GEMINI_API_KEY is not set in environment.');
    }
    return new GoogleGenAI({
      apiKey: apiKey || '',
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build'
        }
      }
    });
  };

  // API 1: Scan Clothing Item with Gemini Vision
  app.post('/api/scan-clothing', async (req, res) => {
    try {
      const { imageBase64, userNote } = req.body;
      const ai = getAi();

      if (!process.env.GEMINI_API_KEY) {
        // Fallback mock scan if API key is not yet set
        return res.json({
          name: userNote || 'AI 스캔 크롭 니트',
          category: 'top',
          subCategory: '니트',
          color: '크림 아이보리',
          colorHex: '#FDFBF7',
          season: ['spring', 'fall', 'winter'],
          styles: ['캐주얼', '미니멀'],
          notes: '소매 감성이 돋보이는 부드러운 소재'
        });
      }

      const parts: any[] = [];
      if (imageBase64) {
        // Handle both data URI and raw base64
        const cleanBase64 = imageBase64.includes(';base64,')
          ? imageBase64.split(';base64,')[1]
          : imageBase64;
        const mimeType = imageBase64.includes('data:')
          ? imageBase64.split(';')[0].replace('data:', '')
          : 'image/jpeg';

        parts.push({
          inlineData: {
            mimeType: mimeType || 'image/jpeg',
            data: cleanBase64
          }
        });
      }

      const promptText = `
이 이미지에 있는 의류/잡화를 분석하여 디지털 옷장 데이터를 작성하세요.
${userNote ? `추가 메모: ${userNote}` : ''}

다음 항목을 정확히 추출하세요:
1. name: 한국어 제품 특성을 살린 짧은 이름 (예: '하이웨스트 스트레이트 중청 데님', '오버핏 오프화이트 라운드 니트', '클래식 베이지 트렌치코트')
2. category: 'top' (상의), 'bottom' (하의), 'outer' (아우터), 'shoes' (신발), 'accessory' (잡화/액세서리) 중 하나
3. subCategory: 세부 종목 (예: 후드티, 니트, 맨투맨, 슬랙스, 데님팬츠, 트렌치코트, 스니커즈, 가방, 모자)
4. color: 주요 색상 한국어 이름 (예: '차콜 그레이', '크림 베이지', '인디고 블루')
5. colorHex: 대표 색상의 6자리 HEX 코드 (예: '#2B4C7E')
6. season: 알맞은 계절 배열 (['spring', 'summer', 'fall', 'winter'] 중 선택)
7. styles: 분위기/스타일 태그 2~3개 (예: ['캐주얼', '스트릿', '미니멀', '출근룩', '포멀', '스포티', '데이트룩'])
8. notes: 옷의 주요 특징, 핏감, 소재에 대한 짧은 1문장 요약
`;

      parts.push({ text: promptText });

      const response = await ai.models.generateContent({
        model: 'gemini-3.6-flash',
        contents: { parts },
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              name: { type: Type.STRING },
              category: { type: Type.STRING },
              subCategory: { type: Type.STRING },
              color: { type: Type.STRING },
              colorHex: { type: Type.STRING },
              season: {
                type: Type.ARRAY,
                items: { type: Type.STRING }
              },
              styles: {
                type: Type.ARRAY,
                items: { type: Type.STRING }
              },
              notes: { type: Type.STRING }
            },
            required: ['name', 'category', 'subCategory', 'color', 'colorHex', 'season', 'styles', 'notes']
          }
        }
      });

      const parsed = JSON.parse(response.text || '{}');
      return res.json(parsed);
    } catch (err: any) {
      console.error('Error in clothing scan:', err);
      res.status(500).json({ error: '의류 분석 중 오류가 발생했습니다: ' + (err.message || 'Unknown error') });
    }
  });

  // API 2: Scan Body & Personal Style with Gemini Vision
  app.post('/api/scan-body', async (req, res) => {
    try {
      const { imageBase64, userNotes } = req.body;
      const ai = getAi();

      if (!process.env.GEMINI_API_KEY) {
        return res.json({
          bodyType: 'wave',
          bodyTypeKorean: '웨이브 체형 (상체 슬림, 허리선 강조)',
          bodyDescription: '상체가 상대적으로 유연하고 슬림하며, 목선과 어깨 라인이 섬세합니다. 허리선 강조 시 다리가 한층 길어 보입니다.',
          personalColor: '여름 쿨톤 / 봄 브라이트',
          preferredFit: ['크롭핏 상의', '하이웨스트 데님/팬츠', 'A라인 스커트', 'V넥/스퀘어넥'],
          recommendedSilhouettes: ['허리 라인을 잡아주는 크롭핏', '하이웨스트 스트레이트 팬츠', '벨티드 트렌치코트'],
          avoidStyles: ['체형을 가리는 루즈한 긴 어깨핏 베스트', '로우라이즈 하의']
        });
      }

      const parts: any[] = [];
      if (imageBase64) {
        const cleanBase64 = imageBase64.includes(';base64,')
          ? imageBase64.split(';base64,')[1]
          : imageBase64;
        const mimeType = imageBase64.includes('data:')
          ? imageBase64.split(';')[0].replace('data:', '')
          : 'image/jpeg';

        parts.push({
          inlineData: {
            mimeType: mimeType || 'image/jpeg',
            data: cleanBase64
          }
        });
      }

      const promptText = `
당신은 전문 패션 퍼스널 스타일리스트 및 체형 분석 전문가입니다.
제출된 이미지(또는 사용자의 체형 특징)를 바탕으로 체형 및 퍼스널 스타일 가이드를 분석하세요.
${userNotes ? `사용자 참고 사항: ${userNotes}` : ''}

분석 결과를 다음 JSON 구조로 정확히 작성해 주세요:
1. bodyType: 'wave' | 'straight' | 'natural' | 'hourglass' | 'rectangle' | 'inverted_triangle' | 'pear' 중 가장 적합한 하나
2. bodyTypeKorean: 한국어 체형 설명 (예: '웨이브 체형 (상체 슬림, 허리선 강조)', '스트레이트 체형 (입체적 핏, 클래식 핏)', '내추럴 체형 (골격미, 오버핏 잘 어울림)')
3. bodyDescription: 2~3문장의 따뜻하고 전문적인 체형 분석설명 (장점과 실루엣 매력 강조)
4. personalColor: 어울리는 대표 퍼스널 컬러 매칭 (예: '봄 브라이트 / 여쿨 라이트')
5. preferredFit: 체형 보정에 가장 추천하는 핏/스타일 요소 4개 배열
6. recommendedSilhouettes: 시각적으로 비율을 극대화하는 아이템 추천 3개 배열
7. avoidStyles: 피하면 좋은 실루엣 또는 디자인 요인 2개 배열
`;

      parts.push({ text: promptText });

      const response = await ai.models.generateContent({
        model: 'gemini-3.6-flash',
        contents: { parts },
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              bodyType: { type: Type.STRING },
              bodyTypeKorean: { type: Type.STRING },
              bodyDescription: { type: Type.STRING },
              personalColor: { type: Type.STRING },
              preferredFit: {
                type: Type.ARRAY,
                items: { type: Type.STRING }
              },
              recommendedSilhouettes: {
                type: Type.ARRAY,
                items: { type: Type.STRING }
              },
              avoidStyles: {
                type: Type.ARRAY,
                items: { type: Type.STRING }
              }
            },
            required: ['bodyType', 'bodyTypeKorean', 'bodyDescription', 'personalColor', 'preferredFit', 'recommendedSilhouettes', 'avoidStyles']
          }
        }
      });

      const parsed = JSON.parse(response.text || '{}');
      return res.json(parsed);
    } catch (err: any) {
      console.error('Error in body scan:', err);
      res.status(500).json({ error: '체형 분석 중 오류가 발생했습니다: ' + (err.message || 'Unknown error') });
    }
  });

  // API 3: Smart AI Outfit Recommender
  app.post('/api/recommend-outfit', async (req, res) => {
    try {
      const { closetItems, bodyProfile, weather, occasion, targetStyle } = req.body;
      const ai = getAi();

      if (!process.env.GEMINI_API_KEY || !closetItems || closetItems.length === 0) {
        // Fallback logic if API key not present or closet empty
        const topItem = closetItems?.find((i: any) => i.category === 'top') || closetItems?.[0];
        const bottomItem = closetItems?.find((i: any) => i.category === 'bottom') || closetItems?.[1];
        const outerItem = closetItems?.find((i: any) => i.category === 'outer');
        const shoesItem = closetItems?.find((i: any) => i.category === 'shoes');

        return res.json({
          recommendations: [
            {
              id: 'rec-1',
              title: `${weather?.city || '오늘'} 날씨에 맞는 ${occasion || '데일리'} 스마트 AI 코디`,
              score: 97,
              styleTag: targetStyle || '스마트 캐주얼',
              topItemId: topItem?.id,
              bottomItemId: bottomItem?.id,
              outerItemId: outerItem?.id,
              shoesItemId: shoesItem?.id,
              weatherReason: `${weather?.temp || 23}°C의 ${weather?.condition || '선선한'} 날씨에 딱 맞는 온도 체감 밸런스를 맞춰줍니다.`,
              bodyFitReason: `${bodyProfile?.bodyTypeKorean || '체형'}의 비율을 최고로 돋보이게 하는 상하의 기장 밸런스입니다.`,
              colorHarmonyReason: `${topItem?.color || '상의'}와 ${bottomItem?.color || '하의'}의 컬러톤이 매우 조화롭습니다.`
            }
          ]
        });
      }

      const promptText = `
당신은 최고 수석 AI 패션 스타일리스트입니다.
사용자의 [옷장 아이템 목록], [체형 프로필], [현재 날씨], [TPO/상황], [선호 스타일]을 바탕으로
사용자의 실제 옷장 아이템 ID를 조합하여 최적의 완성형 코디 2개를 추천하세요.

[사용자 데이터]
1. 옷장 아이템 목록 (JSON):
${JSON.stringify(closetItems, null, 2)}

2. 체형 프로필:
- 체형: ${bodyProfile?.bodyTypeKorean || '웨이브 체형'}
- 추천 실루엣: ${bodyProfile?.recommendedSilhouettes?.join(', ') || '하이웨스트'}
- 피할 스타일: ${bodyProfile?.avoidStyles?.join(', ') || '없음'}

3. 오늘 날씨:
- 도시: ${weather?.city || '서울'}
- 기온: ${weather?.temp || 22}°C (${weather?.condition || '맑음'})
- 최고/최저: ${weather?.highTemp || 26}°C / ${weather?.lowTemp || 18}°C
- 스타일 팁: ${weather?.dressingTip || '가벼운 레이어드 추천'}

4. TPO / 상황: ${occasion || '일상/데일리'}
5. 원하는 취향/무드: ${targetStyle || '자동 추천'}

[지침]
- 사용자가 소지한 closetItems의 id 값을 정확히 topItemId, bottomItemId, outerItemId, shoesItemId, accessoryItemId 로 지정하세요.
- 상의(top)와 하의(bottom)는 가급적 포함하고, 아우터/신발은 기온과 스타일에 맞춰 적절히 조합하세요.
- 각 코디마다 매칭 점수(score, 90~99 사이 정수), 감성적인 제목(title), 날씨 이유(weatherReason), 체형 보정 이유(bodyFitReason), 색상 조합 이유(colorHarmonyReason)를 매력적으로 설명하세요.
`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.6-flash',
        contents: promptText,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              recommendations: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    id: { type: Type.STRING },
                    title: { type: Type.STRING },
                    score: { type: Type.INTEGER },
                    styleTag: { type: Type.STRING },
                    topItemId: { type: Type.STRING },
                    bottomItemId: { type: Type.STRING },
                    outerItemId: { type: Type.STRING },
                    shoesItemId: { type: Type.STRING },
                    accessoryItemId: { type: Type.STRING },
                    weatherReason: { type: Type.STRING },
                    bodyFitReason: { type: Type.STRING },
                    colorHarmonyReason: { type: Type.STRING }
                  },
                  required: ['id', 'title', 'score', 'styleTag', 'weatherReason', 'bodyFitReason', 'colorHarmonyReason']
                }
              }
            },
            required: ['recommendations']
          }
        }
      });

      const parsed = JSON.parse(response.text || '{}');
      return res.json(parsed);
    } catch (err: any) {
      console.error('Error in recommend outfit:', err);
      res.status(500).json({ error: '코디 추천 생성 중 오류가 발생했습니다: ' + (err.message || 'Unknown error') });
    }
  });

  // API 4: AI Stylist Chat Consultant
  app.post('/api/ai-chat', async (req, res) => {
    try {
      const { userMessage, closetItems, bodyProfile, weather, chatHistory } = req.body;
      const ai = getAi();

      if (!process.env.GEMINI_API_KEY) {
        // Smart fallback chat responses
        let fallbackText = '질문하신 내용에 대해 제안해 드릴게요!\n';
        if (userMessage.includes('소개팅') || userMessage.includes('데이트')) {
          fallbackText += `고객님의 ${bodyProfile?.bodyTypeKorean || '체형'}을 살리려면 상체는 슬림하게 잡아주는 니트/블라우스에 하이웨스트 데님 또는 핀턱 슬랙스를 매칭하고, 가벼운 가방을 더해보세요. 현재 서울 날씨(${weather?.temp || 23}°C)엔 아우터로 트렌치코트가 제격입니다!`;
        } else if (userMessage.includes('부족') || userMessage.includes('구매') || userMessage.includes('쇼핑')) {
          fallbackText += `현재 소장하신 옷장을 보면 상의와 아우터는 훌륭하지만, [H라인 스커트]나 [클래식 가죽 로퍼]가 부족합니다! 쇼핑 탭에서 내 체형에 찰떡인 신상품을 확인해 보세요.`;
        } else {
          fallbackText += `스캔하신 ${closetItems?.length || 8}개 아이템 중 오프화이트 라운드 니트와 인디고 데님의 매칭 점수가 가장 높습니다. 기온이 ${weather?.temp || 23}°C 내외이므로 가벼운 레이어드를 추천드립니다!`;
        }
        return res.json({ text: fallbackText });
      }

      const promptText = `
당신은 최고의 퍼스널 패션 AI 스타일리스트 '핏코디(FitCoder)'입니다.
사용자와 친근하고 세련되며 전문적인 패션 상담 대화를 나누세요.

[사용자 프로필 및 컨텍스트]
1. 체형 정보: ${bodyProfile?.bodyTypeKorean || '웨이브 체형'}
2. 추천 실루엣: ${bodyProfile?.recommendedSilhouettes?.join(', ') || '하이웨스트'}
3. 피할 스타일: ${bodyProfile?.avoidStyles?.join(', ') || '루즈핏'}
4. 퍼스널 컬러: ${bodyProfile?.personalColor || '여름 쿨톤'}
5. 보유 옷장 수: ${closetItems?.length || 0}개
6. 보유 주요 아이템: ${closetItems?.map((i: any) => i.name).slice(0, 6).join(', ') || '기본 니트, 하이웨스트 데님 등'}
7. 오늘 날씨: ${weather?.city || '서울'} ${weather?.temp || 22}°C (${weather?.condition || '맑음'})

[사용자 메시지]
"${userMessage}"

[응답 가이드]
- 사용자가 "내가 가진 옷"과 "필요한 옷(구매할 옷)"을 효율적으로 구분하고 스타일링하도록 조언해 주세요.
- 답변은 가독성이 좋게 이모지와 줄바꿈을 활용하고, 전문성과 다정함이 동시에 느껴지도록 2~4단락 내외로 작성하세요.
- 체형 보정 팁과 퍼스널 컬러 조화를 구체적인 아이템 명칭과 함께 언급하세요.
`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.6-flash',
        contents: promptText
      });

      return res.json({ text: response.text || '죄송합니다. 답변을 생성하는데 어려움이 발생했습니다.' });
    } catch (err: any) {
      console.error('Error in AI chat:', err);
      res.status(500).json({ error: 'AI 패션 상담 중 오류가 발생했습니다: ' + (err.message || 'Unknown error') });
    }
  });

  // Vite development middleware or production static serving
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
