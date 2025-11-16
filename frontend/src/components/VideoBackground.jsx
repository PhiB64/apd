export default function VideoBackground({ videoUrl }) {
  if (!videoUrl) return null;

  return (
    <div className="fixed inset-0 z-0 w-full h-full overflow-hidden pointer-events-none">
      <video
        src={videoUrl}
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        className="absolute inset-0 w-full h-full object-cover transition-opacity duration-1000"
      />
    </div>
  );
}
