// Lightweight India political map rendered via Wikimedia Commons SVG.
// Using an <img> keeps the bundle small and avoids pulling a mapping library.

export function IndiaMap({ className = "" }: { className?: string }) {
  return (
    <img
      src="https://upload.wikimedia.org/wikipedia/commons/thumb/4/4c/India-locator-map-blank.svg/640px-India-locator-map-blank.svg.png"
      alt="Map of India showing states served by our Udyam Adhar consultancy"
      loading="lazy"
      decoding="async"
      width={640}
      height={720}
      className={"mx-auto w-full max-w-md h-auto " + className}
    />
  );
}
