type Star = { x: number; y: number; z: number; magenta: boolean };
type DrawingContext = Pick<
  CanvasRenderingContext2D,
  'clearRect' | 'beginPath' | 'moveTo' | 'lineTo' | 'stroke' | 'strokeStyle' | 'lineWidth'
>;

/** The original HTML's projection and per-frame motion, in backing-store pixels. */
export class HyperdriveField {
  private stars: Star[] = [];
  private width = 0;
  private height = 0;
  private dpr = 1;
  private velocity = 0;
  private lastScrollY: number;

  constructor(
    private readonly random: () => number = Math.random,
    initialScrollY = 0,
  ) {
    this.lastScrollY = initialScrollY;
  }

  private reset(star: Star) {
    star.x = (this.random() - 0.5) * 2;
    star.y = (this.random() - 0.5) * 2;
    star.z = this.random();
    star.magenta = this.random() < 0.1;
  }

  resize(viewportWidth: number, viewportHeight: number, devicePixelRatio: number) {
    this.dpr = Math.min(devicePixelRatio || 1, 2);
    this.width = viewportWidth * this.dpr;
    this.height = viewportHeight * this.dpr;
    // The source's `i < min(260, width / 4)` loop rounds fractional counts up.
    const count = Math.ceil(Math.min(260, viewportWidth / 4));
    this.stars.length = count;
    for (let i = 0; i < count; i++) {
      const star = this.stars[i] ?? { x: 0, y: 0, z: 0, magenta: false };
      this.reset(star);
      this.stars[i] = star;
    }
  }

  resume(scrollY: number) {
    this.lastScrollY = scrollY;
    this.velocity = 0;
  }

  draw(ctx: DrawingContext, scrollY: number, mouseX: number, mouseY: number, reduced: boolean) {
    ctx.clearRect(0, 0, this.width, this.height);
    this.velocity += (Math.abs(scrollY - this.lastScrollY) - this.velocity) * 0.12;
    this.lastScrollY = scrollY;
    const speed = reduced ? 0 : 0.0016 + Math.min(this.velocity, 80) * 0.0011;
    const originX = this.width / 2 + mouseX * -80 * this.dpr;
    const originY = this.height * 0.4 + mouseY * -60 * this.dpr;
    const focal = Math.max(this.width, this.height) * 0.55;

    for (const star of this.stars) {
      let previousZ = star.z;
      star.z -= speed;
      if (star.z <= 0.02) {
        this.reset(star);
        star.z = 1;
        previousZ = 1.02;
      }
      const previousX = originX + (star.x / previousZ) * focal * 0.5;
      const previousY = originY + (star.y / previousZ) * focal * 0.5;
      const currentX = originX + (star.x / star.z) * focal * 0.5;
      const currentY = originY + (star.y / star.z) * focal * 0.5;
      if (currentX < 0 || currentX > this.width || currentY < 0 || currentY > this.height) {
        this.reset(star);
        star.z = 1;
        continue;
      }
      const alpha = Math.min(1, (1 - star.z) * 1.3 + 0.1);
      ctx.strokeStyle = star.magenta
        ? `rgba(255,0,127,${alpha})`
        : `rgba(0,240,255,${alpha * 0.68})`;
      ctx.lineWidth = (star.magenta ? 1.8 : 1.1) * this.dpr * (1.2 - star.z);
      ctx.beginPath();
      ctx.moveTo(previousX, previousY);
      ctx.lineTo(currentX + (reduced ? this.dpr : 0), currentY);
      ctx.stroke();
    }
  }
}
