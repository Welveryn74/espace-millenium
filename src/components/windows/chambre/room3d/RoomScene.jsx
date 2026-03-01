import { useRef, useMemo, useCallback, useEffect } from "react";
import { useFrame, useThree, useLoader } from "@react-three/fiber";
import * as THREE from "three";
import {
  ROOM, WALL_SPRITES, FURNITURE, LAMP,
  NIGHTSTAND_ITEMS, SHELF_ITEMS, FLOOR_OBJECTS, LIGHTING,
} from "./roomLayout";

// ---------------------------------------------------------------------------
// PS1-style texture loader — NearestFilter, no mipmaps
// ---------------------------------------------------------------------------
function usePixelTexture(url) {
  const tex = useLoader(THREE.TextureLoader, url);
  tex.minFilter = THREE.NearestFilter;
  tex.magFilter = THREE.NearestFilter;
  tex.generateMipmaps = false;
  return tex;
}

// ---------------------------------------------------------------------------
// Couette diamond pattern — generated 32x32 canvas texture
// ---------------------------------------------------------------------------
function useCouetteTexture(color) {
  return useMemo(() => {
    const c = document.createElement("canvas");
    c.width = 32; c.height = 32;
    const ctx = c.getContext("2d");
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, 32, 32);
    ctx.strokeStyle = "rgba(255,255,255,0.18)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(16, 0); ctx.lineTo(32, 16);
    ctx.lineTo(16, 32); ctx.lineTo(0, 16);
    ctx.closePath();
    ctx.stroke();
    const tex = new THREE.CanvasTexture(c);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(8, 5);
    tex.minFilter = THREE.NearestFilter;
    tex.magFilter = THREE.NearestFilter;
    tex.generateMipmaps = false;
    return tex;
  }, [color]);
}

// ---------------------------------------------------------------------------
// Mouse-look camera — fixed position, smooth look-around
// ---------------------------------------------------------------------------
function CameraRig() {
  const { camera, gl } = useThree();
  const mouse = useRef({ x: 0, y: 0 });
  const target = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const el = gl.domElement;
    const handler = (e) => {
      const rect = el.getBoundingClientRect();
      mouse.current.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.current.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
    };
    el.addEventListener("mousemove", handler);
    return () => el.removeEventListener("mousemove", handler);
  }, [gl]);

  useFrame(() => {
    target.current.x += (mouse.current.x - target.current.x) * 0.08;
    target.current.y += (mouse.current.y - target.current.y) * 0.08;
    const maxH = (50 * Math.PI) / 180;
    const maxV = (20 * Math.PI) / 180;
    camera.rotation.order = "YXZ";
    camera.rotation.y = -target.current.x * maxH;
    camera.rotation.x = target.current.y * maxV;
  });

  return null;
}

// ---------------------------------------------------------------------------
// Room geometry — 4 walls + floor + ceiling + baseboards
// ---------------------------------------------------------------------------
function RoomBox() {
  const wallMat = useMemo(() => new THREE.MeshLambertMaterial({ color: ROOM.walls, side: THREE.BackSide }), []);
  const floorMat = useMemo(() => new THREE.MeshLambertMaterial({ color: ROOM.floor }), []);
  const ceilMat = useMemo(() => new THREE.MeshLambertMaterial({ color: ROOM.ceiling }), []);
  const baseMat = useMemo(() => new THREE.MeshLambertMaterial({ color: ROOM.baseboard }), []);
  const hw = ROOM.width / 2;
  const hd = ROOM.depth / 2;

  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} material={floorMat}>
        <planeGeometry args={[ROOM.width, ROOM.depth]} />
      </mesh>
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, ROOM.height, 0]} material={ceilMat}>
        <planeGeometry args={[ROOM.width, ROOM.depth]} />
      </mesh>
      <mesh position={[0, ROOM.height / 2, -hd]} material={wallMat}>
        <planeGeometry args={[ROOM.width, ROOM.height]} />
      </mesh>
      <mesh rotation={[0, Math.PI / 2, 0]} position={[-hw, ROOM.height / 2, 0]} material={wallMat}>
        <planeGeometry args={[ROOM.depth, ROOM.height]} />
      </mesh>
      <mesh rotation={[0, -Math.PI / 2, 0]} position={[hw, ROOM.height / 2, 0]} material={wallMat}>
        <planeGeometry args={[ROOM.depth, ROOM.height]} />
      </mesh>
      {/* Baseboards */}
      {[
        { pos: [0, 0.04, -hd + 0.015], rot: [0, 0, 0], args: [ROOM.width, 0.08, 0.03] },
        { pos: [-hw + 0.015, 0.04, 0], rot: [0, Math.PI / 2, 0], args: [ROOM.depth, 0.08, 0.03] },
        { pos: [hw - 0.015, 0.04, 0], rot: [0, Math.PI / 2, 0], args: [ROOM.depth, 0.08, 0.03] },
      ].map((b, i) => (
        <mesh key={i} position={b.pos} rotation={b.rot} material={baseMat}>
          <boxGeometry args={b.args} />
        </mesh>
      ))}
    </group>
  );
}

