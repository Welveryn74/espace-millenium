export default function PageAboutBlank() {
  return (
    <div style={{ minHeight: "100%", background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column" }}>
      <div style={{ color: "#f0f0f0", fontSize: 11, fontFamily: "Tahoma, sans-serif", textAlign: "center", userSelect: "none" }}>
        Tu t'attendais à quoi ? C'est about:blank.
      </div>
      <pre style={{ color: "#f4f4f4", fontSize: 8, fontFamily: "monospace", marginTop: 20, lineHeight: 1.2, userSelect: "none" }}>
{`    ___
   /   \\
  | o o |
  |  >  |
  | \\_/ |
   \\___/
  /|   |\\
 / |___| \\
   || ||
  ~Clippy~`}
      </pre>
    </div>
  );
}
