"use client";

import Image from "next/image";
import { useEffect } from "react";
import { BsGithub } from "react-icons/bs";
import { FaLinkedin } from "react-icons/fa";
import { SiGmail } from "react-icons/si";

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

  return (
    <footer
      id="footer"
      className="relative w-full border-t border-[var(--tech-stack-box-border-color)] overflow-hidden"
    >
      {/* Background blob */}
      <div className="relative w-full h-[80vh] flex items-end justify-center">
        <div className="w-full h-[200px] rounded-full blur-[100px] opacity-70" />
      </div>

      {/* Foreground content */}
      <div className="absolute bottom-0 w-full flex flex-col items-center justify-end">
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

            <div className="flex justify-center items-center gap-8 h-[80px] w-full">
              <a
                href="https://www.linkedin.com/in/madhav-bansal-b81349200/"
                target="_blank"
                rel="noopener noreferrer"
                className="social-icon inline-flex items-center justify-center p-2 rounded-full hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                aria-label="LinkedIn"
              >
                <FaLinkedin className="text-white w-9 h-9" />
              </a>

              {/* GitHub */}
              <a
                href="https://github.com/20bcs9772"
                target="_blank"
                className="social-icon"
                aria-label="GitHub"
              >
                <BsGithub className="text-white w-9 h-9" />
              </a>

              {/* Gmail */}
              <a
                href="mailto:bansalmadhav787@gmail.com"
                target="_blank"
                className="social-icon"
                aria-label="Gmail"
              >
                <SiGmail className="text-white w-9 h-9" />
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
