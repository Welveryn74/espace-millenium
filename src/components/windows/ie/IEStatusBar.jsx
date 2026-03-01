export default function IEStatusBar({ statusText }) {
  return (
    <div style={{
      background: "#ECE9D8", borderTop: "1px solid #bbb",
      padding: "2px 10px", fontSize: 10, color: "#555",
      fontFamily: "Tahoma, sans-serif", flexShrink: 0,
    }}>
      {statusText}
    </div>
  );
}
