// Loader compacto para Suspense fallbacks entre vistas.
// El loader inicial del primer mount está en index.html para evitar flash.
export default function BootLoader() {
  return (
    <div className="flex items-center justify-center min-h-[40vh] py-12">
      <div className="relative w-12 h-12">
        <div className="absolute inset-0 rounded-full bg-primary/30 blur-md animate-pulse" />
        <div className="absolute inset-0 rounded-full border-2 border-primary/40 border-t-primary-hi animate-spin" />
      </div>
    </div>
  );
}
