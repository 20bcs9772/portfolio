import { cardImages, projectData } from "@/constants";

export class CardStreamController {
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
  particleScannerRef: any;

  constructor(
    container: HTMLDivElement,
    cardLine: HTMLDivElement,
    speedCallback: (speed: number) => void,
    particleScannerRef: any
  ) {
    this.container = container;
    this.cardLine = cardLine;
    this.speedCallback = speedCallback;
    this.particleScannerRef = particleScannerRef;
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
    this.cardLine.addEventListener("selectstart", (e) => e.preventDefault());
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
      "absolute top-2 right-2 z-[6] px-3 py-1 rounded-full text-xs font-semibold bg-white/90 hover:bg-white text-purple-900 shadow ring-1 ring-black/10 border border-purple-900";
    normalCard.appendChild(cardImage);
    normalCard.appendChild(viewBtn);

    const asciiCard = document.createElement("div");
    asciiCard.className =
      "absolute top-0 left-0 w-[400px] h-[250px] rounded-[15px] overflow-hidden bg-transparent z-[1]";
    asciiCard.style.clipPath = "inset(0 calc(100% - var(--clip-left, 0%)) 0 0)";

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

      const normalCard = wrapper.querySelector<HTMLDivElement>(".z-\\[2\\]");
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
          normalCard.style.setProperty("--clip-right", `${normalClipRight}%`);
        }
        if (asciiCard) {
          asciiCard.style.setProperty("--clip-left", `${asciiClipLeft}%`);
        }

        if (!wrapper.hasAttribute("data-scanned") && scannerIntersectLeft > 0) {
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
          if (normalCard) normalCard.style.setProperty("--clip-right", "100%");
          if (asciiCard) asciiCard.style.setProperty("--clip-left", "100%");
        } else if (cardLeft > scannerRight) {
          if (normalCard) normalCard.style.setProperty("--clip-right", "0%");
          if (asciiCard) asciiCard.style.setProperty("--clip-left", "0%");
        }
        wrapper.removeAttribute("data-scanned");
      }
    });

    if (this.particleScannerRef.current) {
      this.particleScannerRef.current.setScanningActive(anyScanningActive);
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
