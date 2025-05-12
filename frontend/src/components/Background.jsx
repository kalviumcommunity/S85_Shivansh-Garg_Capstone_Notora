import { Blobs } from "./Decor";

export default function Background() {
  return (
    <>
      {/* Abstract SVG blobs */}
      <Blobs />
      {/* Subtle texture overlay */}
      <div className="absolute inset-0 bg-[url('/textures/abstract-texture.png')] bg-cover opacity-10" />
    </>
  );
}