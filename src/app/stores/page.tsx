"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { CARD_STORES, CardStore } from "@/data/stores";
import { MapPin, Clock, Phone, Tag } from "lucide-react";

// 카카오맵은 SSR 비활성화 (window 객체 필요)
const KakaoMap = dynamic(() => import("@/components/map/kakao-map"), {
  ssr: false,
  loading: () => (
    <div className="w-full rounded-xl border border-gray-200 bg-gray-50 flex items-center justify-center" style={{ height: "480px" }}>
      <p className="text-gray-400 text-sm">지도 로딩 중...</p>
    </div>
  ),
});

export default function StoresPage() {
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const selectedStore = CARD_STORES.find((s) => s.id === selectedId) ?? null;

  const handleSelectStore = (store: CardStore) => {
    setSelectedId(store.id);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* 헤더 */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <MapPin className="text-red-500" size={24} />
          국내 포켓몬 카드 판매처
        </h1>
        <p className="text-gray-500 mt-1 text-sm">
          전국 포켓몬 TCG 카드 판매 매장을 확인하세요. 마커를 클릭하면 상세 정보를 볼 수 있어요.
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* 지도 */}
        <div className="xl:col-span-2">
          <KakaoMap
            stores={CARD_STORES}
            selectedId={selectedId}
            onSelectStore={handleSelectStore}
          />
        </div>

        {/* 매장 리스트 */}
        <div className="flex flex-col gap-3 overflow-y-auto" style={{ maxHeight: "480px" }}>
          {CARD_STORES.map((store) => (
            <button
              key={store.id}
              onClick={() => setSelectedId(store.id)}
              className={`text-left p-4 rounded-xl border transition-all duration-150 ${
                selectedId === store.id
                  ? "border-red-400 bg-red-50 shadow-sm"
                  : "border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm"
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="font-semibold text-sm text-gray-900">{store.name}</div>
                {selectedId === store.id && (
                  <span className="text-xs text-red-500 font-medium shrink-0">선택됨</span>
                )}
              </div>

              <div className="mt-1 flex items-start gap-1 text-xs text-gray-500">
                <MapPin size={12} className="mt-0.5 shrink-0" />
                <span>{store.address}</span>
              </div>

              {store.hours && (
                <div className="mt-1 flex items-center gap-1 text-xs text-gray-500">
                  <Clock size={12} className="shrink-0" />
                  <span>{store.hours}</span>
                </div>
              )}

              {store.phone && (
                <div className="mt-1 flex items-center gap-1 text-xs text-gray-500">
                  <Phone size={12} className="shrink-0" />
                  <span>{store.phone}</span>
                </div>
              )}

              <div className="mt-2 flex flex-wrap gap-1">
                {store.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full bg-red-50 text-red-600 text-[10px] font-medium"
                  >
                    <Tag size={9} />
                    {tag}
                  </span>
                ))}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* 선택된 매장 상세 (모바일용) */}
      {selectedStore && (
        <div className="mt-4 xl:hidden p-4 rounded-xl border border-red-200 bg-red-50">
          <p className="font-bold text-sm">{selectedStore.name}</p>
          <p className="text-xs text-gray-600 mt-1">{selectedStore.address}</p>
          {selectedStore.hours && (
            <p className="text-xs text-gray-500 mt-0.5">🕐 {selectedStore.hours}</p>
          )}
        </div>
      )}

      {/* 안내 */}
      <p className="mt-4 text-xs text-gray-400 text-center">
        * 매장 정보는 실제와 다를 수 있습니다. 방문 전 전화로 확인하세요.
      </p>
    </div>
  );
}