// ---------------------------------------------------------------------------
// Helper: a simple colored box
// ---------------------------------------------------------------------------
function Box({ size, position, color, rotation }) {
  return (
    <mesh position={position} rotation={rotation || [0, 0, 0]}>
      <boxGeometry args={size} />
      <meshLambertMaterial color={color} flatShading />
    </mesh>
  );
}

// ---------------------------------------------------------------------------
// 3D Bed — frame + mattress + headboard + pillows
// ---------------------------------------------------------------------------
function Bed() {
  const b = FURNITURE.bed;
  return (
    <group>
      <Box {...b.frame} />
      <Box {...b.mattress} />
      <Box {...b.headboard} />
      {b.pillows.map((p, i) => <Box key={i} {...p} />)}
    </group>
  );
}

// ---------------------------------------------------------------------------
// 3D Nightstand — body + top + drawer + handle
// ---------------------------------------------------------------------------
function Nightstand() {
  const n = FURNITURE.nightstand;
  return (
    <group>
      <Box {...n.body} />
      <Box {...n.top} />
      <Box {...n.drawer} />
      <Box {...n.handle} />
    </group>
  );
}

// ---------------------------------------------------------------------------
// 3D Shelf — back + boards + sides
// ---------------------------------------------------------------------------
function Shelf() {
  const s = FURNITURE.shelf;
  return (
    <group>
      <Box {...s.back} />
      <Box {...s.shelfTop} />
      <Box {...s.shelfMid} />
      <Box {...s.shelfBot} />
      <Box {...s.sideL} />
      <Box {...s.sideR} />
    </group>
  );
}

// ---------------------------------------------------------------------------
// 3D Lamp — base + stem + cone shade
// ---------------------------------------------------------------------------
function Lamp3D({ lampOn }) {
  const l = LAMP;
  const shadeColor = lampOn ? l.shade.colorOn : l.shade.colorOff;
  return (
    <group>
      {/* Base */}
      <mesh position={l.base.position}>
        <cylinderGeometry args={[l.base.radius, l.base.radius * 1.2, l.base.height, 8]} />
        <meshLambertMaterial color={l.base.color} flatShading />
      </mesh>
      {/* Stem */}
      <mesh position={l.stem.position}>
        <cylinderGeometry args={[l.stem.radius, l.stem.radius, l.stem.height, 6]} />
        <meshLambertMaterial color={l.stem.color} flatShading />
      </mesh>
      {/* Shade (truncated cone) */}
      <mesh position={l.shade.position}>
        <cylinderGeometry args={[l.shade.radiusTop, l.shade.radiusBot, l.shade.height, 8, 1, true]} />
        <meshLambertMaterial color={shadeColor} flatShading side={THREE.DoubleSide} />
      </mesh>
      {/* Light glow when on */}
      {lampOn && (
        <mesh position={[l.shade.position[0], l.shade.position[1] - 0.02, l.shade.position[2]]}>
          <sphereGeometry args={[0.18, 8, 6]} />
          <meshBasicMaterial color="#FFE082" transparent opacity={0.1} />
        </mesh>
      )}
    </group>
  );
}

