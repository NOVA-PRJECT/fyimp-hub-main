function NotFound({ title = "Page not found", message }) {
  return (
    <div style={{ padding: "2rem", textAlign: "center" }}>
      <h2>{title}</h2>
      <p style={{ opacity: 0.7 }}>
        {message || "The page you are looking for doesn’t exist."}
      </p>
    </div>
  );
}

export default NotFound;