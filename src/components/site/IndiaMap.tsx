// India map served from local public images.
const mapImg = "/images/india-map.png";

export function IndiaMap({ className = "" }: { className?: string }) {
  return (
    <img
      src={mapImg}
      alt="Map of India showing states served by our Udyam Adhar consultancy"
      loading="lazy"
      decoding="async"
      width={1814}
      height={2048}
      className={"mx-auto w-full max-w-md h-auto " + className}
    />
  );
}