import React, { useState, useRef, useEffect } from 'react';
import { Camera, Upload, Sparkles, RefreshCw, CheckCircle, AlertCircle, Shirt, Image as ImageIcon } from 'lucide-react';
import { ClothingItem } from '../types';
import { captureVideoFrame, fileToBase64 } from '../utils/camera';

interface ClothingScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onScanComplete: (item: ClothingItem) => void;
}

export const ClothingScannerModal: React.FC<ClothingScannerModalProps> = ({
  isOpen,
  onClose,
  onScanComplete
}) => {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [userNote, setUserNote] = useState('');

  // Scanned item preview state
  const [scannedResult, setScannedResult] = useState<Partial<ClothingItem> | null>(null);

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
        video: { facingMode: 'environment' },
        audio: false
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
      setCameraActive(true);
    } catch (err: any) {
      console.warn('Camera access error:', err);
      setErrorMsg('카메라 권한을 얻을 수 없습니다. 아래 사진 업로드 또는 예시 샘플을 이용해주세요.');
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
    setScannedResult(null);
    setIsLoading(false);
    setErrorMsg(null);
    setUserNote('');
  };

  const handleCapture = () => {
    if (videoRef.current) {
      const imgData = captureVideoFrame(videoRef.current);
      if (imgData) {
        setCapturedImage(imgData);
        stopCamera();
        analyzeClothingImage(imgData);
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
        analyzeClothingImage(base64);
      } catch (err) {
        setErrorMsg('이미지 파일을 읽는 동안 오류가 발생했습니다.');
      }
    }
  };

  // Preset sample image analyzer for quick instant testing
  const handleSampleSelect = (sampleName: string, sampleColorHex: string, sampleCategory: string) => {
    stopCamera();
    setIsLoading(true);
    setErrorMsg(null);

    setTimeout(() => {
      setScannedResult({
        name: sampleName,
        category: sampleCategory as any,
        subCategory: sampleName.split(' ')[1] || '의류',
        color: sampleName.split(' ')[0] || '베이지',
        colorHex: sampleColorHex,
        season: ['spring', 'fall'],
        styles: ['캐주얼', '데일리'],
        notes: 'AI 카메라 스캔으로 감지된 정교한 패턴 및 실루엣'
      });
      setIsLoading(false);
    }, 1200);
  };

  const analyzeClothingImage = async (base64Img: string) => {
    setIsLoading(true);
    setErrorMsg(null);

    try {
      const response = await fetch('/api/scan-clothing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageBase64: base64Img,
          userNote
        })
      });

      if (!response.ok) {
        throw new Error('서버 분석 응답에 실패했습니다.');
      }

      const data = await response.json();
      setScannedResult(data);
    } catch (err: any) {
      console.error('Scan error:', err);
      setErrorMsg('AI 옷 스캔 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveItem = () => {
    if (!scannedResult || !scannedResult.name) return;

    const newItem: ClothingItem = {
      id: `scanned-${Date.now()}`,
      name: scannedResult.name || '스캔한 의류',
      category: scannedResult.category || 'top',
      subCategory: scannedResult.subCategory || '의류',
      color: scannedResult.color || '다채로운 컬러',
      colorHex: scannedResult.colorHex || '#4F46E5',
      season: scannedResult.season || ['spring', 'fall'],
      styles: scannedResult.styles || ['캐주얼'],
      imageUrl: capturedImage || undefined,
      notes: scannedResult.notes || '카메라 AI 스캔으로 자동 등록됨',
      favorite: true,
      createdAt: new Date().toISOString().split('T')[0]
    };

    onScanComplete(newItem);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-stone-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-lg w-full p-5 sm:p-6 my-auto space-y-5 shadow-2xl relative border border-stone-200 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-stone-100 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center">
              <Camera className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-base text-stone-900">AI 카메라 옷 스캔</h3>
              <p className="text-xs text-stone-500">사진 한 장으로 카테고리, 색상, 핏 감지</p>
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

        {/* Camera Viewport or Captured View */}
        <div className="relative rounded-2xl bg-stone-900 aspect-4/3 overflow-hidden flex items-center justify-center border border-stone-800 shadow-inner">
          {capturedImage ? (
            <img src={capturedImage} alt="Captured clothing" className="w-full h-full object-contain" />
          ) : cameraActive ? (
            <>
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
              />
              {/* Overlay Guide Frame */}
              <div className="absolute inset-8 border-2 border-dashed border-indigo-400/70 rounded-2xl pointer-events-none flex items-center justify-center">
                <span className="text-[11px] font-semibold text-white bg-black/60 px-2.5 py-1 rounded-full backdrop-blur-xs">
                  옷 전체가 들어오도록 촬영해주세요
                </span>
              </div>
            </>
          ) : (
            <div className="text-center p-6 space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-stone-800 text-stone-400 flex items-center justify-center mx-auto">
                <Shirt className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-bold text-stone-200">카메라 시작 또는 파일 업로드</p>
                <p className="text-xs text-stone-400 mt-0.5">실제 옷을 펼쳐두고 찍어보세요!</p>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={startCamera}
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm"
                >
                  <Camera className="w-4 h-4" />
                  <span>카메라 켜기</span>
                </button>

                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-4 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-semibold flex items-center gap-1.5 border border-stone-700"
                >
                  <Upload className="w-4 h-4" />
                  <span>갤러리 사진 업로드</span>
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
                className="w-14 h-14 rounded-full bg-white text-indigo-600 flex items-center justify-center shadow-xl ring-4 ring-white/30 hover:scale-105 active:scale-95 transition-transform cursor-pointer"
              >
                <div className="w-11 h-11 rounded-full bg-indigo-600 border-2 border-white" />
              </button>
            </div>
          )}
        </div>

        {/* Preset Samples Quick Test Bar */}
        {!capturedImage && !cameraActive && (
          <div className="bg-stone-50 p-3 rounded-2xl border border-stone-200">
            <span className="text-[11px] font-bold text-stone-500 block mb-2">
              ⚡ 샘플 옷으로 1초 만에 테스트해보기:
            </span>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => handleSampleSelect('스트라이프 블루 셔츠', '#3B82F6', 'top')}
                className="p-2 rounded-xl bg-white border border-stone-200 hover:border-indigo-400 text-left text-xs font-medium text-stone-800 flex items-center gap-1.5 transition-all shadow-2xs"
              >
                <div className="w-3 h-3 rounded-full bg-blue-500 shrink-0" />
                <span className="truncate">블루 셔츠</span>
              </button>

              <button
                type="button"
                onClick={() => handleSampleSelect('빈티지 워싱 데님 재킷', '#1E3A8A', 'outer')}
                className="p-2 rounded-xl bg-white border border-stone-200 hover:border-indigo-400 text-left text-xs font-medium text-stone-800 flex items-center gap-1.5 transition-all shadow-2xs"
              >
                <div className="w-3 h-3 rounded-full bg-indigo-900 shrink-0" />
                <span className="truncate">청재킷</span>
              </button>

              <button
                type="button"
                onClick={() => handleSampleSelect('크림 어글리 스니커즈', '#F5F5DC', 'shoes')}
                className="p-2 rounded-xl bg-white border border-stone-200 hover:border-indigo-400 text-left text-xs font-medium text-stone-800 flex items-center gap-1.5 transition-all shadow-2xs"
              >
                <div className="w-3 h-3 rounded-full bg-amber-100 border border-stone-300 shrink-0" />
                <span className="truncate">스니커즈</span>
              </button>
            </div>
          </div>
        )}

        {/* Loading Indicator */}
        {isLoading && (
          <div className="bg-indigo-50 border border-indigo-200 p-4 rounded-2xl flex items-center gap-3 text-indigo-900 animate-pulse">
            <Sparkles className="w-6 h-6 text-indigo-600 animate-spin" />
            <div>
              <p className="text-xs font-bold">Gemini AI가 옷 이미지를 분석 중입니다...</p>
              <p className="text-[11px] text-indigo-700">카테고리, 핏감, 메인 색상을 인식하고 있습니다.</p>
            </div>
          </div>
        )}

        {/* Error Notification */}
        {errorMsg && (
          <div className="bg-rose-50 border border-rose-200 p-3 rounded-xl flex items-center gap-2 text-rose-800 text-xs font-medium">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* AI Scanned Result Form */}
        {scannedResult && !isLoading && (
          <div className="bg-stone-50 p-4 rounded-2xl border border-indigo-100 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-indigo-700 font-bold text-xs">
                <CheckCircle className="w-4 h-4 text-indigo-600" />
                <span>AI 인식 완료! 스캔 데이터 확인:</span>
              </div>
              <button
                type="button"
                onClick={resetState}
                className="text-[11px] font-semibold text-stone-500 hover:text-stone-800 flex items-center gap-1"
              >
                <RefreshCw className="w-3 h-3" /> 다시 스캔
              </button>
            </div>

            <div className="space-y-2 text-xs">
              <div>
                <label className="text-stone-500 font-medium block">제품명</label>
                <input
                  type="text"
                  value={scannedResult.name || ''}
                  onChange={(e) => setScannedResult({ ...scannedResult, name: e.target.value })}
                  className="w-full font-bold text-stone-900 bg-white border border-stone-200 px-3 py-1.5 rounded-xl mt-0.5"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-stone-500 font-medium block">카테고리</label>
                  <select
                    value={scannedResult.category || 'top'}
                    onChange={(e) =>
                      setScannedResult({ ...scannedResult, category: e.target.value as any })
                    }
                    className="w-full font-semibold text-stone-800 bg-white border border-stone-200 px-2.5 py-1.5 rounded-xl mt-0.5"
                  >
                    <option value="top">상의</option>
                    <option value="bottom">하의</option>
                    <option value="outer">아우터</option>
                    <option value="shoes">신발</option>
                    <option value="accessory">잡화/액세서리</option>
                  </select>
                </div>

                <div>
                  <label className="text-stone-500 font-medium block">세부 종류</label>
                  <input
                    type="text"
                    value={scannedResult.subCategory || ''}
                    onChange={(e) => setScannedResult({ ...scannedResult, subCategory: e.target.value })}
                    className="w-full font-semibold text-stone-800 bg-white border border-stone-200 px-3 py-1.5 rounded-xl mt-0.5"
                  />
                </div>
              </div>

              <div className="flex items-center gap-3 bg-white p-2.5 rounded-xl border border-stone-200">
                <div
                  className="w-8 h-8 rounded-lg shadow-xs border border-stone-300 shrink-0"
                  style={{ backgroundColor: scannedResult.colorHex || '#CCCCCC' }}
                />
                <div className="flex-1">
                  <span className="text-[10px] text-stone-400 block">감지된 색상</span>
                  <span className="font-bold text-stone-800 text-xs">{scannedResult.color}</span>
                </div>
              </div>

              <div>
                <label className="text-stone-500 font-medium block">AI 특징 메모</label>
                <p className="text-[11px] text-stone-600 bg-white p-2 rounded-xl border border-stone-200 italic">
                  "{scannedResult.notes}"
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleSaveItem}
              className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md transition-colors mt-2"
            >
              내 옷장에 저장하기 ✨
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