// ---------------------------------------------------------------------------
// Rug — textured plane on floor
// ---------------------------------------------------------------------------
function Rug() {
  const tex = usePixelTexture(FURNITURE.rug.tex);
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={FURNITURE.rug.position}>
      <planeGeometry args={FURNITURE.rug.size} />
      <meshBasicMaterial map={tex} transparent alphaTest={0.1} />
    </mesh>
  );
}

// ---------------------------------------------------------------------------
// Wall sprites — flat items on walls (posters, window, glow stars)
// ---------------------------------------------------------------------------
function WindowSprite({ lampOn, sprite }) {
  const texUrl = lampOn ? sprite.texDay : sprite.texNight;
  const texture = usePixelTexture(texUrl);
  return (
    <group position={sprite.position}>
      <mesh position={[0, 0, -0.02]}>
        <boxGeometry args={[sprite.size[0] + 0.12, sprite.size[1] + 0.12, 0.06]} />
        <meshLambertMaterial color="#6B4830" flatShading />
      </mesh>
      <mesh>
        <planeGeometry args={sprite.size} />
        <meshBasicMaterial map={texture} transparent alphaTest={0.1} />
      </mesh>
      {/* Window cross bars */}
      <mesh position={[0, 0, 0.01]}>
        <boxGeometry args={[sprite.size[0], 0.04, 0.02]} />
        <meshLambertMaterial color="#6B4830" />
      </mesh>
      <mesh position={[0, 0, 0.01]}>
        <boxGeometry args={[0.04, sprite.size[1], 0.02]} />
        <meshLambertMaterial color="#6B4830" />
      </mesh>
      {/* Curtain left */}
      <mesh position={[-sprite.size[0] / 2 - 0.06, 0, 0.02]}>
        <boxGeometry args={[0.12, sprite.size[1] + 0.1, 0.02]} />
        <meshLambertMaterial color="#7B2050" flatShading />
      </mesh>
      {/* Curtain right */}
      <mesh position={[sprite.size[0] / 2 + 0.06, 0, 0.02]}>
        <boxGeometry args={[0.12, sprite.size[1] + 0.1, 0.02]} />
        <meshLambertMaterial color="#7B2050" flatShading />
      </mesh>
    </group>
  );
}

function PosterSprite({ sprite }) {
  const texture = usePixelTexture(sprite.tex);
  return (
    <group position={sprite.position}>
      {/* Frame with depth */}
      <mesh position={[0, 0, -0.015]}>
        <boxGeometry args={[sprite.size[0] + 0.06, sprite.size[1] + 0.06, 0.02]} />
        <meshLambertMaterial color="#222" flatShading />
      </mesh>
      <mesh>
        <planeGeometry args={sprite.size} />
        <meshBasicMaterial map={texture} transparent alphaTest={0.1} />
      </mesh>
    </group>
  );
}

function GlowStarsSprite({ lampOn, sprite }) {
  const meshRef = useRef();
  const texture = usePixelTexture(sprite.tex);
  const targetOpacity = lampOn ? 0.06 : 0.85;

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.material.opacity += (targetOpacity - meshRef.current.material.opacity) * 0.05;
    }
  });

  return (
    <mesh ref={meshRef} position={sprite.position}>
      <planeGeometry args={sprite.size} />
      <meshBasicMaterial map={texture} transparent opacity={targetOpacity} />
    </mesh>
  );
}

function WallDecorations({ lampOn }) {
  return (
    <group>
      {WALL_SPRITES.map((sprite) => {
        if (sprite.id === "fenetre")
          return <WindowSprite key={sprite.id} lampOn={lampOn} sprite={sprite} />;
        if (sprite.id === "glowStars")
          return <GlowStarsSprite key={sprite.id} lampOn={lampOn} sprite={sprite} />;
        return <PosterSprite key={sprite.id} sprite={sprite} />;
      })}
    </group>
  );
}

// ---------------------------------------------------------------------------
// Couette overlay — draped on top of mattress
// ---------------------------------------------------------------------------
function CouetteOverlay({ color }) {
  const texture = useCouetteTexture(color);
  const b = FURNITURE.bed;
  return (
    <mesh
      rotation={[-Math.PI / 2, 0, 0]}
      position={[b.mattress.position[0], b.mattress.position[1] + 0.08, b.mattress.position[2] + 0.3]}
    >
      <planeGeometry args={[b.mattress.size[0] - 0.05, b.mattress.size[2] * 0.6]} />
      <meshBasicMaterial map={texture} transparent opacity={0.7} side={THREE.DoubleSide} />
    </mesh>
  );
}

