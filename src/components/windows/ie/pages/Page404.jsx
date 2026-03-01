export default function Page404({ url, waybackChecked }) {
  return (
    <div style={{
      fontFamily: "Tahoma, sans-serif", fontSize: 12, padding: 40,
      background: "#fff", minHeight: "100%",
    }}>
      <div style={{ maxWidth: 450, margin: "0 auto" }}>
        <div style={{ display: "flex", alignItems: "flex-start", gap: 16, marginBottom: 20 }}>
          <span style={{ fontSize: 40 }}>⚠️</span>
          <div>
            <h2 style={{ fontSize: 16, color: "#333", margin: "0 0 8px" }}>
              Impossible d'afficher la page
            </h2>
            <p style={{ color: "#555", lineHeight: 1.6 }}>
              La page <strong>http://{url || "..."}</strong> est introuvable. Le serveur est introuvable ou votre connexion 56K a planté.
            </p>
          </div>
        </div>

        <div style={{ background: "#F5F5F5", border: "1px solid #ddd", borderRadius: 4, padding: 16 }}>
          <div style={{ fontWeight: "bold", marginBottom: 8 }}>Essayez ceci :</div>
          <ul style={{ paddingLeft: 20, lineHeight: 1.8, color: "#555" }}>
            <li>Vérifiez que vous avez tapé la bonne adresse</li>
            <li>Demandez à votre grand frère de vérifier la connexion</li>
            <li>Vérifiez que personne n'utilise le téléphone</li>
            <li>Débranchez et rebranchez le modem</li>
          </ul>
        </div>

        {waybackChecked && (
          <div style={{
            marginTop: 16, padding: 12, background: "#FFF8E1",
            border: "1px solid #FFE082", borderRadius: 4,
          }}>
            <div style={{ fontSize: 11, color: "#795548", lineHeight: 1.6 }}>
              🌐 <strong>Archive du Web :</strong> aucune version archivée de cette page n'a été trouvée aux alentours de 2005.
            </div>
          </div>
        )}

        <div style={{ marginTop: 16, fontSize: 10, color: "#888" }}>
          HTTP 404 — Fichier non trouvé<br />
          Internet Explorer 6.0
        </div>
      </div>
    </div>
  );
}
