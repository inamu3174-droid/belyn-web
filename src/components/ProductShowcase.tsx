import { useRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import type { Swiper as SwiperType } from 'swiper';
import { EffectCoverflow, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/effect-coverflow';
import 'swiper/css/navigation';
import { products } from '../data/products';
import ProductCard from './ProductCard';

const Arrow = ({ dir }: { dir: 'l' | 'r' }) => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 16 16"
    aria-hidden="true"
    style={{ transform: dir === 'l' ? 'rotate(180deg)' : undefined }}
  >
    <path
      d="M2 8h11M9 3.5 13.5 8 9 12.5"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default function ProductShowcase() {
  const swiperRef = useRef<SwiperType | null>(null);

  return (
    <section className="showcase" id="best-sellers" aria-labelledby="bs-title">
      <style>{`
        .showcase .showcase__coverflow {
          width: 100%;
          padding: 8px 0 28px !important;
          overflow: hidden;
        }
        .showcase .showcase__coverflow .swiper-slide {
          width: min(280px, 72vw);
          background-position: center;
          background-size: cover;
        }
        .showcase .showcase__coverflow .swiper-slide .pcard {
          width: 100%;
        }
        .showcase .showcase__coverflow .swiper-slide-shadow-left,
        .showcase .showcase__coverflow .swiper-slide-shadow-right {
          background-image: linear-gradient(to left, rgba(57, 44, 34, 0.18), transparent);
        }
      `}</style>

      <div className="showcase__head">
        <h2 id="bs-title" className="h-section">
          BEST SELLERS
        </h2>
        <div className="arrows">
          <button
            className="arrow"
            type="button"
            aria-label="Previous products"
            onClick={() => swiperRef.current?.slidePrev()}
          >
            <Arrow dir="l" />
          </button>
          <button
            className="arrow"
            type="button"
            aria-label="Next products"
            onClick={() => swiperRef.current?.slideNext()}
          >
            <Arrow dir="r" />
          </button>
        </div>
      </div>

      <Swiper
        className="showcase__coverflow"
        modules={[EffectCoverflow, Navigation]}
        effect="coverflow"
        grabCursor
        centeredSlides
        slidesPerView="auto"
        loop
        spaceBetween={0}
        coverflowEffect={{
          rotate: 40,
          stretch: 0,
          depth: 100,
          modifier: 1,
          slideShadows: true,
        }}
        onSwiper={(s) => {
          swiperRef.current = s;
        }}
      >
        {products.map((p) => (
          <SwiperSlide key={p.slug}>
            <ProductCard product={p} />
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}
