export default function IELink({ url, children, navigateTo, style }) {
  return (
    <span
      onClick={() => navigateTo(url)}
      style={{ color: "#0000EE", textDecoration: "underline", cursor: "pointer", ...style }}
    >
      {children}
    </span>
  );
}
