import Image from "next/image";
import { coverMediaAspectRatio, coverMediaClassNames } from "./cover-media.styles";
import type { CoverMediaProps } from "./cover-media.types";

export function CoverMedia({ src, alt, priority = false }: CoverMediaProps) {
  return (
    <div className={coverMediaClassNames.wrapper} style={{ aspectRatio: coverMediaAspectRatio }}>
      <Image
        src={src}
        alt={alt}
        fill
        unoptimized
        priority={priority}
        sizes="(max-width: 1200px) 100vw, 1120px"
        className={coverMediaClassNames.image}
      />
    </div>
  );
}

export { coverMediaAspectRatio, coverMediaClassNames } from "./cover-media.styles";
export type { CoverMediaProps } from "./cover-media.types";
