import { useRef, useMemo, useCallback } from "react";
import { useFrame, useThree, useLoader } from "@react-three/fiber";
import * as THREE from "three";
import { ROOM, SPRITES, OBJECTS_3D, LIGHTING } from "./roomLayout";

// PS1-style texture loader — NearestFilter, no mipmaps
function usePixelTexture(url) {
  const tex = useLoader(THREE.TextureLoader, url);
  tex.minFilter = THREE.NearestFilter;
  tex.magFilter = THREE.NearestFilter;
  tex.generateMipmaps = false;
  return tex;
}

// Couette diamond pattern — generated 32x32 canvas texture
function useCouetteTexture(color) {
  return useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 32;
    canvas.height = 32;
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, 32, 32);
    ctx.strokeStyle = "rgba(255,255,255,0.18)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(16, 0);
    ctx.lineTo(32, 16);
    ctx.lineTo(16, 32);
    ctx.lineTo(0, 16);
    ctx.closePath();
    ctx.stroke();
    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(6, 4);
    tex.minFilter = THREE.NearestFilter;
    tex.magFilter = THREE.NearestFilter;
    tex.generateMipmaps = false;
    return tex;
  }, [color]);
}

// Mouse-look camera controller — fixed position, smooth look-around
function CameraRig() {
  const { camera, gl } = useThree();
  const mouse = useRef({ x: 0, y: 0 });
  const target = useRef({ x: 0, y: 0 });

  const onMouseMove = useCallback((e) => {
    const rect = gl.domElement.getBoundingClientRect();
    mouse.current.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    mouse.current.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
  }, [gl]);

  // Attach listener
  useMemo(() => {
    gl.domElement.addEventListener("mousemove", onMouseMove);
    return () => gl.domElement.removeEventListener("mousemove", onMouseMove);
  }, [gl, onMouseMove]);

  useFrame(() => {
    // Lerp towards mouse position
    target.current.x += (mouse.current.x - target.current.x) * 0.08;
    target.current.y += (mouse.current.y - target.current.y) * 0.08;

    // Convert to rotation (±63° horizontal, ±27° vertical)
    const maxH = (63 * Math.PI) / 180;
    const maxV = (27 * Math.PI) / 180;

    camera.rotation.order = "YXZ";
    camera.rotation.y = -target.current.x * maxH;
    camera.rotation.x = target.current.y * maxV;
  });

  return null;
}

// Room geometry — 4 walls + floor + ceiling + baseboard
function RoomBox() {
  const wallMat = useMemo(
    () => new THREE.MeshLambertMaterial({ color: ROOM.walls, side: THREE.BackSide }),
    []
  );
  const floorMat = useMemo(
    () => new THREE.MeshLambertMaterial({ color: ROOM.floor, side: THREE.FrontSide }),
    []
  );
  const ceilMat = useMemo(
    () => new THREE.MeshLambertMaterial({ color: ROOM.ceiling, side: THREE.FrontSide }),
    []
  );
  const baseMat = useMemo(
    () => new THREE.MeshLambertMaterial({ color: ROOM.baseboard }),
    []
  );

  const hw = ROOM.width / 2;
  const hd = ROOM.depth / 2;

  return (
    <group>
      {/* Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} material={floorMat}>
        <planeGeometry args={[ROOM.width, ROOM.depth]} />
      </mesh>
      {/* Ceiling */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, ROOM.height, 0]} material={ceilMat}>
        <planeGeometry args={[ROOM.width, ROOM.depth]} />
      </mesh>
      {/* Back wall */}
      <mesh position={[0, ROOM.height / 2, -hd]} material={wallMat}>
        <planeGeometry args={[ROOM.width, ROOM.height]} />
      </mesh>
      {/* Left wall */}
      <mesh rotation={[0, Math.PI / 2, 0]} position={[-hw, ROOM.height / 2, 0]} material={wallMat}>
        <planeGeometry args={[ROOM.depth, ROOM.height]} />
      </mesh>
      {/* Right wall */}
      <mesh rotation={[0, -Math.PI / 2, 0]} position={[hw, ROOM.height / 2, 0]} material={wallMat}>
        <planeGeometry args={[ROOM.depth, ROOM.height]} />
      </mesh>

      {/* Baseboards */}
      <mesh position={[0, 0.04, -hd + 0.01]} material={baseMat}>
        <boxGeometry args={[ROOM.width, 0.08, 0.03]} />
      </mesh>
      <mesh position={[-hw + 0.01, 0.04, 0]} rotation={[0, Math.PI / 2, 0]} material={baseMat}>
        <boxGeometry args={[ROOM.depth, 0.08, 0.03]} />
      </mesh>
      <mesh position={[hw - 0.01, 0.04, 0]} rotation={[0, Math.PI / 2, 0]} material={baseMat}>
        <boxGeometry args={[ROOM.depth, 0.08, 0.03]} />
      </mesh>
    </group>
  );
}

