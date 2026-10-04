import React from "react";
import Image from "next/image";
import { userCustomDecorations, type CustomDecorationItem } from "@/data/decorations";

interface CustomDecorationsMountProps {
  section: CustomDecorationItem["targetSection"];
}

export function CustomDecorationsMount({ section }: CustomDecorationsMountProps) {
  const items = userCustomDecorations.filter(
    (item) => item.targetSection === section
  );

  if (items.length === 0) return null;

  return (
    <div
      aria-hidden="true"
      className="absolute inset-0 pointer-events-none overflow-hidden -z-0"
    >
      {items.map((item) => {
        const anchorStyles = {
          "top-left": "top-4 left-4",
          "top-right": "top-4 right-4",
          "bottom-left": "bottom-4 left-4",
          "bottom-right": "bottom-4 right-4",
          "gutter-left": "top-1/2 -translate-y-1/2 -left-2 md:left-6",
          "gutter-right": "top-1/2 -translate-y-1/2 -right-2 md:right-6",
          custom: "",
        };

        return (
          <div
            key={item.id}
            style={{
              transform: `rotate(${item.rotation || 0}deg) scale(${
                item.scale || 1
              })`,
            }}
            className={`absolute ${anchorStyles[item.anchor]} transition-transform duration-300 opacity-90`}
          >
            {item.imageSrc ? (
              <div className="relative w-20 h-20 md:w-28 md:h-28">
                <Image
                  src={item.imageSrc}
                  alt={item.label || "Hiasan Kustom"}
                  fill
                  sizes="120px"
                  className="object-contain drop-shadow-md"
                />
              </div>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}
