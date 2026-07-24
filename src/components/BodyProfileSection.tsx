import React from 'react';
import { BodyProfile } from '../types';
import { UserCheck, Sparkles, AlertTriangle, CheckCircle2, RefreshCw, Layers, ShieldCheck } from 'lucide-react';

interface BodyProfileSectionProps {
  profile: BodyProfile;
  onOpenBodyScan: () => void;
}

export const BodyProfileSection: React.FC<BodyProfileSectionProps> = ({
  profile,
  onOpenBodyScan
}) => {
  return (
    <div className="space-y-6">
      {/* Top Banner Card */}
      <div className="bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/20 border border-purple-400/30 text-purple-200 text-xs font-semibold">
              <UserCheck className="w-3.5 h-3.5" />
              <span>AI 체형 스캔 진단 완료</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              {profile.bodyTypeKorean}
            </h2>

            <p className="text-xs sm:text-sm text-purple-100/90 leading-relaxed">
              {profile.bodyDescription}
            </p>
          </div>

          <button
            id="btn-rescan-body-profile"
            onClick={onOpenBodyScan}
            className="self-start md:self-center px-5 py-3 rounded-2xl bg-white text-purple-950 hover:bg-purple-50 font-bold text-xs sm:text-sm flex items-center gap-2 shadow-lg hover:scale-105 transition-all shrink-0 cursor-pointer"
          >
            <RefreshCw className="w-4 h-4 text-purple-600" />
            <span>체형 다시 카메라 스캔하기</span>
          </button>
        </div>
      </div>

      {/* Grid Specs Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Personal Specs & Color */}
        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs space-y-3">
          <div className="flex items-center gap-2 text-stone-900 font-bold text-sm">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>기본 스펙 &amp; 퍼스널 컬러</span>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex justify-between py-1.5 border-b border-stone-100">
              <span className="text-stone-500">키 / 체중</span>
              <span className="font-bold text-stone-900">{profile.heightCm} cm / {profile.weightKg} kg</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-stone-100">
              <span className="text-stone-500">매칭 퍼스널 컬러</span>
              <span className="font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md">
                {profile.personalColor}
              </span>
            </div>
            <div className="flex justify-between py-1.5">
              <span className="text-stone-500">최근 스캔 일자</span>
              <span className="font-medium text-stone-600">{profile.scannedAt || '오늘'}</span>
            </div>
          </div>
        </div>

        {/* Recommended Silhouettes */}
        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs space-y-3">
          <div className="flex items-center gap-2 text-emerald-800 font-bold text-sm">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>비율을 완성하는 베스트 핏</span>
          </div>

          <ul className="space-y-2 text-xs">
            {profile.recommendedSilhouettes.map((sil, i) => (
              <li key={i} className="flex items-start gap-2 bg-emerald-50/60 p-2 rounded-xl text-emerald-950 font-medium border border-emerald-100">
                <span className="text-emerald-600 font-bold">✓</span>
                <span>{sil}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Styles to Avoid */}
        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs space-y-3">
          <div className="flex items-center gap-2 text-rose-800 font-bold text-sm">
            <AlertTriangle className="w-4 h-4 text-rose-500" />
            <span>피하면 좋은 스타일</span>
          </div>

          <ul className="space-y-2 text-xs">
            {profile.avoidStyles.map((av, i) => (
              <li key={i} className="flex items-start gap-2 bg-rose-50/60 p-2 rounded-xl text-rose-950 font-medium border border-rose-100">
                <span className="text-rose-500 font-bold">✕</span>
                <span>{av}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Preferred Fit Tags */}
      <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs space-y-3">
        <div className="flex items-center gap-2 text-stone-900 font-bold text-sm">
          <Layers className="w-4 h-4 text-indigo-600" />
          <span>체형 보정 주요 키워드 태그</span>
        </div>

        <div className="flex flex-wrap gap-2">
          {profile.preferredFit.map((fit, i) => (
            <span
              key={i}
              className="px-3 py-1.5 rounded-xl bg-purple-50 text-purple-900 font-bold text-xs border border-purple-200 shadow-2xs"
            >
              #{fit}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};