// Single sprite plane — a textured plane in 3D space
function SpritePanel({ tex, position, size, rotation, opacity = 1 }) {
  const texture = usePixelTexture(tex);
  const mat = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        map: texture,
        transparent: true,
        alphaTest: 0.1,
        opacity,
        side: THREE.DoubleSide,
      }),
    [texture, opacity]
  );

  return (
    <mesh position={position} rotation={rotation || [0, 0, 0]} material={mat}>
      <planeGeometry args={size} />
    </mesh>
  );
}

// Window sprite — switches texture based on lampOn
function WindowSprite({ lampOn, sprite }) {
  const texUrl = lampOn ? sprite.texDay : sprite.texNight;
  const texture = usePixelTexture(texUrl);

  // Window frame (dark wooden border)
  return (
    <group position={sprite.position}>
      {/* Wooden frame */}
      <mesh position={[0, 0, -0.02]}>
        <planeGeometry args={[sprite.size[0] + 0.1, sprite.size[1] + 0.1]} />
        <meshLambertMaterial color="#6B4830" />
      </mesh>
      {/* Window content */}
      <mesh>
        <planeGeometry args={sprite.size} />
        <meshBasicMaterial map={texture} transparent alphaTest={0.1} />
      </mesh>
    </group>
  );
}

// Lamp sprite — switches on/off texture
function LampSprite({ lampOn, sprite }) {
  const texUrl = lampOn ? sprite.texOn : sprite.texOff;
  const texture = usePixelTexture(texUrl);

  return (
    <group position={sprite.position}>
      <mesh>
        <planeGeometry args={sprite.size} />
        <meshBasicMaterial map={texture} transparent alphaTest={0.1} />
      </mesh>
      {/* Lamp glow sphere when on */}
      {lampOn && (
        <mesh position={[0, 0.1, 0.1]}>
          <sphereGeometry args={[0.3, 8, 6]} />
          <meshBasicMaterial color="#FFE082" transparent opacity={0.06} />
        </mesh>
      )}
    </group>
  );
}

// Glow stars sprite — opacity changes with lamp state
function GlowStarsSprite({ lampOn, sprite }) {
  const meshRef = useRef();
  const texture = usePixelTexture(sprite.tex);
  const targetOpacity = lampOn ? 0.06 : 0.85;

  useFrame(() => {
    if (meshRef.current) {
      const mat = meshRef.current.material;
      mat.opacity += (targetOpacity - mat.opacity) * 0.05;
    }
  });

  return (
    <mesh ref={meshRef} position={sprite.position}>
      <planeGeometry args={sprite.size} />
      <meshBasicMaterial
        map={texture}
        transparent
        opacity={lampOn ? 0.06 : 0.85}
      />
    </mesh>
  );
}

// All furniture sprites
function FurnitureSprites({ lampOn }) {
  return (
    <group>
      {SPRITES.map((sprite) => {
        // Special cases
        if (sprite.id === "fenetre") {
          return <WindowSprite key={sprite.id} lampOn={lampOn} sprite={sprite} />;
        }
        if (sprite.id === "lampSprite") {
          return <LampSprite key={sprite.id} lampOn={lampOn} sprite={sprite} />;
        }
        if (sprite.id === "glowStars") {
          return <GlowStarsSprite key={sprite.id} lampOn={lampOn} sprite={sprite} />;
        }
        // Regular sprite
        return (
          <SpritePanel
            key={sprite.id}
            tex={sprite.tex}
            position={sprite.position}
            size={sprite.size}
            rotation={sprite.rotation}
          />
        );
      })}
    </group>
  );
}

// Couette overlay on the bed
function CouetteOverlay({ color }) {
  const texture = useCouetteTexture(color);

  return (
    <mesh position={[0.8, 0.52, -1.48]} renderOrder={1}>
      <planeGeometry args={[2.0, 0.9]} />
      <meshBasicMaterial map={texture} transparent opacity={0.65} />
    </mesh>
  );
}

// Small 3D objects — real geometry for PS1 feel
function SmallObjects() {
  return (
    <group>
      {OBJECTS_3D.map((obj, i) => {
        const key = `obj-${i}`;
        const matProps = {
          color: obj.color,
          flatShading: true,
        };

        if (obj.type === "sphere") {
          return (
            <mesh key={key} position={obj.position} scale={obj.scale || [1, 1, 1]}>
              <sphereGeometry args={[obj.radius, obj.segments, Math.max(4, obj.segments - 2)]} />
              <meshLambertMaterial {...matProps} />
            </mesh>
          );
        }
        if (obj.type === "cylinder") {
          return (
            <mesh key={key} position={obj.position}>
              <cylinderGeometry args={[obj.radius, obj.radius, obj.height, obj.segments]} />
              <meshLambertMaterial {...matProps} />
            </mesh>
          );
        }
        if (obj.type === "box") {
          return (
            <mesh key={key} position={obj.position} rotation={obj.rotation || [0, 0, 0]}>
              <boxGeometry args={obj.size} />
              <meshLambertMaterial {...matProps} />
            </mesh>
          );
        }
        return null;
      })}
    </group>
  );
}

