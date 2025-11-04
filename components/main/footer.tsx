"use client";

import Image from "next/image";
import { useEffect } from "react";

export const Footer = () => {
  useEffect(() => {
    const Pupils = document.getElementsByClassName("footer-pupil");
    const pupilsArr = Array.from(Pupils) as HTMLElement[];

    let pupilStartPoint = -10;
    let pupilRangeX = 20;
    let pupilRangeY = 15;
    let mouseXStartPoint = 0;
    let mouseXEndPoint = window.innerWidth;
    let currentXPosition = 0;
    let fracXValue = 0;
    let mouseYEndPoint = window.innerHeight;
    let currentYPosition = 0;
    let fracYValue = 0;
    let mouseXRange = mouseXEndPoint - mouseXStartPoint;

    const mouseMove = (e: MouseEvent) => {
      fracXValue =
        (currentXPosition = e.clientX - mouseXStartPoint) / mouseXRange;
      fracYValue = (currentYPosition = e.clientY) / mouseYEndPoint;

      const translateX = pupilStartPoint + fracXValue * pupilRangeX;
      const translateY = pupilStartPoint + fracYValue * pupilRangeY;

      pupilsArr.forEach((pupil) => {
        pupil.style.transform = `translate(${translateX}px, ${translateY}px)`;
      });
    };

    const windowResize = () => {
      mouseXEndPoint = window.innerWidth;
      mouseYEndPoint = window.innerHeight;
      mouseXRange = mouseXEndPoint - mouseXStartPoint;
    };

    window.addEventListener("mousemove", mouseMove);
    window.addEventListener("resize", windowResize);

    return () => {
      window.removeEventListener("mousemove", mouseMove);
      window.removeEventListener("resize", windowResize);
    };
  }, []);
  // Scroll to top handler
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer
      id="footer"
      className="relative w-full border-t border-[var(--tech-stack-box-border-color)] overflow-hidden"
    >
      {/* Back to top button */}
      <button
        onClick={scrollToTop}
        className="absolute top-6 left-6 text-white text-sm px-4 py-2 rounded-md transition"
      >
        ← BACK TO TOP
      </button>

      {/* Background blob */}
      <div className="relative w-full h-screen flex items-end justify-center">
        <div className="w-full h-[200px] rounded-full blur-[100px] opacity-70" />
      </div>

      {/* Foreground content */}
      <div className="absolute top-0 w-full h-screen flex flex-col items-center justify-end">
        <div className="flex flex-col items-center justify-end w-full">
          {/* Quote */}
          <div className="text-[#b3b3b3] flex items-center justify-center h-[100px] w-full">
            <article className="text-3xl md:text-4xl text-center">
              Learning, Living, and Leveling Up.
            </article>
          </div>

          {/* Social media */}
          <div className="flex flex-col items-center justify-center w-full">
            <div className="flex items-center justify-center h-[80px] w-full">
              <article className="text-2xl font-bold bg-gradient-to-r from-[var(--color-light-blue)] via-[var(--color-light-purple)] to-[var(--color-light-blue)] bg-clip-text text-transparent">
                GetinTouch();
              </article>
            </div>

            {/* Social icons */}
            <div className="flex justify-center items-center gap-8 h-[80px] w-full">
              {/* Instagram */}
              <a
                href="https://www.instagram.com/pexel_ui/"
                target="_blank"
                className="social-icon"
                aria-label="Instagram"
              >
                <svg viewBox="0 0 448 512" className="w-7 fill-white">
                  <path d="M224.1 141c-63.6...z" />
                </svg>
              </a>

              {/* LinkedIn */}
              <a
                href="https://www.linkedin.com/in/vinod-jangid-b401111a1"
                target="_blank"
                className="social-icon"
                aria-label="LinkedIn"
              >
                <svg viewBox="0 0 448 512" className="w-7 fill-white">
                  <path d="M100.28 448H7.4...z" />
                </svg>
              </a>

              {/* GitHub */}
              <a
                href="https://github.com/vinodjangid07"
                target="_blank"
                className="social-icon"
                aria-label="GitHub"
              >
                <svg viewBox="0 0 496 512" className="w-7 fill-white">
                  <path d="M165.9 397.4c0 2...z" />
                </svg>
              </a>

              {/* Gmail */}
              <a
                href="mailto:infovinodjangid@gmail.com"
                target="_blank"
                className="social-icon"
                aria-label="Gmail"
              >
                <svg viewBox="0 0 512 512" className="w-7 fill-white">
                  <path d="M64 112c-8.8...z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Avatar section */}
          <div className="relative w-[220px] mt-5 flex items-end justify-center">
            <Image
              src="/footer.png"
              alt="Footer avatar"
              width={220}
              height={220}
              className="z-[2]"
            />

            {/* Avatar eyes */}
            <div className="absolute w-full h-[97%] flex items-center justify-center gap-4 pl-1 z-[1]">
              <div className="footer-eye shadow-inner-left">
                <div className="footer-pupil" />
              </div>
              <div className="footer-eye shadow-inner-right">
                <div className="footer-pupil" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
