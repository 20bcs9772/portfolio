"use client";

import { SparklesIcon } from "@heroicons/react/24/solid";
import { motion } from "framer-motion";
import Image from "next/image";

import {
  slideInFromLeft,
  slideInFromRight,
  slideInFromTop,
} from "@/lib/motion";

export const HeroContent = () => {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      className="flex flex-col lg:flex-row items-center justify-center px-4 sm:px-8 md:px-12 lg:px-20 mt-20 sm:mt-28 md:mt-32 lg:mt-40 w-full z-[20]"
    >
      <div className="h-full w-full flex flex-col gap-5 justify-center m-auto text-start">

        <motion.div
          variants={slideInFromLeft(0.5)}
          className="flex flex-col gap-4 sm:gap-6 mt-4 sm:mt-6 text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-bold text-white max-w-[600px] w-auto h-auto"
        >
          <span>
            I&apos;m{" "}
            <span
              id="name"
              data-aos="fade-in"
              data-aos-delay="200"
              className="inline-flex text-3xl sm:text-4xl md:text-5xl font-bold select-none"
            >
              {"Madhav Bansal".split("").map((char, i) => (
                <span
                  key={i}
                  className="jello cursor-default text-[2.5rem] sm:text-[3.5rem] md:text-[4rem] lg:text-[5rem] text-transparent bg-clip-text bg-gradient-to-r from-purple-800 to-cyan-200"
                >
                  {char === " " ? "\u00A0" : char}
                </span>
              ))}
            </span>{" "}
          </span>
        </motion.div>

        <motion.p
          variants={slideInFromLeft(0.8)}
          className="text-base sm:text-lg text-gray-400 my-3 sm:my-5 max-w-[600px]"
        >
          Full Stack Software Engineer with experience in Website, Mobile, and
          Software development. Check out my projects and skills.
        </motion.p>

        <motion.a
          variants={slideInFromLeft(1)}
          className="py-2 button-primary text-center text-white cursor-pointer rounded-lg max-w-[200px]"
        >
          Learn more
        </motion.a>
      </div>

      <motion.div
        variants={slideInFromRight(0.8)}
        className="w-full h-full flex justify-center items-center mt-8 lg:mt-0"
      >
        <Image
          src="/hero-bg.svg"
          alt="work icons"
          height={650}
          width={650}
          draggable={false}
          className="select-none w-full h-auto max-w-[300px] sm:max-w-[400px] md:max-w-[500px] lg:max-w-[650px]"
        />
      </motion.div>
    </motion.div>
  );
};