// Dynamic lighting — smooth transition between lamp on/off
function RoomLighting({ lampOn }) {
  const ambientRef = useRef();
  const light1Ref = useRef();
  const light2Ref = useRef();

  const onColor = useMemo(() => new THREE.Color(LIGHTING.lampOn.ambient.color), []);
  const offColor = useMemo(() => new THREE.Color(LIGHTING.lampOff.ambient.color), []);
  const lampColor = useMemo(() => new THREE.Color(LIGHTING.lampOn.lamp.color), []);
  const windowOnColor = useMemo(() => new THREE.Color(LIGHTING.lampOn.window.color), []);
  const moonColor = useMemo(() => new THREE.Color(LIGHTING.lampOff.moon.color), []);
  const starsColor = useMemo(() => new THREE.Color(LIGHTING.lampOff.stars.color), []);

  useFrame(() => {
    if (!ambientRef.current) return;
    const t = 0.05;
    const amb = ambientRef.current;
    const l1 = light1Ref.current;
    const l2 = light2Ref.current;

    if (lampOn) {
      amb.intensity += (LIGHTING.lampOn.ambient.intensity - amb.intensity) * t;
      amb.color.lerp(onColor, t);
      l1.intensity += (LIGHTING.lampOn.lamp.intensity - l1.intensity) * t;
      l1.color.lerp(lampColor, t);
      l1.position.set(...LIGHTING.lampOn.lamp.position);
      l2.intensity += (LIGHTING.lampOn.window.intensity - l2.intensity) * t;
      l2.color.lerp(windowOnColor, t);
      l2.position.set(...LIGHTING.lampOn.window.position);
    } else {
      amb.intensity += (LIGHTING.lampOff.ambient.intensity - amb.intensity) * t;
      amb.color.lerp(offColor, t);
      l1.intensity += (LIGHTING.lampOff.moon.intensity - l1.intensity) * t;
      l1.color.lerp(moonColor, t);
      l1.position.set(...LIGHTING.lampOff.moon.position);
      l2.intensity += (LIGHTING.lampOff.stars.intensity - l2.intensity) * t;
      l2.color.lerp(starsColor, t);
      l2.position.set(...LIGHTING.lampOff.stars.position);
    }
  });

  const initAmbient = lampOn ? LIGHTING.lampOn.ambient : LIGHTING.lampOff.ambient;
  const initL1 = lampOn ? LIGHTING.lampOn.lamp : LIGHTING.lampOff.moon;
  const initL2 = lampOn ? LIGHTING.lampOn.window : LIGHTING.lampOff.stars;

  return (
    <>
      <ambientLight
        ref={ambientRef}
        intensity={initAmbient.intensity}
        color={initAmbient.color}
      />
      <pointLight
        ref={light1Ref}
        intensity={initL1.intensity}
        color={initL1.color}
        position={initL1.position}
        distance={6}
        decay={2}
      />
      <pointLight
        ref={light2Ref}
        intensity={initL2.intensity}
        color={initL2.color}
        position={initL2.position}
        distance={8}
        decay={2}
      />
    </>
  );
}

// Peluches — small colored spheres on the bed
function Peluches() {
  return (
    <group>
      {/* Ours — brown */}
      <mesh position={[1.7, 1.05, -1.55]}>
        <sphereGeometry args={[0.1, 6, 4]} />
        <meshLambertMaterial color="#A0522D" flatShading />
      </mesh>
      <mesh position={[1.7, 1.18, -1.55]}>
        <sphereGeometry args={[0.07, 6, 4]} />
        <meshLambertMaterial color="#A0522D" flatShading />
      </mesh>
      {/* Lapin — pink */}
      <mesh position={[2.0, 1.02, -1.5]}>
        <sphereGeometry args={[0.08, 6, 4]} />
        <meshLambertMaterial color="#DDA0DD" flatShading />
      </mesh>
      {/* Chien — beige */}
      <mesh position={[1.5, 1.0, -1.6]}>
        <sphereGeometry args={[0.07, 6, 4]} />
        <meshLambertMaterial color="#D2B48C" flatShading />
      </mesh>
    </group>
  );
}

export default function RoomScene({ lampOn, couetteColor }) {
  return (
    <>
      <CameraRig />
      <RoomLighting lampOn={lampOn} />
      <RoomBox />
      <FurnitureSprites lampOn={lampOn} />
      <CouetteOverlay color={couetteColor} />
      <SmallObjects />
      <Peluches />
    </>
  );
}
