import React, { useState, useRef, useEffect } from 'react';
import { UserCheck, Camera, Upload, Sparkles, RefreshCw, CheckCircle, AlertCircle, Eye } from 'lucide-react';
import { BodyProfile } from '../types';
import { captureVideoFrame, fileToBase64 } from '../utils/camera';

interface BodyScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onScanComplete: (profile: BodyProfile) => void;
}

export const BodyScannerModal: React.FC<BodyScannerModalProps> = ({
  isOpen,
  onClose,
  onScanComplete
}) => {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Height and weight inputs for ratio precision
  const [height, setHeight] = useState<number>(165);
  const [weight, setWeight] = useState<number>(52);
  const [userNotes, setUserNotes] = useState('');

  const [scannedProfile, setScannedProfile] = useState<BodyProfile | null>(null);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (!isOpen) {
      stopCamera();
      resetState();
    }
  }, [isOpen]);

  const startCamera = async () => {
    try {
      setErrorMsg(null);
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user' },
        audio: false
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
      setCameraActive(true);
    } catch (err: any) {
      console.warn('Camera access error:', err);
      setErrorMsg('카메라 권한을 얻을 수 없습니다. 아래 사진 업로드 또는 체형 예시 버튼으로 진행할 수 있습니다.');
      setCameraActive(false);
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
    setCameraActive(false);
  };

  const resetState = () => {
    setCapturedImage(null);
    setScannedProfile(null);
    setIsLoading(false);
    setErrorMsg(null);
  };

  const handleCapture = () => {
    if (videoRef.current) {
      const imgData = captureVideoFrame(videoRef.current);
      if (imgData) {
        setCapturedImage(imgData);
        stopCamera();
        analyzeBodyImage(imgData);
      }
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const base64 = await fileToBase64(file);
        setCapturedImage(base64);
        stopCamera();
        analyzeBodyImage(base64);
      } catch (err) {
        setErrorMsg('이미지를 읽을 수 없습니다.');
      }
    }
  };

  // Quick preset test buttons for body shape
  const handlePresetSelect = (type: 'wave' | 'straight' | 'natural') => {
    stopCamera();
    setIsLoading(true);
    setErrorMsg(null);

    setTimeout(() => {
      if (type === 'wave') {
        setScannedProfile({
          bodyType: 'wave',
          bodyTypeKorean: '웨이브 체형 (상체 슬림, 허리선 강조)',
          bodyDescription: '상체가 상대적으로 슬림하고 목선과 골반 라인이 부드럽습니다. 허리 라인을 잡아주는 크롭핏이나 하이웨스트가 비율을 극대화합니다.',
          heightCm: height,
          weightKg: weight,
          personalColor: '여름 쿨톤 / 봄 브라이트',
          preferredFit: ['크롭핏 상의', '하이웨스트 데님', 'A라인 스커트', 'V넥/스퀘어넥'],
          recommendedSilhouettes: ['허리선을 살려주는 상의', '하이웨스트 팬츠', '라인이 잡힌 트렌치코트'],
          avoidStyles: ['체형을 가리는 오버핏 베스트', '로우라이즈 하의'],
          scannedAt: new Date().toISOString().split('T')[0]
        });
      } else if (type === 'straight') {
        setScannedProfile({
          bodyType: 'straight',
          bodyTypeKorean: '스트레이트 체형 (입체적 핏, 클래식 선호)',
          bodyDescription: '목선부터 어깨, 골반까지 밸런스가 입체적이고 볼륨감이 있습니다. 심플하고 적당히 자리를 잡아주는 클래식핏과 슬랙스가 고급스럽게 어울립니다.',
          heightCm: height,
          weightKg: weight,
          personalColor: '가을 웜톤 / 겨울 쿨톤',
          preferredFit: ['세미 스트레이트 슬랙스', '클래식 셔츠', 'V넥 아이템', '저지 소재'],
          recommendedSilhouettes: ['일자 스트레이트 팬츠', '단정한 자켓 및 가디건', '모던 미니멀 상의'],
          avoidStyles: ['화려한 프릴/주름 장식', '너무 두꺼운 터틀넥'],
          scannedAt: new Date().toISOString().split('T')[0]
        });
      } else {
        setScannedProfile({
          bodyType: 'natural',
          bodyTypeKorean: '내추럴 체형 (골격 라인, 오버핏 소화력 최상)',
          bodyDescription: '어깨선과 프레임이 또렷하고 골격이 매력적입니다. 오버핏, 스트릿, 와이드 핏을 멋스럽게 소화해내는 스타일리시한 체형입니다.',
          heightCm: height,
          weightKg: weight,
          personalColor: '가을 딥 / 봄 라이트',
          preferredFit: ['와이드 팬츠', '오버사이즈 아우터', '롱 트렌치', '레이어드'],
          recommendedSilhouettes: ['와이드 핏 슬랙스/데님', '드롭숄더 오버핏 후드/니트', '맥시 기장 코트'],
          avoidStyles: ['지나치게 타이트한 핏', '짧고 꽉 차는 반소매'],
          scannedAt: new Date().toISOString().split('T')[0]
        });
      }
      setIsLoading(false);
    }, 1200);
  };

  const analyzeBodyImage = async (base64Img: string) => {
    setIsLoading(true);
    setErrorMsg(null);

    try {
      const response = await fetch('/api/scan-body', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageBase64: base64Img,
          userNotes: `키: ${height}cm, 체중: ${weight}kg. ${userNotes}`
        })
      });

      if (!response.ok) throw new Error('체형 분석에 실패했습니다.');

      const data = await response.json();
      setScannedProfile({
        ...data,
        heightCm: height,
        weightKg: weight,
        scannedAt: new Date().toISOString().split('T')[0]
      });
    } catch (err: any) {
      console.error('Body scan error:', err);
      setErrorMsg('AI 체형 스캔 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveProfile = () => {
    if (scannedProfile) {
      onScanComplete(scannedProfile);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-stone-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-lg w-full p-5 sm:p-6 my-auto space-y-5 shadow-2xl relative border border-stone-200 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-stone-100 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center">
              <UserCheck className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-base text-stone-900">AI 체형 &amp; 비율 스캐너</h3>
              <p className="text-xs text-stone-500">카메라 분석으로 내 체형과 퍼스널 핏 도출</p>
            </div>
          </div>

          <button
            onClick={() => {
              stopCamera();
              onClose();
            }}
            className="text-stone-400 hover:text-stone-700 font-bold p-1 rounded-lg"
          >
            ✕
          </button>
        </div>

        {/* Physical input measurements */}
        <div className="grid grid-cols-2 gap-3 bg-stone-50 p-3 rounded-2xl border border-stone-200 text-xs">
          <div>
            <label className="text-stone-600 font-semibold block mb-1">키 (cm)</label>
            <input
              type="number"
              value={height}
              onChange={(e) => setHeight(Number(e.target.value))}
              className="w-full bg-white border border-stone-200 px-3 py-1.5 rounded-xl font-bold text-stone-900 focus:outline-none focus:ring-2 focus:ring-purple-500/30"
            />
          </div>
          <div>
            <label className="text-stone-600 font-semibold block mb-1">몸무게 (kg, 선택)</label>
            <input
              type="number"
              value={weight}
              onChange={(e) => setWeight(Number(e.target.value))}
              className="w-full bg-white border border-stone-200 px-3 py-1.5 rounded-xl font-bold text-stone-900 focus:outline-none focus:ring-2 focus:ring-purple-500/30"
            />
          </div>
        </div>

        {/* Camera Viewport or Image Preview */}
        <div className="relative rounded-2xl bg-stone-900 aspect-3/4 overflow-hidden flex items-center justify-center border border-stone-800 shadow-inner">
          {capturedImage ? (
            <img src={capturedImage} alt="Captured body" className="w-full h-full object-contain" />
          ) : cameraActive ? (
            <>
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
              />
              {/* Body Silhouette Outline Guide */}
              <div className="absolute inset-x-12 inset-y-6 border-2 border-dashed border-purple-400/80 rounded-full pointer-events-none flex flex-col items-center justify-between py-6">
                <div className="w-16 h-16 border border-purple-300 rounded-full bg-purple-500/10" />
                <div className="w-28 h-28 border border-purple-300 rounded-2xl bg-purple-500/10" />
                <span className="text-[11px] font-semibold text-white bg-black/60 px-3 py-1 rounded-full backdrop-blur-xs">
                  상체/전신 실루엣이 보이도록 촬영해주세요
                </span>
              </div>
            </>
          ) : (
            <div className="text-center p-6 space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-stone-800 text-purple-400 flex items-center justify-center mx-auto">
                <UserCheck className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-bold text-stone-200">전신 또는 상체 사진으로 체형 스캔</p>
                <p className="text-xs text-stone-400 mt-0.5">실루엣 기반으로 어울리는 실루엣을 찾아냅니다.</p>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={startCamera}
                  className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm"
                >
                  <Camera className="w-4 h-4" />
                  <span>카메라로 촬영</span>
                </button>

                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-4 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-semibold flex items-center gap-1.5 border border-stone-700"
                >
                  <Upload className="w-4 h-4" />
                  <span>전신 사진 업로드</span>
                </button>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </div>
            </div>
          )}

          {/* Controls on camera active */}
          {cameraActive && !capturedImage && (
            <div className="absolute bottom-4 inset-x-0 flex items-center justify-center gap-4">
              <button
                type="button"
                onClick={handleCapture}
                className="w-14 h-14 rounded-full bg-white text-purple-600 flex items-center justify-center shadow-xl ring-4 ring-white/30 hover:scale-105 active:scale-95 transition-transform cursor-pointer"
              >
                <div className="w-11 h-11 rounded-full bg-purple-600 border-2 border-white" />
              </button>
            </div>
          )}
        </div>

        {/* Quick Test Presets */}
        {!capturedImage && !cameraActive && (
          <div className="bg-purple-50/60 p-3 rounded-2xl border border-purple-100">
            <span className="text-[11px] font-bold text-purple-900 block mb-2">
              ✨ 촬영 없이 대표 체형으로 바로 선택해보기:
            </span>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => handlePresetSelect('wave')}
                className="p-2 rounded-xl bg-white border border-purple-200 hover:border-purple-500 text-left text-xs font-bold text-stone-800 transition-all shadow-2xs"
              >
                웨이브 체형
                <span className="block text-[10px] font-normal text-stone-500">상체 슬림 / 허리 강조</span>
              </button>

              <button
                type="button"
                onClick={() => handlePresetSelect('straight')}
                className="p-2 rounded-xl bg-white border border-purple-200 hover:border-purple-500 text-left text-xs font-bold text-stone-800 transition-all shadow-2xs"
              >
                스트레이트 체형
                <span className="block text-[10px] font-normal text-stone-500">입체적 / 클래식 핏</span>
              </button>

              <button
                type="button"
                onClick={() => handlePresetSelect('natural')}
                className="p-2 rounded-xl bg-white border border-purple-200 hover:border-purple-500 text-left text-xs font-bold text-stone-800 transition-all shadow-2xs"
              >
                내추럴 체형
                <span className="block text-[10px] font-normal text-stone-500">골격미 / 오버핏 소화</span>
              </button>
            </div>
          </div>
        )}

        {/* Loading */}
        {isLoading && (
          <div className="bg-purple-50 border border-purple-200 p-4 rounded-2xl flex items-center gap-3 text-purple-900 animate-pulse">
            <Sparkles className="w-6 h-6 text-purple-600 animate-spin" />
            <div>
              <p className="text-xs font-bold">Gemini AI가 체형 및 비율을 측정 중입니다...</p>
              <p className="text-[11px] text-purple-700">목선, 어깨, 허리 비율과 퍼스널 핏을 진단합니다.</p>
            </div>
          </div>
        )}

        {errorMsg && (
          <div className="bg-rose-50 border border-rose-200 p-3 rounded-xl flex items-center gap-2 text-rose-800 text-xs">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Scanned Result */}
        {scannedProfile && !isLoading && (
          <div className="bg-stone-50 p-4 rounded-2xl border border-purple-200 space-y-3">
            <div className="flex items-center justify-between border-b border-stone-200 pb-2">
              <span className="text-xs font-bold text-purple-800 flex items-center gap-1">
                <CheckCircle className="w-4 h-4 text-purple-600" />
                분석 완료! 내 체형 프로필:
              </span>
              <button
                onClick={resetState}
                className="text-[11px] text-stone-500 hover:text-stone-800 flex items-center gap-1 font-semibold"
              >
                <RefreshCw className="w-3 h-3" /> 재분석
              </button>
            </div>

            <div className="space-y-2 text-xs">
              <div className="p-3 bg-white rounded-xl border border-stone-200">
                <span className="text-[10px] font-bold text-purple-600 uppercase tracking-wider block">
                  진단 체형
                </span>
                <p className="text-base font-extrabold text-stone-900 mt-0.5">
                  {scannedProfile.bodyTypeKorean}
                </p>
                <p className="text-stone-600 mt-1 leading-relaxed text-[11px]">
                  {scannedProfile.bodyDescription}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="p-2.5 bg-white rounded-xl border border-stone-200">
                  <span className="text-[10px] text-stone-400 font-bold block">퍼스널 컬러 톤</span>
                  <span className="font-bold text-stone-800 text-xs">{scannedProfile.personalColor}</span>
                </div>
                <div className="p-2.5 bg-white rounded-xl border border-stone-200">
                  <span className="text-[10px] text-stone-400 font-bold block">신체 스펙</span>
                  <span className="font-bold text-stone-800 text-xs">{scannedProfile.heightCm}cm / {scannedProfile.weightKg}kg</span>
                </div>
              </div>

              <div>
                <span className="text-stone-600 font-bold block mb-1">추천 베스트 실루엣</span>
                <div className="flex flex-wrap gap-1.5">
                  {scannedProfile.recommendedSilhouettes.map((sil, i) => (
                    <span key={i} className="bg-purple-100 text-purple-900 font-semibold px-2 py-0.5 rounded-md text-[11px]">
                      ✓ {sil}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={handleSaveProfile}
              className="w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-md transition-colors mt-2"
            >
              내 스타일 프로필에 적용하기 ✨
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
