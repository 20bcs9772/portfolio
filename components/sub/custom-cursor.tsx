"use client";

import { useEffect } from "react";

export default function CustomCursor() {
  useEffect(() => {
    const cursorInner = document.getElementById("cursor-inner");
    const cursorOuter = document.getElementById("cursor-outer");
    const links = document.querySelectorAll("a, label, button");

    if (!cursorInner || !cursorOuter) return;

    document.addEventListener("mousemove", (e) => {
      const posX = e.clientX;
      const posY = e.clientY;

      cursorInner.style.left = `${posX}px`;
      cursorInner.style.top = `${posY}px`;

      cursorOuter.animate(
        { left: `${posX}px`, top: `${posY}px` },
        { duration: 500, fill: "forwards" }
      );
    });

    links.forEach((el) => {
      el.addEventListener("mouseenter", () => {
        cursorInner.classList.add("hover");
        cursorOuter.classList.add("hover");
      });
      el.addEventListener("mouseleave", () => {
        cursorInner.classList.remove("hover");
        cursorOuter.classList.remove("hover");
      });
    });

    return () => {
      document.removeEventListener("mousemove", () => {});
      links.forEach((el) => {
        el.removeEventListener("mouseenter", () => {});
        el.removeEventListener("mouseleave", () => {});
      });
    };
  }, []);

  return (
    <>
      <div id="cursor-inner" className="cursor-inner fixed" />
      <div id="cursor-outer" className="cursor-outer fixed" />
    </>
  );
}
