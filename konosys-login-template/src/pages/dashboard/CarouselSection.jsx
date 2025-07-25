import React, { useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "./CarouselSection.css";

export default function CarouselSection() {
  const prevRef = useRef(null);
  const nextRef = useRef(null);

  return (
    <section className="bg-white py-28 px-8">
      <div className="max-w-[1600px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
        {/* Texte à gauche */}
        <div className="space-y-8 animate-fade-in">
          <h2 className="text-6xl font-extrabold text-blue-800 leading-tight">
            Get the most out of life<br />by improving your English skills
          </h2>

          <p className="text-2xl text-gray-600 font-medium">
            Level up your communication,<br />
            open doors to new opportunities,<br />
            and feel more confident every day.
          </p>

          <p className="text-lg text-gray-500">
            This is your moment to shine. Let's grow together — one word at a time.
          </p>

          <button className="mt-6 px-10 py-4 bg-blue-800 text-white text-xl font-semibold rounded-xl hover:bg-blue-700 transition">
            LEARN MORE
          </button>
        </div>

        {/* Carrousel à droite */}
        <div className="relative">
          <Swiper
            modules={[Navigation, Pagination, Autoplay]}
            pagination={{ clickable: true }}
            autoplay={{ delay: 4000, disableOnInteraction: false }}
            speed={600}
            slidesPerView={1}
            className="rounded-xl shadow-2xl overflow-hidden"
          >
            <SwiperSlide>
              <img
                src="/young-librarian-organising-books.jpg"
                alt="Slide 1"
                className="w-full h-[600px] object-cover"
              />
            </SwiperSlide>
            <SwiperSlide>
              <img
                src="/smiling-boy-visiting-big-ben_114.jpg"
                alt="Slide 2"
                className="w-full h-[600px] object-cover"
              />
            </SwiperSlide>
            <SwiperSlide>
              <img
                src="/it-s-your-result-is-higher-than.jpg"
                alt="Slide 3"
                className="w-full h-[600px] object-cover"
              />
            </SwiperSlide>
          </Swiper>
        </div>
      </div>
    </section>
  );
}
