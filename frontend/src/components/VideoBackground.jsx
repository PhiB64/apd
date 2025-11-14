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
        className="w-full h-full object-cover overflow-hidden"
      />
    </div>
  );
}
