"use client";

import Script from "next/script";
import { useEffect, useRef, useState } from "react";
import { CardStore } from "@/data/stores";

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    kakao: any;
  }
}

interface KakaoMapProps {
  stores: CardStore[];
  selectedId?: number | null;
  onSelectStore?: (store: CardStore) => void;
}

export default function KakaoMap({
  stores,
  selectedId,
  onSelectStore,
}: KakaoMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  const infoWindowsRef = useRef<any[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // 지도 초기화
  useEffect(() => {
    if (!isLoaded || !mapRef.current) return;

    window.kakao.maps.load(() => {
      const center = new window.kakao.maps.LatLng(36.5, 127.8);
      const map = new window.kakao.maps.Map(mapRef.current, {
        center,
        level: 13,
      });
      mapInstanceRef.current = map;

      // 지도 컨트롤 추가
      const zoomControl = new window.kakao.maps.ZoomControl();
      map.addControl(zoomControl, window.kakao.maps.ControlPosition.RIGHT);

      const mapTypeControl = new window.kakao.maps.MapTypeControl();
      map.addControl(
        mapTypeControl,
        window.kakao.maps.ControlPosition.TOPRIGHT,
      );

      // 마커 + 인포윈도우 생성
      stores.forEach((store) => {
        const position = new window.kakao.maps.LatLng(store.lat, store.lng);

        const marker = new window.kakao.maps.Marker({
          map,
          position,
          title: store.name,
        });

        const tagHtml = store.tags
          .map(
            (tag) =>
              `<span style="display:inline-block;padding:2px 6px;background:#fee2e2;color:#dc2626;border-radius:4px;font-size:10px;margin-right:3px">${tag}</span>`,
          )
          .join("");

        const content = `
          <div style="padding:12px 14px;font-family:sans-serif;min-width:180px;max-width:220px;border-radius:8px">
            <div style="font-weight:700;font-size:13px;margin-bottom:4px;color:#111">${store.name}</div>
            <div style="font-size:11px;color:#666;margin-bottom:6px;line-height:1.4">${store.address}</div>
            ${store.hours ? `<div style="font-size:11px;color:#444;margin-bottom:6px">🕐 ${store.hours}</div>` : ""}
            ${store.phone ? `<div style="font-size:11px;color:#444;margin-bottom:6px">📞 ${store.phone}</div>` : ""}
            <div style="margin-top:4px">${tagHtml}</div>
          </div>
        `;

        const infoWindow = new window.kakao.maps.InfoWindow({
          content,
          removable: true,
        });

        markersRef.current.push(marker);
        infoWindowsRef.current.push(infoWindow);

        window.kakao.maps.event.addListener(marker, "click", () => {
          // 다른 인포윈도우 닫기
          infoWindowsRef.current.forEach((iw) => iw.close());
          infoWindow.open(map, marker);
          onSelectStore?.(store);
        });
      });
    });
  }, [isLoaded, stores, onSelectStore]);

  // 선택된 마커로 이동
  useEffect(() => {
    if (!mapInstanceRef.current || selectedId == null) return;

    const idx = stores.findIndex((s) => s.id === selectedId);
    if (idx === -1) return;

    const store = stores[idx];
    const position = new window.kakao.maps.LatLng(store.lat, store.lng);

    // mapInstanceRef.current.panTo(position);
    // mapInstanceRef.current.setLevel(5);
    mapInstanceRef.current.setLevel(5); // 먼저 줌 레벨 설정
    mapInstanceRef.current.setCenter(position); // 그 다음 중심 이동 (즉시)

    infoWindowsRef.current.forEach((iw) => iw.close());
    infoWindowsRef.current[idx]?.open(
      mapInstanceRef.current,
      markersRef.current[idx],
    );
  }, [selectedId, stores]);

  return (
    <>
      <Script
        src={`//dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.NEXT_PUBLIC_KAKAO_MAP_KEY}&autoload=false`}
        strategy="afterInteractive"
        onLoad={() => setIsLoaded(true)}
      />
      <div
        ref={mapRef}
        className="w-full rounded-xl border border-gray-200"
        style={{ height: "480px" }}
      />
    </>
  );
}