// ---------------------------------------------------------------------------
// Peluches — low-poly animal shapes on the bed
// ---------------------------------------------------------------------------
function Peluches() {
  const bedY = FURNITURE.bed.mattress.position[1] + FURNITURE.bed.mattress.size[1] / 2;
  const bedZ = FURNITURE.bed.mattress.position[2] - 0.6;

  return (
    <group>
      {/* Ours — body + head */}
      <mesh position={[1.2, bedY + 0.1, bedZ]}>
        <sphereGeometry args={[0.1, 6, 4]} />
        <meshLambertMaterial color="#A0522D" flatShading />
      </mesh>
      <mesh position={[1.2, bedY + 0.22, bedZ]}>
        <sphereGeometry args={[0.07, 6, 4]} />
        <meshLambertMaterial color="#A0522D" flatShading />
      </mesh>
      {/* Oreilles */}
      <mesh position={[1.15, bedY + 0.28, bedZ]}>
        <sphereGeometry args={[0.025, 5, 3]} />
        <meshLambertMaterial color="#8B4513" flatShading />
      </mesh>
      <mesh position={[1.25, bedY + 0.28, bedZ]}>
        <sphereGeometry args={[0.025, 5, 3]} />
        <meshLambertMaterial color="#8B4513" flatShading />
      </mesh>

      {/* Lapin — body + head + ears */}
      <mesh position={[1.5, bedY + 0.08, bedZ + 0.05]}>
        <sphereGeometry args={[0.08, 6, 4]} />
        <meshLambertMaterial color="#DDA0DD" flatShading />
      </mesh>
      <mesh position={[1.5, bedY + 0.18, bedZ + 0.05]}>
        <sphereGeometry args={[0.06, 6, 4]} />
        <meshLambertMaterial color="#DDA0DD" flatShading />
      </mesh>
      {/* Long ears */}
      <mesh position={[1.47, bedY + 0.3, bedZ + 0.05]} rotation={[0, 0, 0.15]}>
        <cylinderGeometry args={[0.015, 0.02, 0.12, 5]} />
        <meshLambertMaterial color="#DDA0DD" flatShading />
      </mesh>
      <mesh position={[1.53, bedY + 0.3, bedZ + 0.05]} rotation={[0, 0, -0.15]}>
        <cylinderGeometry args={[0.015, 0.02, 0.12, 5]} />
        <meshLambertMaterial color="#DDA0DD" flatShading />
      </mesh>

      {/* Chien — body + head */}
      <mesh position={[0.95, bedY + 0.07, bedZ - 0.05]}>
        <sphereGeometry args={[0.07, 6, 4]} />
        <meshLambertMaterial color="#D2B48C" flatShading />
      </mesh>
      <mesh position={[0.95, bedY + 0.15, bedZ - 0.05]}>
        <sphereGeometry args={[0.05, 6, 4]} />
        <meshLambertMaterial color="#D2B48C" flatShading />
      </mesh>
      {/* Museau */}
      <mesh position={[0.95, bedY + 0.14, bedZ + 0.01]}>
        <sphereGeometry args={[0.02, 5, 3]} />
        <meshLambertMaterial color="#8B7355" flatShading />
      </mesh>
    </group>
  );
}

// ---------------------------------------------------------------------------
// Generic 3D object renderer (from layout arrays)
// ---------------------------------------------------------------------------
function Objects3D({ items }) {
  return (
    <group>
      {items.map((obj, i) => {
        const key = `o${i}`;
        const mat = { color: obj.color, flatShading: true };
        if (obj.type === "sphere") {
          return (
            <mesh key={key} position={obj.position} scale={obj.scale || [1, 1, 1]}>
              <sphereGeometry args={[obj.radius, obj.segments, Math.max(4, obj.segments - 2)]} />
              <meshLambertMaterial {...mat} />
            </mesh>
          );
        }
        if (obj.type === "cylinder") {
          return (
            <mesh key={key} position={obj.position} rotation={obj.rotation || [0, 0, 0]}>
              <cylinderGeometry args={[obj.radius, obj.radius, obj.height, obj.segments]} />
              <meshLambertMaterial {...mat} />
            </mesh>
          );
        }
        if (obj.type === "box") {
          return (
            <mesh key={key} position={obj.position} rotation={obj.rotation || [0, 0, 0]}>
              <boxGeometry args={obj.size} />
              <meshLambertMaterial {...mat} />
            </mesh>
          );
        }
        return null;
      })}
    </group>
  );
}

