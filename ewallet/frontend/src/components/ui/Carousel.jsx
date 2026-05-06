import React from "react";
import "./carousel.css";

export default function Carousel({ items, render, ariaLabel }) {
  const railRef = React.useRef(null);
  const [index, setIndex] = React.useState(0);

  React.useEffect(() => {
    const el = railRef.current;
    if (!el) return;

    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const children = Array.from(el.children);
        if (!children.length) return;
        const center = el.scrollLeft + el.clientWidth / 2;
        let best = 0;
        let bestDist = Infinity;
        for (let i = 0; i < children.length; i++) {
          const c = children[i];
          const cx = c.offsetLeft + c.clientWidth / 2;
          const d = Math.abs(cx - center);
          if (d < bestDist) {
            bestDist = d;
            best = i;
          }
        }
        setIndex(best);
      });
    };

    el.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => {
      el.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  const scrollTo = (i) => {
    const el = railRef.current;
    if (!el) return;
    const child = el.children[i];
    if (!child) return;
    child.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
  };

  return (
    <div className="carousel" aria-label={ariaLabel}>
      <div className="carousel__fade carousel__fade--l" aria-hidden="true" />
      <div className="carousel__fade carousel__fade--r" aria-hidden="true" />
      <div className="carousel__rail" ref={railRef}>
        {items.map((it, i) => (
          <div className="carousel__slide" key={it.id || i}>
            {render(it, i)}
          </div>
        ))}
      </div>
      <div className="carousel__dots" role="tablist" aria-label="Slides">
        {items.map((_, i) => (
          <button
            key={i}
            type="button"
            className={i === index ? "dot isActive" : "dot"}
            onClick={() => scrollTo(i)}
            aria-label={`Go to slide ${i + 1}`}
            aria-selected={i === index}
          />
        ))}
      </div>
    </div>
  );
}
