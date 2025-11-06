"use client";

import { motion } from "framer-motion";
import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";

const Projects = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const cardLineRef = useRef<HTMLDivElement>(null);
  const particleCanvasRef = useRef<HTMLCanvasElement>(null);
  const scannerCanvasRef = useRef<HTMLCanvasElement>(null);
  const [speed, setSpeed] = useState(80);
  const [isPaused, setIsPaused] = useState(false);

  const controllerRef = useRef<any>(null);
  const particleSystemRef = useRef<any>(null);
  const particleScannerRef = useRef<any>(null);

  useEffect(() => {
    // Images for cards
    // images for cards (unchanged)
    const cardImages = [
      "projects/1.png",
      "projects/2.png",
      "projects/3.png",
      "projects/4.png",
    ];

    const projectData = [
      {
        name: "Restaurant Website | Punjab Ports",
        description:
          "A full-stack restaurant e-commerce website enabling users to create accounts, browse menus, and place online orders with COD or Razorpay payments.",
        skills: ["Frontend Architecture", "State Management", "Accessibility"],
        tech: ["React", "Node.js", "MongoDB", "Tailwind CSS"],
        link: "https://punjabports.com",
      },
      {
        name: "Maritime Website | Nautilus Times",
        description:
          "A modern and responsive platform for Nautilus Times using React, Node.js, Express, and MongoDB.",
        skills: ["Full Stack", "Payment Gateway Integration", "Monetization"],
        tech: ["React", "Node.js", "Express.js", "Nodemailer"],
        link: "https://nautilustimes.com",
      },
      {
        name: "Company Website | Oceaniek Technologies",
        description:
          "Developed a modern, responsive company website for Oceaniek Technologies using Next.js.",
        skills: ["Frontend", "Animation", "Responsive Design"],
        tech: ["Next.js", "Canvas", "Shadcn"],
        link: "https://oceaniektechnologies.com",
      },
      {
        name: "OTT Platform | Oceaniek Stream",
        description:
          "Developed an OTT streaming platform featuring movies, series, and exclusive content, optimized for mobile and TV.",
        skills: ["Full Stack", "Integrations", "Payments"],
        tech: ["Next.js", "PostgreSQL", "Razorpay"],
        link: "https://oceaniekstream.com",
      },
    ];

    class CardStreamController {
      container: HTMLDivElement;
      cardLine: HTMLDivElement;
      position: number;
      velocity: number;
      direction: number;
      isAnimating: boolean;
      isDragging: boolean;
      lastTime: number;
      lastMouseX: number;
      mouseVelocity: number;
      friction: number;
      minVelocity: number;
      containerWidth: number;
      cardLineWidth: number;
      speedCallback: (speed: number) => void;
      animationId: number | null;

      constructor(
        container: HTMLDivElement,
        cardLine: HTMLDivElement,
        speedCallback: (speed: number) => void
      ) {
        this.container = container;
        this.cardLine = cardLine;
        this.speedCallback = speedCallback;
        this.position = 0;
        this.velocity = 120;
        this.direction = -1;
        this.isAnimating = true;
        this.isDragging = false;
        this.lastTime = 0;
        this.lastMouseX = 0;
        this.mouseVelocity = 0;
        this.friction = 0.95;
        this.minVelocity = 80;
        this.containerWidth = 0;
        this.cardLineWidth = 0;
        this.animationId = null;

        this.init();
      }

      init() {
        this.populateCardLine();
        this.calculateDimensions();
        this.setupEventListeners();
        this.updateCardPosition();
        this.animate();
        this.startPeriodicUpdates();
      }

      calculateDimensions() {
        this.containerWidth = this.container.offsetWidth;
        const cardWidth = 400;
        const cardGap = 60;
        const cardCount = this.cardLine.children.length;
        this.cardLineWidth = (cardWidth + cardGap) * cardCount;
      }

      setupEventListeners() {
        this.cardLine.addEventListener("mousedown", (e) => this.startDrag(e));
        document.addEventListener("mousemove", (e) => this.onDrag(e));
        document.addEventListener("mouseup", () => this.endDrag());

        this.cardLine.addEventListener(
          "touchstart",
          (e) => this.startDrag(e.touches[0] as any),
          { passive: false }
        );
        document.addEventListener(
          "touchmove",
          (e) => this.onDrag(e.touches[0] as any),
          {
            passive: false,
          }
        );
        document.addEventListener("touchend", () => this.endDrag());

        this.cardLine.addEventListener("wheel", (e) => this.onWheel(e));
        this.cardLine.addEventListener("selectstart", (e) =>
          e.preventDefault()
        );
        this.cardLine.addEventListener("dragstart", (e) => e.preventDefault());

        window.addEventListener("resize", () => this.calculateDimensions());
      }

      startDrag(e: MouseEvent | Touch) {
        if (e instanceof MouseEvent) e.preventDefault();

        this.isDragging = true;
        this.isAnimating = false;
        this.lastMouseX = e.clientX;
        this.mouseVelocity = 0;

        const transform = window.getComputedStyle(this.cardLine).transform;
        if (transform !== "none") {
          const matrix = new DOMMatrix(transform);
          this.position = matrix.m41;
        }

        this.cardLine.style.animation = "none";
        document.body.style.userSelect = "none";
        document.body.style.cursor = "grabbing";
      }

      onDrag(e: MouseEvent | Touch) {
        if (!this.isDragging) return;
        if (e instanceof MouseEvent) e.preventDefault();

        const deltaX = e.clientX - this.lastMouseX;
        this.position += deltaX;
        this.mouseVelocity = deltaX * 60;
        this.lastMouseX = e.clientX;

        this.cardLine.style.transform = `translateX(${this.position}px)`;
        this.updateCardClipping();
      }

      endDrag() {
        if (!this.isDragging) return;

        this.isDragging = false;

        if (Math.abs(this.mouseVelocity) > this.minVelocity) {
          this.velocity = Math.abs(this.mouseVelocity);
          this.direction = this.mouseVelocity > 0 ? 1 : -1;
        } else {
          this.velocity = 120;
        }

        this.isAnimating = true;
        this.updateSpeedIndicator();

        document.body.style.userSelect = "";
        document.body.style.cursor = "";
      }

      animate() {
        const currentTime = performance.now();
        const deltaTime = (currentTime - this.lastTime) / 1000;
        this.lastTime = currentTime;

        if (this.isAnimating && !this.isDragging) {
          if (this.velocity > this.minVelocity) {
            this.velocity *= this.friction;
          } else {
            this.velocity = Math.max(this.minVelocity, this.velocity);
          }

          this.position += this.velocity * this.direction * deltaTime;
          this.updateCardPosition();
          this.updateSpeedIndicator();
        }

        this.animationId = requestAnimationFrame(() => this.animate());
      }

      updateCardPosition() {
        const containerWidth = this.containerWidth;
        const cardLineWidth = this.cardLineWidth;

        if (this.position < -cardLineWidth) {
          this.position = containerWidth;
        } else if (this.position > containerWidth) {
          this.position = -cardLineWidth;
        }

        this.cardLine.style.transform = `translateX(${this.position}px)`;
        this.updateCardClipping();
      }

      updateSpeedIndicator() {
        this.speedCallback(Math.round(this.velocity));
      }

      toggleAnimation() {
        this.isAnimating = !this.isAnimating;
        if (this.isAnimating) {
          this.cardLine.style.animation = "none";
        }
        return this.isAnimating;
      }

      resetPosition() {
        this.position = this.containerWidth;
        this.velocity = 120;
        this.direction = -1;
        this.isAnimating = true;
        this.isDragging = false;

        this.cardLine.style.animation = "none";
        this.cardLine.style.transform = `translateX(${this.position}px)`;

        this.updateSpeedIndicator();
      }

      changeDirection() {
        this.direction *= -1;
        this.updateSpeedIndicator();
      }

      onWheel(e: WheelEvent) {
        e.preventDefault();

        const scrollSpeed = 20;
        const delta = e.deltaY > 0 ? scrollSpeed : -scrollSpeed;

        this.position += delta;
        this.updateCardPosition();
        this.updateCardClipping();
      }

      // NEW: helper to pick project by index
      private getProject(index: number) {
        return projectData[index % projectData.length];
      }

      // NEW: generate formatted HTML for the project info (replaces ASCII/code text)
      private generateProjectHTML(p: {
        name: string;
        description: string;
        skills: string[];
        tech: string[];
      }) {
        const pill = (t: string) =>
          `<span class="inline-block px-2 py-0.5 text-[11px] leading-[16px] rounded-full bg-white/15 border border-white/20 mr-1 mb-1">${t}</span>`;

        return `
      <div class="w-full h-full p-5 flex flex-col justify-between text-white/95 bg-gradient-to-br from-black/55 via-black/45 to-black/30 backdrop-blur-[1px]">
        <div>
          <h3 class="text-xl font-semibold tracking-tight mb-1">${p.name}</h3>
          <p class="text-sm leading-5 text-white/80 mb-3">${p.description}</p>

          <div class="mb-2">
            <div class="text-[11px] uppercase tracking-wider text-white/60 mb-1">Skills</div>
            <div class="flex flex-wrap -m-[2px]">${p.skills
              .map(pill)
              .join("")}</div>
          </div>

          <div>
            <div class="text-[11px] uppercase tracking-wider text-white/60 mb-1">Tech</div>
            <div class="flex flex-wrap -m-[2px]">${p.tech
              .map(pill)
              .join("")}</div>
          </div>
        </div>
      </div>
    `;
      }

      // NOTE: calculateCodeDimensions + generateCode remain defined earlier;
      // we won't remove them to avoid broader changes, but we no longer use them.

      generateCode(width: number, height: number) {
        // (kept to avoid broader changes; no longer used)
        return "";
      }

      calculateCodeDimensions(cardWidth: number, cardHeight: number) {
        const fontSize = 11;
        const lineHeight = 13;
        const charWidth = 6;
        const width = Math.floor(cardWidth / charWidth);
        const height = Math.floor(cardHeight / lineHeight);
        return { width, height, fontSize, lineHeight };
      }

      createCardWrapper(index: number) {
        const wrapper = document.createElement("div");
        wrapper.className = "relative w-[400px] h-[250px] flex-shrink-0";

        const normalCard = document.createElement("div");
        normalCard.className =
          "absolute top-0 left-0 w-[400px] h-[250px] rounded-[15px] overflow-hidden bg-transparent shadow-[0_15px_40px_rgba(0,0,0,0.4)] z-[2]";
        normalCard.style.clipPath = "inset(0 0 0 var(--clip-right, 0%))";

        const cardImage = document.createElement("img");
        cardImage.className =
          "w-full h-full object-cover rounded-[15px] transition-all duration-300 brightness-110 contrast-110 shadow-[inset_0_0_20px_rgba(0,0,0,0.1)]";
        cardImage.src = cardImages[index % cardImages.length];
        cardImage.alt = "Project Image";

        cardImage.onerror = () => {
          const canvas = document.createElement("canvas");
          canvas.width = 400;
          canvas.height = 250;
          const ctx = canvas.getContext("2d");
          if (ctx) {
            const gradient = ctx.createLinearGradient(0, 0, 400, 250);
            gradient.addColorStop(0, "#667eea");
            gradient.addColorStop(1, "#764ba2");
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, 400, 250);
            cardImage.src = canvas.toDataURL();
          }
        };

        // NEW: "View" button on top-right of each image
        const project = this.getProject(index);
        const viewBtn = document.createElement("a");
        viewBtn.href = project.link;
        viewBtn.target = "_blank";
        viewBtn.rel = "noopener noreferrer";
        viewBtn.textContent = "View";
        viewBtn.className =
          "absolute top-2 right-2 z-[6] px-3 py-1 rounded-full text-xs font-semibold bg-white/90 hover:bg-white text-gray-900 shadow ring-1 ring-black/10";
        normalCard.appendChild(cardImage);
        normalCard.appendChild(viewBtn);

        const asciiCard = document.createElement("div");
        asciiCard.className =
          "absolute top-0 left-0 w-[400px] h-[250px] rounded-[15px] overflow-hidden bg-transparent z-[1]";
        asciiCard.style.clipPath =
          "inset(0 calc(100% - var(--clip-left, 0%)) 0 0)";

        const asciiContent = document.createElement("div");
        asciiContent.className =
          "absolute top-0 left-0 w-full h-full overflow-hidden m-0 p-0 text-left align-top box-border";
        asciiContent.style.cssText = `
      color: rgba(255, 255, 255, 0.95);
      font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, "Apple Color Emoji", "Segoe UI Emoji";
      font-size: 14px;
      line-height: 20px;
      -webkit-mask-image: linear-gradient(to right, rgba(255,255,255,1) 0%, rgba(255,255,255,0.85) 30%, rgba(255,255,255,0.7) 55%, rgba(255,255,255,0.5) 80%, rgba(255,255,255,0.2) 100%);
      mask-image: linear-gradient(to right, rgba(255,255,255,1) 0%, rgba(255,255,255,0.85) 30%, rgba(255,255,255,0.7) 55%, rgba(255,255,255,0.5) 80%, rgba(255,255,255,0.2) 100%);
      background: radial-gradient(120% 100% at 0% 0%, rgba(0,0,0,0.45), transparent 60%), transparent;
      padding: 0;
    `;
        asciiContent.setAttribute("data-idx", String(index));

        // Inject formatted project content (replaces previous ASCII/code)
        asciiContent.innerHTML = this.generateProjectHTML(project);

        asciiCard.appendChild(asciiContent);
        wrapper.appendChild(normalCard);
        wrapper.appendChild(asciiCard);

        return wrapper;
      }

      updateCardClipping() {
        const scannerX = window.innerWidth / 2;
        const scannerWidth = 8;
        const scannerLeft = scannerX - scannerWidth / 2;
        const scannerRight = scannerX + scannerWidth / 2;
        let anyScanningActive = false;

        const wrappers = this.cardLine.querySelectorAll<HTMLDivElement>(
          ".relative.w-\\[400px\\]"
        );
        wrappers.forEach((wrapper) => {
          const rect = wrapper.getBoundingClientRect();
          const cardLeft = rect.left;
          const cardRight = rect.right;
          const cardWidth = rect.width;

          const normalCard =
            wrapper.querySelector<HTMLDivElement>(".z-\\[2\\]");
          const asciiCard = wrapper.querySelector<HTMLDivElement>(".z-\\[1\\]");

          if (cardLeft < scannerRight && cardRight > scannerLeft) {
            anyScanningActive = true;
            const scannerIntersectLeft = Math.max(scannerLeft - cardLeft, 0);
            const scannerIntersectRight = Math.min(
              scannerRight - cardLeft,
              cardWidth
            );

            const normalClipRight = (scannerIntersectLeft / cardWidth) * 100;
            const asciiClipLeft = (scannerIntersectRight / cardWidth) * 100;

            if (normalCard) {
              normalCard.style.setProperty(
                "--clip-right",
                `${normalClipRight}%`
              );
            }
            if (asciiCard) {
              asciiCard.style.setProperty("--clip-left", `${asciiClipLeft}%`);
            }

            if (
              !wrapper.hasAttribute("data-scanned") &&
              scannerIntersectLeft > 0
            ) {
              wrapper.setAttribute("data-scanned", "true");
              const scanEffect = document.createElement("div");
              scanEffect.className =
                "absolute top-0 left-0 w-full h-full pointer-events-none z-[5]";
              scanEffect.style.cssText = `
            background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent);
            animation: scanEffect 0.6s ease-out;
          `;
              wrapper.appendChild(scanEffect);
              setTimeout(() => {
                if (scanEffect.parentNode) {
                  scanEffect.parentNode.removeChild(scanEffect);
                }
              }, 600);
            }
          } else {
            if (cardRight < scannerLeft) {
              if (normalCard)
                normalCard.style.setProperty("--clip-right", "100%");
              if (asciiCard) asciiCard.style.setProperty("--clip-left", "100%");
            } else if (cardLeft > scannerRight) {
              if (normalCard)
                normalCard.style.setProperty("--clip-right", "0%");
              if (asciiCard) asciiCard.style.setProperty("--clip-left", "0%");
            }
            wrapper.removeAttribute("data-scanned");
          }
        });

        if (particleScannerRef.current) {
          particleScannerRef.current.setScanningActive(anyScanningActive);
        }
      }

      updateAsciiContent() {
        const asciiContents = this.cardLine.querySelectorAll<HTMLDivElement>(
          ".absolute.top-0.left-0.w-full.h-full.overflow-hidden"
        );
        asciiContents.forEach((content) => {
          const idxAttr = content.getAttribute("data-idx");
          const idx = idxAttr ? parseInt(idxAttr, 10) : 0;
          const p = this.getProject(idx);
          // Re-render the same structured content to preserve the subtle "glitch/update" feel
          content.innerHTML = this.generateProjectHTML(p);
        });
      }

      populateCardLine() {
        this.cardLine.innerHTML = "";
        const cardsCount = 30;
        for (let i = 0; i < cardsCount; i++) {
          const cardWrapper = this.createCardWrapper(i);
          this.cardLine.appendChild(cardWrapper);
        }
      }

      startPeriodicUpdates() {
        setInterval(() => {
          this.updateAsciiContent();
        }, 200);

        const updateClipping = () => {
          this.updateCardClipping();
          requestAnimationFrame(updateClipping);
        };
        updateClipping();
      }

      destroy() {
        if (this.animationId) {
          cancelAnimationFrame(this.animationId);
        }
      }
    }

    class ParticleSystem {
      scene: THREE.Scene;
      camera: THREE.OrthographicCamera;
      renderer: THREE.WebGLRenderer;
      particles: THREE.Points | null;
      particleCount: number;
      canvas: HTMLCanvasElement;
      velocities: Float32Array;
      alphas: Float32Array;
      animationId: number | null;

      constructor(canvas: HTMLCanvasElement) {
        this.canvas = canvas;
        this.scene = new THREE.Scene();
        this.particleCount = 400;
        this.particles = null;
        this.velocities = new Float32Array();
        this.alphas = new Float32Array();
        this.animationId = null;

        this.camera = new THREE.OrthographicCamera(
          -window.innerWidth / 2,
          window.innerWidth / 2,
          125,
          -125,
          1,
          1000
        );
        this.camera.position.z = 100;

        this.renderer = new THREE.WebGLRenderer({
          canvas: this.canvas,
          alpha: true,
          antialias: true,
        });
        this.renderer.setSize(window.innerWidth, 250);
        this.renderer.setClearColor(0x000000, 0);

        this.init();
      }

      init() {
        this.createParticles();
        this.animate();
        window.addEventListener("resize", () => this.onWindowResize());
      }

      createParticles() {
        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(this.particleCount * 3);
        const colors = new Float32Array(this.particleCount * 3);
        const sizes = new Float32Array(this.particleCount);
        const velocities = new Float32Array(this.particleCount);

        const canvas = document.createElement("canvas");
        canvas.width = 100;
        canvas.height = 100;
        const ctx = canvas.getContext("2d");

        if (ctx) {
          const half = canvas.width / 2;
          const hue = 217;

          const gradient = ctx.createRadialGradient(
            half,
            half,
            0,
            half,
            half,
            half
          );
          gradient.addColorStop(0.025, "#fff");
          gradient.addColorStop(0.1, `hsl(${hue}, 61%, 33%)`);
          gradient.addColorStop(0.25, `hsl(${hue}, 64%, 6%)`);
          gradient.addColorStop(1, "transparent");

          ctx.fillStyle = gradient;
          ctx.beginPath();
          ctx.arc(half, half, half, 0, Math.PI * 2);
          ctx.fill();
        }

        const texture = new THREE.CanvasTexture(canvas);

        for (let i = 0; i < this.particleCount; i++) {
          positions[i * 3] = (Math.random() - 0.5) * window.innerWidth * 2;
          positions[i * 3 + 1] = (Math.random() - 0.5) * 250;
          positions[i * 3 + 2] = 0;

          colors[i * 3] = 1;
          colors[i * 3 + 1] = 1;
          colors[i * 3 + 2] = 1;

          const orbitRadius = Math.random() * 200 + 100;
          sizes[i] = (Math.random() * (orbitRadius - 60) + 60) / 8;

          velocities[i] = Math.random() * 60 + 30;
        }

        geometry.setAttribute(
          "position",
          new THREE.BufferAttribute(positions, 3)
        );
        geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
        geometry.setAttribute("size", new THREE.BufferAttribute(sizes, 1));

        this.velocities = velocities;

        const alphas = new Float32Array(this.particleCount);
        for (let i = 0; i < this.particleCount; i++) {
          alphas[i] = (Math.random() * 8 + 2) / 10;
        }
        geometry.setAttribute("alpha", new THREE.BufferAttribute(alphas, 1));
        this.alphas = alphas;

        const material = new THREE.ShaderMaterial({
          uniforms: {
            pointTexture: { value: texture },
            size: { value: 15.0 },
          },
          vertexShader: `
            attribute float alpha;
            varying float vAlpha;
            varying vec3 vColor;
            uniform float size;
            
            void main() {
              vAlpha = alpha;
              vColor = color;
              vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
              gl_PointSize = size;
              gl_Position = projectionMatrix * mvPosition;
            }
          `,
          fragmentShader: `
            uniform sampler2D pointTexture;
            varying float vAlpha;
            varying vec3 vColor;
            
            void main() {
              gl_FragColor = vec4(vColor, vAlpha) * texture2D(pointTexture, gl_PointCoord);
            }
          `,
          transparent: true,
          blending: THREE.AdditiveBlending,
          depthWrite: false,
          vertexColors: true,
        });

        this.particles = new THREE.Points(geometry, material);
        this.scene.add(this.particles);
      }

      animate() {
        this.animationId = requestAnimationFrame(() => this.animate());

        if (this.particles) {
          const positions = this.particles.geometry.attributes.position
            .array as Float32Array;
          const alphas = this.particles.geometry.attributes.alpha
            .array as Float32Array;
          const time = Date.now() * 0.001;

          for (let i = 0; i < this.particleCount; i++) {
            positions[i * 3] += this.velocities[i] * 0.016;

            if (positions[i * 3] > window.innerWidth / 2 + 100) {
              positions[i * 3] = -window.innerWidth / 2 - 100;
              positions[i * 3 + 1] = (Math.random() - 0.5) * 250;
            }

            positions[i * 3 + 1] += Math.sin(time + i * 0.1) * 0.5;

            const twinkle = Math.floor(Math.random() * 10);
            if (twinkle === 1 && alphas[i] > 0) {
              alphas[i] -= 0.05;
            } else if (twinkle === 2 && alphas[i] < 1) {
              alphas[i] += 0.05;
            }

            alphas[i] = Math.max(0, Math.min(1, alphas[i]));
          }

          this.particles.geometry.attributes.position.needsUpdate = true;
          this.particles.geometry.attributes.alpha.needsUpdate = true;
        }

        this.renderer.render(this.scene, this.camera);
      }

      onWindowResize() {
        this.camera.left = -window.innerWidth / 2;
        this.camera.right = window.innerWidth / 2;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, 250);
      }

      destroy() {
        if (this.animationId) {
          cancelAnimationFrame(this.animationId);
        }
        if (this.renderer) {
          this.renderer.dispose();
        }
        if (this.particles) {
          this.scene.remove(this.particles);
          this.particles.geometry.dispose();
          if (Array.isArray(this.particles.material)) {
            this.particles.material.forEach((m) => m.dispose());
          } else {
            this.particles.material.dispose();
          }
        }
      }
    }

    class ParticleScanner {
      canvas: HTMLCanvasElement;
      ctx: CanvasRenderingContext2D;
      animationId: number | null;
      w: number;
      h: number;
      particles: any[];
      count: number;
      maxParticles: number;
      intensity: number;
      lightBarX: number;
      lightBarWidth: number;
      fadeZone: number;
      scanTargetIntensity: number;
      scanTargetParticles: number;
      scanTargetFadeZone: number;
      scanningActive: boolean;
      baseIntensity: number;
      baseMaxParticles: number;
      baseFadeZone: number;
      currentIntensity: number;
      currentMaxParticles: number;
      currentFadeZone: number;
      transitionSpeed: number;
      gradientCanvas: HTMLCanvasElement;
      gradientCtx: CanvasRenderingContext2D;
      currentGlowIntensity: number;

      constructor(canvas: HTMLCanvasElement) {
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d")!;
        this.animationId = null;
        this.w = window.innerWidth;
        this.h = 300;
        this.particles = [];
        this.count = 0;
        this.maxParticles = 800;
        this.intensity = 0.8;
        this.lightBarX = this.w / 2;
        this.lightBarWidth = 3;
        this.fadeZone = 60;
        this.scanTargetIntensity = 1.8;
        this.scanTargetParticles = 2500;
        this.scanTargetFadeZone = 35;
        this.scanningActive = false;
        this.baseIntensity = this.intensity;
        this.baseMaxParticles = this.maxParticles;
        this.baseFadeZone = this.fadeZone;
        this.currentIntensity = this.intensity;
        this.currentMaxParticles = this.maxParticles;
        this.currentFadeZone = this.fadeZone;
        this.transitionSpeed = 0.05;
        this.currentGlowIntensity = 1;
        this.gradientCanvas = document.createElement("canvas");
        this.gradientCtx = this.gradientCanvas.getContext("2d")!;

        this.setupCanvas();
        this.createGradientCache();
        this.initParticles();
        this.animate();

        window.addEventListener("resize", () => this.onResize());
      }

      setupCanvas() {
        this.canvas.width = this.w;
        this.canvas.height = this.h;
        this.canvas.style.width = this.w + "px";
        this.canvas.style.height = this.h + "px";
        this.ctx.clearRect(0, 0, this.w, this.h);
      }

      onResize() {
        this.w = window.innerWidth;
        this.lightBarX = this.w / 2;
        this.setupCanvas();
      }

      createGradientCache() {
        this.gradientCanvas.width = 16;
        this.gradientCanvas.height = 16;

        const half = this.gradientCanvas.width / 2;
        const gradient = this.gradientCtx.createRadialGradient(
          half,
          half,
          0,
          half,
          half,
          half
        );
        gradient.addColorStop(0, "rgba(255, 255, 255, 1)");
        gradient.addColorStop(0.3, "rgba(196, 181, 253, 0.8)");
        gradient.addColorStop(0.7, "rgba(139, 92, 246, 0.4)");
        gradient.addColorStop(1, "transparent");

        this.gradientCtx.fillStyle = gradient;
        this.gradientCtx.beginPath();
        this.gradientCtx.arc(half, half, half, 0, Math.PI * 2);
        this.gradientCtx.fill();
      }

      random(min: number, max: number) {
        if (arguments.length < 2) {
          max = min;
          min = 0;
        }
        return Math.floor(Math.random() * (max - min + 1)) + min;
      }

      randomFloat(min: number, max: number) {
        return Math.random() * (max - min) + min;
      }

      createParticle() {
        const intensityRatio = this.intensity / this.baseIntensity;
        const speedMultiplier = 1 + (intensityRatio - 1) * 1.2;
        const sizeMultiplier = 1 + (intensityRatio - 1) * 0.7;

        return {
          x:
            this.lightBarX +
            this.randomFloat(-this.lightBarWidth / 2, this.lightBarWidth / 2),
          y: this.randomFloat(0, this.h),
          vx: this.randomFloat(0.2, 1.0) * speedMultiplier,
          vy: this.randomFloat(-0.15, 0.15) * speedMultiplier,
          radius: this.randomFloat(0.4, 1) * sizeMultiplier,
          alpha: this.randomFloat(0.6, 1),
          decay: this.randomFloat(0.005, 0.025) * (2 - intensityRatio * 0.5),
          originalAlpha: 0,
          life: 1.0,
          time: 0,
          startX: 0,
          twinkleSpeed: this.randomFloat(0.02, 0.08) * speedMultiplier,
          twinkleAmount: this.randomFloat(0.1, 0.25),
        };
      }

      initParticles() {
        for (let i = 0; i < this.maxParticles; i++) {
          const particle = this.createParticle();
          particle.originalAlpha = particle.alpha;
          particle.startX = particle.x;
          this.count++;
          this.particles[this.count] = particle;
        }
      }

      updateParticle(particle: any) {
        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.time++;

        particle.alpha =
          particle.originalAlpha * particle.life +
          Math.sin(particle.time * particle.twinkleSpeed) *
            particle.twinkleAmount;

        particle.life -= particle.decay;

        if (particle.x > this.w + 10 || particle.life <= 0) {
          this.resetParticle(particle);
        }
      }

      resetParticle(particle: any) {
        particle.x =
          this.lightBarX +
          this.randomFloat(-this.lightBarWidth / 2, this.lightBarWidth / 2);
        particle.y = this.randomFloat(0, this.h);
        particle.vx = this.randomFloat(0.2, 1.0);
        particle.vy = this.randomFloat(-0.15, 0.15);
        particle.alpha = this.randomFloat(0.6, 1);
        particle.originalAlpha = particle.alpha;
        particle.life = 1.0;
        particle.time = 0;
        particle.startX = particle.x;
      }

      drawParticle(particle: any) {
        if (particle.life <= 0) return;

        let fadeAlpha = 1;

        if (particle.y < this.fadeZone) {
          fadeAlpha = particle.y / this.fadeZone;
        } else if (particle.y > this.h - this.fadeZone) {
          fadeAlpha = (this.h - particle.y) / this.fadeZone;
        }

        fadeAlpha = Math.max(0, Math.min(1, fadeAlpha));

        this.ctx.globalAlpha = particle.alpha * fadeAlpha;
        this.ctx.drawImage(
          this.gradientCanvas,
          particle.x - particle.radius,
          particle.y - particle.radius,
          particle.radius * 2,
          particle.radius * 2
        );
      }

      drawLightBar() {
        const verticalGradient = this.ctx.createLinearGradient(0, 0, 0, this.h);
        verticalGradient.addColorStop(0, "rgba(255, 255, 255, 0)");
        verticalGradient.addColorStop(
          this.fadeZone / this.h,
          "rgba(255, 255, 255, 1)"
        );
        verticalGradient.addColorStop(
          1 - this.fadeZone / this.h,
          "rgba(255, 255, 255, 1)"
        );
        verticalGradient.addColorStop(1, "rgba(255, 255, 255, 0)");

        this.ctx.globalCompositeOperation = "lighter";

        const targetGlowIntensity = this.scanningActive ? 3.5 : 1;
        this.currentGlowIntensity +=
          (targetGlowIntensity - this.currentGlowIntensity) *
          this.transitionSpeed;

        const glowIntensity = this.currentGlowIntensity;
        const lineWidth = this.lightBarWidth;
        const glow1Alpha = this.scanningActive ? 1.0 : 0.8;
        const glow2Alpha = this.scanningActive ? 0.8 : 0.6;
        const glow3Alpha = this.scanningActive ? 0.6 : 0.4;

        const coreGradient = this.ctx.createLinearGradient(
          this.lightBarX - lineWidth / 2,
          0,
          this.lightBarX + lineWidth / 2,
          0
        );
        coreGradient.addColorStop(0, "rgba(255, 255, 255, 0)");
        coreGradient.addColorStop(
          0.3,
          `rgba(255, 255, 255, ${0.9 * glowIntensity})`
        );
        coreGradient.addColorStop(
          0.5,
          `rgba(255, 255, 255, ${1 * glowIntensity})`
        );
        coreGradient.addColorStop(
          0.7,
          `rgba(255, 255, 255, ${0.9 * glowIntensity})`
        );
        coreGradient.addColorStop(1, "rgba(255, 255, 255, 0)");

        this.ctx.globalAlpha = 1;
        this.ctx.fillStyle = coreGradient;

        const radius = 15;
        this.ctx.beginPath();
        this.ctx.roundRect(
          this.lightBarX - lineWidth / 2,
          0,
          lineWidth,
          this.h,
          radius
        );
        this.ctx.fill();

        const glow1Gradient = this.ctx.createLinearGradient(
          this.lightBarX - lineWidth * 2,
          0,
          this.lightBarX + lineWidth * 2,
          0
        );
        glow1Gradient.addColorStop(0, "rgba(139, 92, 246, 0)");
        glow1Gradient.addColorStop(
          0.5,
          `rgba(196, 181, 253, ${0.8 * glowIntensity})`
        );
        glow1Gradient.addColorStop(1, "rgba(139, 92, 246, 0)");

        this.ctx.globalAlpha = glow1Alpha;
        this.ctx.fillStyle = glow1Gradient;

        const glow1Radius = 25;
        this.ctx.beginPath();
        this.ctx.roundRect(
          this.lightBarX - lineWidth * 2,
          0,
          lineWidth * 4,
          this.h,
          glow1Radius
        );
        this.ctx.fill();

        const glow2Gradient = this.ctx.createLinearGradient(
          this.lightBarX - lineWidth * 4,
          0,
          this.lightBarX + lineWidth * 4,
          0
        );
        glow2Gradient.addColorStop(0, "rgba(139, 92, 246, 0)");
        glow2Gradient.addColorStop(
          0.5,
          `rgba(139, 92, 246, ${0.4 * glowIntensity})`
        );
        glow2Gradient.addColorStop(1, "rgba(139, 92, 246, 0)");

        this.ctx.globalAlpha = glow2Alpha;
        this.ctx.fillStyle = glow2Gradient;

        const glow2Radius = 35;
        this.ctx.beginPath();
        this.ctx.roundRect(
          this.lightBarX - lineWidth * 4,
          0,
          lineWidth * 8,
          this.h,
          glow2Radius
        );
        this.ctx.fill();

        if (this.scanningActive) {
          const glow3Gradient = this.ctx.createLinearGradient(
            this.lightBarX - lineWidth * 8,
            0,
            this.lightBarX + lineWidth * 8,
            0
          );
          glow3Gradient.addColorStop(0, "rgba(139, 92, 246, 0)");
          glow3Gradient.addColorStop(0.5, "rgba(139, 92, 246, 0.2)");
          glow3Gradient.addColorStop(1, "rgba(139, 92, 246, 0)");

          this.ctx.globalAlpha = glow3Alpha;
          this.ctx.fillStyle = glow3Gradient;

          const glow3Radius = 45;
          this.ctx.beginPath();
          this.ctx.roundRect(
            this.lightBarX - lineWidth * 8,
            0,
            lineWidth * 16,
            this.h,
            glow3Radius
          );
          this.ctx.fill();
        }

        this.ctx.globalCompositeOperation = "destination-in";
        this.ctx.globalAlpha = 1;
        this.ctx.fillStyle = verticalGradient;
        this.ctx.fillRect(0, 0, this.w, this.h);
      }

      render() {
        const targetIntensity = this.scanningActive
          ? this.scanTargetIntensity
          : this.baseIntensity;
        const targetMaxParticles = this.scanningActive
          ? this.scanTargetParticles
          : this.baseMaxParticles;
        const targetFadeZone = this.scanningActive
          ? this.scanTargetFadeZone
          : this.baseFadeZone;

        this.currentIntensity +=
          (targetIntensity - this.currentIntensity) * this.transitionSpeed;
        this.currentMaxParticles +=
          (targetMaxParticles - this.currentMaxParticles) *
          this.transitionSpeed;
        this.currentFadeZone +=
          (targetFadeZone - this.currentFadeZone) * this.transitionSpeed;

        this.intensity = this.currentIntensity;
        this.maxParticles = Math.floor(this.currentMaxParticles);
        this.fadeZone = this.currentFadeZone;

        this.ctx.globalCompositeOperation = "source-over";
        this.ctx.clearRect(0, 0, this.w, this.h);

        this.drawLightBar();

        this.ctx.globalCompositeOperation = "lighter";
        for (let i = 1; i <= this.count; i++) {
          if (this.particles[i]) {
            this.updateParticle(this.particles[i]);
            this.drawParticle(this.particles[i]);
          }
        }

        const currentIntensity = this.intensity;
        const currentMaxParticles = this.maxParticles;

        if (
          Math.random() < currentIntensity &&
          this.count < currentMaxParticles
        ) {
          const particle = this.createParticle();
          particle.originalAlpha = particle.alpha;
          particle.startX = particle.x;
          this.count++;
          this.particles[this.count] = particle;
        }

        const intensityRatio = this.intensity / this.baseIntensity;

        if (
          intensityRatio > 1.1 &&
          Math.random() < (intensityRatio - 1.0) * 1.2
        ) {
          const particle = this.createParticle();
          particle.originalAlpha = particle.alpha;
          particle.startX = particle.x;
          this.count++;
          this.particles[this.count] = particle;
        }

        if (
          intensityRatio > 1.3 &&
          Math.random() < (intensityRatio - 1.3) * 1.4
        ) {
          const particle = this.createParticle();
          particle.originalAlpha = particle.alpha;
          particle.startX = particle.x;
          this.count++;
          this.particles[this.count] = particle;
        }

        if (this.count > currentMaxParticles + 200) {
          const excessCount = Math.min(15, this.count - currentMaxParticles);
          for (let i = 0; i < excessCount; i++) {
            delete this.particles[this.count - i];
          }
          this.count -= excessCount;
        }
      }

      animate() {
        this.render();
        this.animationId = requestAnimationFrame(() => this.animate());
      }

      setScanningActive(active: boolean) {
        this.scanningActive = active;
      }

      destroy() {
        if (this.animationId) {
          cancelAnimationFrame(this.animationId);
        }
        this.particles = [];
        this.count = 0;
      }
    }

    // Initialize all systems
    if (containerRef.current && cardLineRef.current) {
      controllerRef.current = new CardStreamController(
        containerRef.current,
        cardLineRef.current,
        setSpeed
      );
    }

    if (particleCanvasRef.current) {
      particleSystemRef.current = new ParticleSystem(particleCanvasRef.current);
    }

    if (scannerCanvasRef.current) {
      particleScannerRef.current = new ParticleScanner(
        scannerCanvasRef.current
      );
    }

    // Cleanup
    return () => {
      if (controllerRef.current) {
        controllerRef.current.destroy();
      }
      if (particleSystemRef.current) {
        particleSystemRef.current.destroy();
      }
      if (particleScannerRef.current) {
        particleScannerRef.current.destroy();
      }
    };
  }, []);

  const toggleAnimation = () => {
    if (controllerRef.current) {
      const isAnimating = controllerRef.current.toggleAnimation();
      setIsPaused(!isAnimating);
    }
  };

  const resetPosition = () => {
    if (controllerRef.current) {
      controllerRef.current.resetPosition();
      setIsPaused(false);
    }
  };

  const changeDirection = () => {
    if (controllerRef.current) {
      controllerRef.current.changeDirection();
    }
  };

  return (
    <div id="projects" className="relative w-full overflow-hidden">
      <style jsx>{`
        @keyframes glitch {
          0% {
            opacity: 1;
          }
          15% {
            opacity: 0.9;
          }
          16% {
            opacity: 1;
          }
          49% {
            opacity: 0.8;
          }
          50% {
            opacity: 1;
          }
          99% {
            opacity: 0.9;
          }
          100% {
            opacity: 1;
          }
        }

        @keyframes scanEffect {
          0% {
            transform: translateX(-100%);
            opacity: 0;
          }
          50% {
            opacity: 1;
          }
          100% {
            transform: translateX(100%);
            opacity: 0;
          }
        }
      `}</style>

      {/* Controls */}
      <motion.div className="text-[50px] mt-10 font-medium text-center text-gray-200">
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-cyan-500">
          Projects
        </span>
      </motion.div>
      {/* <div className="absolute top-5 left-5 flex gap-2.5 z-[100]">
        <button
          onClick={toggleAnimation}
          className="px-5 py-2.5 bg-white/20 border-none rounded-xl text-white font-bold cursor-pointer backdrop-blur-sm transition-all duration-300 text-sm hover:bg-white/30 hover:-translate-y-0.5 hover:shadow-[0_5px_15px_rgba(0,0,0,0.2)]"
        >
          {isPaused ? "▶️ Play" : "⏸️ Pause"}
        </button>
        <button
          onClick={resetPosition}
          className="px-5 py-2.5 bg-white/20 border-none rounded-xl text-white font-bold cursor-pointer backdrop-blur-sm transition-all duration-300 text-sm hover:bg-white/30 hover:-translate-y-0.5 hover:shadow-[0_5px_15px_rgba(0,0,0,0.2)]"
        >
          🔄 Reset
        </button>
        <button
          onClick={changeDirection}
          className="px-5 py-2.5 bg-white/20 border-none rounded-xl text-white font-bold cursor-pointer backdrop-blur-sm transition-all duration-300 text-sm hover:bg-white/30 hover:-translate-y-0.5 hover:shadow-[0_5px_15px_rgba(0,0,0,0.2)]"
        >
          ↔️ Direction
        </button>
      </div> */}

      {/* Speed Indicator */}
      {/* <div className="absolute top-5 right-5 text-white text-base bg-black/30 px-4 py-2 rounded-xl backdrop-blur-sm z-[100]">
        Speed: <span>{speed}</span> px/s
      </div> */}

      {/* Main Container */}
      <div className="relative w-full h-[50vh] flex items-center justify-center">
        {/* Particle Canvas (Background) */}
        <canvas
          ref={particleCanvasRef}
          className="absolute top-1/2 left-0 -translate-y-1/2 w-full h-[250px] z-0 pointer-events-none"
        />

        {/* Scanner Canvas (Scanner beam with particles) */}
        <canvas
          ref={scannerCanvasRef}
          className="absolute top-1/2 left-0 -translate-y-1/2 w-full h-[300px] z-[15] pointer-events-none"
        />

        {/* Card Stream */}
        <div
          ref={containerRef}
          className="absolute w-full h-[180px] flex items-center overflow-visible"
        >
          <div
            ref={cardLineRef}
            className="flex items-center gap-[60px] whitespace-nowrap cursor-grab select-none will-change-transform active:cursor-grabbing"
          />
        </div>
      </div>
    </div>
  );
};

export default Projects;
