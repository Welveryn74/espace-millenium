import { useState } from "react";

export default function NostalImg({ src, fallback, size = 32, alt = "", style, className }) {
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    return <span style={{ fontSize: size, lineHeight: 1, ...style }} className={className}>{fallback}</span>;
  }

  return (
    <img
      src={src}
      alt={alt || fallback}
      draggable={false}
      onError={() => setFailed(true)}
      style={{ width: size, height: size, objectFit: "contain", ...style }}
      className={className}
    />
  );
}
