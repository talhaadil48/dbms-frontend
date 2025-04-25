import Image from "next/image";
import React from "react";
import { bottts } from "@dicebear/collection";
import { createAvatar } from "@dicebear/core";

function Avatar({ seed, className }: { seed: string; className?: string }) {
  const avatar = createAvatar(bottts, {
    seed,
    // Ensure background is not set
    backgroundColor: [], // Explicitly remove background
  });

  const svg = avatar.toString();
  const dataUrl = `data:image/svg+xml;base64,${Buffer.from(svg).toString("base64")}`;

  return (
    <Image
      src={dataUrl}
      alt="Avatar"
      width={100}
      height={100}
      className={className}
    />
  );
}

export default Avatar;
