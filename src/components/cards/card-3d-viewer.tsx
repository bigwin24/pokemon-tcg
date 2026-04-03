"use client";

import { useRef, useEffect } from "react";
import * as THREE from "three";
import cardBackImg from "@/assets/card-back.png";

interface Props {
  imageUrl: string;
  rarity: string;
}

// 레어리티별 홀로그램 강도
const holoIntensity: Record<string, number> = {
  "Rare Secret": 1.0,
  "Rare Rainbow": 1.0,
  "Rare Holo VMAX": 0.8,
  "Rare Ultra": 0.7,
  "Rare Holo": 0.5,
  Rare: 0.3,
  Uncommon: 0.1,
  Common: 0.0,
};

export function Card3DViewer({ imageUrl, rarity }: Props) {
  const mountRef = useRef<HTMLDivElement>(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const cardRef = useRef<THREE.Mesh | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const flipRef = useRef(false);
  const flipAngleRef = useRef(0);
  const isCardFlippedRef = useRef(false);

  const intensity = holoIntensity[rarity] ?? 0.2;

  useEffect(() => {
    if (!mountRef.current) return;
    const el = mountRef.current;
    const W = el.clientWidth;
    const H = el.clientHeight;

    // Scene 세팅
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0f0f0f);

    const camera = new THREE.PerspectiveCamera(45, W / H, 0.1, 100);
    camera.position.set(0, 0, 3);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(W, H);
    renderer.setPixelRatio(window.devicePixelRatio);
    el.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // 카드 지오메트리 (포켓몬 카드 비율 2.5 x 3.5)
    const geometry = new THREE.PlaneGeometry(1.8, 2.52);

    // 카드 앞면 텍스처
    const loader = new THREE.TextureLoader();
    const texture = loader.load(imageUrl);

    // 카드 뒷면 텍스처
    const backTexture = loader.load(cardBackImg.src);

    // 홀로그램 효과용 ShaderMaterial
    const material = new THREE.ShaderMaterial({
      uniforms: {
        uTexture: { value: texture },
        uMouse: { value: new THREE.Vector2(0.5, 0.5) },
        uIntensity: { value: intensity },
        uTime: { value: 0 },
      },
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform sampler2D uTexture;
        uniform vec2 uMouse;
        uniform float uIntensity;
        uniform float uTime;
        varying vec2 vUv;

        vec3 holo(vec2 uv, vec2 mouse) {
          vec2 offset = uv - mouse;
          float angle = atan(offset.y, offset.x);
          float dist  = length(offset);
          float hue   = angle / (2.0 * 3.14159) + uTime * 0.1 + dist * 2.0;
          float r = 0.5 + 0.5 * sin(hue * 6.28);
          float g = 0.5 + 0.5 * sin(hue * 6.28 + 2.09);
          float b = 0.5 + 0.5 * sin(hue * 6.28 + 4.18);
          float shimmer = smoothstep(0.6, 0.0, dist);
          return vec3(r, g, b) * shimmer * uIntensity;
        }

        void main() {
          vec4 texColor = texture2D(uTexture, vUv);
          vec3 hc = holo(vUv, uMouse);
          gl_FragColor = vec4(texColor.rgb + hc, texColor.a);
        }
      `,
      transparent: true,
      side: THREE.DoubleSide,
    });

    // 카드 뒷면 (검정 + 뒷면 텍스처 or 단색)
    const backMaterial = new THREE.MeshStandardMaterial({
      map: backTexture,
      color: 0x1a1a2e,
      roughness: 0.3,
      metalness: 0.6,
      side: THREE.DoubleSide,
    });

    const card = new THREE.Mesh(geometry, material);
    scene.add(card);
    cardRef.current = card;

    // 조명
    const ambient = new THREE.AmbientLight(0xffffff, 0.6);
    const point = new THREE.PointLight(0xffffff, 1.2, 10);
    point.position.set(2, 3, 4);
    scene.add(ambient, point);

    // 마우스 이벤트
    const handleMouseMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      mouseRef.current = {
        x: (e.clientX - rect.left) / rect.width - 0.5,
        y: -(e.clientY - rect.top) / rect.height + 0.5,
      };
    };
    el.addEventListener("mousemove", handleMouseMove);

    // 애니메이션 루프
    let animId: number;
    const animate = () => {
      animId = requestAnimationFrame(animate);

      // 마우스 기울기
      if (cardRef.current && !flipRef.current) {
        cardRef.current.rotation.y +=
          (mouseRef.current.x * 0.6 - cardRef.current.rotation.y) * 0.08;
        cardRef.current.rotation.x +=
          (mouseRef.current.y * 0.4 - cardRef.current.rotation.x) * 0.08;
      }

      // 플립 애니메이션
      if (flipRef.current) {
        flipAngleRef.current += 0.08;
        if (cardRef.current) {
          cardRef.current.rotation.y = flipAngleRef.current;
          // 뒤집히는 중간 지점에서 머티리얼 교체
          if (flipAngleRef.current > Math.PI / 2) {
            const targetMaterial = isCardFlippedRef.current
              ? material
              : backMaterial;
            if (cardRef.current.material !== targetMaterial) {
              cardRef.current.material = targetMaterial;
            }
          }
          if (flipAngleRef.current >= Math.PI) {
            flipRef.current = false;
            flipAngleRef.current = 0;
            isCardFlippedRef.current = !isCardFlippedRef.current;
            cardRef.current.rotation.y = 0;
            cardRef.current.material = isCardFlippedRef.current
              ? backMaterial
              : material;
          }
        }
      }

      // 홀로그램 시간 + 마우스 유니폼 업데이트
      material.uniforms.uTime.value += 0.01;
      material.uniforms.uMouse.value.set(
        mouseRef.current.x + 0.5,
        mouseRef.current.y + 0.5,
      );

      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(animId);
      el.removeEventListener("mousemove", handleMouseMove);
      renderer.dispose();
      if (el.contains(renderer.domElement)) {
        el.removeChild(renderer.domElement);
      }
    };
  }, [imageUrl, intensity]);

  const handleFlip = () => {
    if (flipRef.current) return;
    flipRef.current = true;
  };

  return (
    <div className="space-y-3">
      <div
        ref={mountRef}
        className="w-full aspect-[2.5/3.5] rounded-xl overflow-hidden cursor-pointer"
        onClick={handleFlip}
      />
      <p className="text-xs text-center text-muted-foreground">
        마우스를 올려 홀로그램 효과 • 클릭하면 플립
      </p>
    </div>
  );
}
