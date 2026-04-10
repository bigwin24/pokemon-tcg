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
  "Rare Secret": 0.5,
  "Rare Rainbow": 0.5,
  "Rare Holo VMAX": 0.4,
  "Rare Ultra": 0.35,
  "Rare Holo": 0.25,
  Rare: 0.15,
  Uncommon: 0.05,
  Common: 0.0,
};

const CARD_VERT = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const CARD_FRAG = `
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
`;

export function Card3DViewer({ imageUrl, rarity }: Props) {
  const mountRef = useRef<HTMLDivElement>(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const groupRef = useRef<THREE.Group | null>(null);
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

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0f0f0f);

    const camera = new THREE.PerspectiveCamera(45, W / H, 0.1, 100);
    camera.position.set(0, 0, 3);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(W, H);
    renderer.setPixelRatio(window.devicePixelRatio);
    el.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    const geometry = new THREE.PlaneGeometry(1.8, 2.52);
    const loader = new THREE.TextureLoader();

    const frontMaterial = new THREE.ShaderMaterial({
      uniforms: {
        uTexture: { value: loader.load(imageUrl) },
        uMouse: { value: new THREE.Vector2(0.5, 0.5) },
        uIntensity: { value: intensity },
        uTime: { value: 0 },
      },
      vertexShader: CARD_VERT,
      fragmentShader: CARD_FRAG,
      transparent: true,
      // FrontSide(기본값): 앞면만 렌더링
    });

    const backMaterial = new THREE.ShaderMaterial({
      uniforms: {
        uTexture: { value: loader.load(cardBackImg.src) },
        uMouse: { value: new THREE.Vector2(0.5, 0.5) },
        uIntensity: { value: 0 },
        uTime: { value: 0 },
      },
      vertexShader: CARD_VERT,
      fragmentShader: CARD_FRAG,
      transparent: true,
      // FrontSide(기본값): 앞면만 렌더링
    });

    // 앞면 메시: 그룹 기준 +Z 방향
    const frontMesh = new THREE.Mesh(geometry, frontMaterial);

    // 뒷면 메시: Y축으로 180도 회전 → 뒷면이 카메라 쪽을 향하도록
    const backMesh = new THREE.Mesh(geometry, backMaterial);
    backMesh.rotation.y = Math.PI;

    // 그룹으로 묶어서 함께 회전
    const group = new THREE.Group();
    group.add(frontMesh, backMesh);
    scene.add(group);
    groupRef.current = group;

    const ambient = new THREE.AmbientLight(0xffffff, 0.6);
    const point = new THREE.PointLight(0xffffff, 1.2, 10);
    point.position.set(2, 3, 4);
    scene.add(ambient, point);

    const handleMouseMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      mouseRef.current = {
        x: (e.clientX - rect.left) / rect.width - 0.5,
        y: -(e.clientY - rect.top) / rect.height + 0.5,
      };
    };
    el.addEventListener("mousemove", handleMouseMove);

    let animId: number;
    const animate = () => {
      animId = requestAnimationFrame(animate);

      const group = groupRef.current;
      if (!group) {
        renderer.render(scene, camera);
        return;
      }

      // 마우스 기울기 (플립 중엔 비활성)
      if (!flipRef.current) {
        const baseY = isCardFlippedRef.current ? Math.PI : 0;
        group.rotation.y +=
          (baseY + mouseRef.current.x * 0.6 - group.rotation.y) * 0.08;
        group.rotation.x +=
          (mouseRef.current.y * 0.4 - group.rotation.x) * 0.08;
      }

      // 플립 애니메이션
      if (flipRef.current) {
        flipAngleRef.current += 0.08;
        const baseY = isCardFlippedRef.current ? Math.PI : 0;
        const dir = isCardFlippedRef.current ? -1 : 1;
        group.rotation.y = baseY + dir * flipAngleRef.current;

        if (flipAngleRef.current >= Math.PI) {
          flipRef.current = false;
          flipAngleRef.current = 0;
          isCardFlippedRef.current = !isCardFlippedRef.current;
          group.rotation.y = isCardFlippedRef.current ? Math.PI : 0;
          group.rotation.x = 0;
        }
      }

      // 홀로그램 유니폼 업데이트
      frontMaterial.uniforms.uTime.value += 0.01;
      frontMaterial.uniforms.uMouse.value.set(
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
    //TODO: 카드 뒷면 이미지 확정될떄까지 플립 기능 비활성화
    // flipRef.current = true;
  };

  return (
    <div className="space-y-3">
      <div
        ref={mountRef}
        className="w-full aspect-[2.5/3.5] rounded-xl overflow-hidden cursor-pointer"
        onClick={handleFlip}
      />
      <p className="text-xs text-center text-muted-foreground">
        {/* 마우스를 올려 홀로그램 효과 • 클릭하면 플립 */}
        마우스를 올려 홀로그램 효과
      </p>
    </div>
  );
}
