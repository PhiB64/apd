export default function ErrorMessage({ type = "loading", message }) {
  const styles = {
    loading: "text-white/80 text-lg font-garamond italic animate-pulse",
    error: "text-white/80 text-lg font-garamond italic",
    empty: "text-white/80 text-lg font-garamond italic",
  };

  return (
    <section className="min-h-screen w-full flex items-center justify-center text-center">
      <p className={styles[type] || styles.error}>{message}</p>
    </section>
  );
}
