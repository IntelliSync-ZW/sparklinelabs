import Image from "next/image";
import { urlFor } from "@/sanity/lib/image";

type SanityImageValue = { asset?: { _ref?: string } };

/** Width and height from an asset id such as image-abc123-1200x800-jpg. */
function aspectRatio(ref: string) {
  const m = /-(\d+)x(\d+)-[a-z]+$/.exec(ref);
  return m ? Number(m[2]) / Number(m[1]) : 9 / 16;
}

/** Preview of a Sanity image, honouring any crop or hotspot set in Studio. */
export function SanityPreviewImage({
  image,
  width,
  alt,
  className,
  sizes,
}: {
  image: SanityImageValue;
  width: number;
  alt: string;
  className?: string;
  sizes?: string;
}) {
  if (!image.asset?._ref) return null;
  return (
    <Image
      src={urlFor(image).width(width).url()}
      alt={alt}
      width={width}
      height={Math.round(width * aspectRatio(image.asset._ref))}
      className={className}
      sizes={sizes}
    />
  );
}