// ---------------------------------------------------------------------------
// Dynamic lighting — smooth lerp between lamp on/off
// ---------------------------------------------------------------------------
function RoomLighting({ lampOn }) {
  const ambientRef = useRef();
  const light1Ref = useRef();
  const light2Ref = useRef();

  const colors = useMemo(() => ({
    onAmb: new THREE.Color(LIGHTING.lampOn.ambient.color),
    offAmb: new THREE.Color(LIGHTING.lampOff.ambient.color),
    lamp: new THREE.Color(LIGHTING.lampOn.lamp.color),
    winOn: new THREE.Color(LIGHTING.lampOn.window.color),
    moon: new THREE.Color(LIGHTING.lampOff.moon.color),
    stars: new THREE.Color(LIGHTING.lampOff.stars.color),
  }), []);

  useFrame(() => {
    if (!ambientRef.current) return;
    const t = 0.05;
    const amb = ambientRef.current;
    const l1 = light1Ref.current;
    const l2 = light2Ref.current;
    const on = lampOn;
    const LA = on ? LIGHTING.lampOn : LIGHTING.lampOff;

    amb.intensity += ((on ? LIGHTING.lampOn.ambient.intensity : LIGHTING.lampOff.ambient.intensity) - amb.intensity) * t;
    amb.color.lerp(on ? colors.onAmb : colors.offAmb, t);

    const t1 = on ? LIGHTING.lampOn.lamp : LIGHTING.lampOff.moon;
    l1.intensity += (t1.intensity - l1.intensity) * t;
    l1.color.lerp(on ? colors.lamp : colors.moon, t);
    l1.position.set(...t1.position);

    const t2 = on ? LIGHTING.lampOn.window : LIGHTING.lampOff.stars;
    l2.intensity += (t2.intensity - l2.intensity) * t;
    l2.color.lerp(on ? colors.winOn : colors.stars, t);
    l2.position.set(...t2.position);
  });

  const ia = lampOn ? LIGHTING.lampOn.ambient : LIGHTING.lampOff.ambient;
  const i1 = lampOn ? LIGHTING.lampOn.lamp : LIGHTING.lampOff.moon;
  const i2 = lampOn ? LIGHTING.lampOn.window : LIGHTING.lampOff.stars;

  return (
    <>
      <ambientLight ref={ambientRef} intensity={ia.intensity} color={ia.color} />
      <pointLight ref={light1Ref} intensity={i1.intensity} color={i1.color} position={i1.position} distance={6} decay={2} />
      <pointLight ref={light2Ref} intensity={i2.intensity} color={i2.color} position={i2.position} distance={8} decay={2} />
    </>
  );
}

// ---------------------------------------------------------------------------
// Main scene export
// ---------------------------------------------------------------------------
export default function RoomScene({ lampOn, couetteColor }) {
  return (
    <>
      <CameraRig />
      <RoomLighting lampOn={lampOn} />
      <RoomBox />

      {/* 3D Furniture */}
      <Bed />
      <Nightstand />
      <Shelf />
      <Lamp3D lampOn={lampOn} />
      <Rug />

      {/* Wall decorations (flat sprites) */}
      <WallDecorations lampOn={lampOn} />

      {/* Couette on bed */}
      <CouetteOverlay color={couetteColor} />

      {/* Peluches on bed */}
      <Peluches />

      {/* Items on nightstand */}
      <Objects3D items={NIGHTSTAND_ITEMS} />

      {/* Items on shelves */}
      <Objects3D items={SHELF_ITEMS} />

      {/* Floor objects */}
      <Objects3D items={FLOOR_OBJECTS} />
    </>
  );
}
