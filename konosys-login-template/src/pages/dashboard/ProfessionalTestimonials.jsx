import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRef, useEffect } from "react";

const testimonials = [
  {
    name: "Aymen Ben Youssef",
    role: "Étudiant M1, Université de Tunis",
    text: "LearnUp est une plateforme intuitive et très professionnelle. J’ai progressé rapidement grâce aux ressources bien organisées.",
    image: "/user1.jpg",
  },
  {
    name: "Ines Trabelsi",
    role: "Étudiante L3, ESSECT",
    text: "Une expérience d’apprentissage moderne et fluide. Les quiz interactifs et forums ont enrichi mon parcours.",
    image: "/user2.jpg",
  },
  {
    name: "Yassine Mejri",
    role: "Professeur Associé, IHEC",
    text: "Excellent outil pour diffuser mes cours et suivre la progression des étudiants.",
    image: "/user3.jpg",
  },
  {
    name: "Syrine Khalfallah",
    role: "Étudiante M2, ISG Tunis",
    text: "Une interface claire, des supports variés et une réelle communauté éducative.",
    image: "/user4.jpg",
  },
];

export default function ProfessionalTestimonials() {
  const scrollRef = useRef(null);

  // Scroll automatique
  useEffect(() => {
    const interval = setInterval(() => {
      if (scrollRef.current) {
        scrollRef.current.scrollBy({ left: 320, behavior: "smooth" });
      }
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  // Scroll manuel via flèches
  const scroll = (direction) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({
        left: direction === "left" ? -320 : 320,
        behavior: "smooth",
      });
    }
  };

  return (
    <section className="bg-white py-20 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto text-center space-y-10">
        <h2 className="text-4xl font-extrabold text-blue-800">Ils nous font confiance</h2>

        <div
          ref={scrollRef}
          className="overflow-x-auto scrollbar-hide flex gap-8 sm:gap-12 px-4 sm:px-0 transition-all duration-300"
        >
          {testimonials.map((t, i) => (
            <div
              key={i}
              className="min-w-[300px] max-w-sm bg-blue-50 border border-blue-100 rounded-2xl p-6 shadow hover:shadow-lg transition-all text-left flex-shrink-0"
            >
              <p className="text-gray-700 italic mb-4">“{t.text}”</p>
              <div className="flex items-center gap-4">
                <img
                  src={t.image}
                  alt={t.name}
                  className="w-16 h-16 rounded-full border-2 border-blue-700 object-cover"
                />
                <div>
                  <p className="font-bold text-blue-900">{t.name}</p>
                  <p className="text-sm text-gray-500">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Boutons de navigation */}
        <div className="hidden sm:flex justify-center gap-4 mt-6 text-blue-800">
          <button onClick={() => scroll("left")}><ChevronLeft size={32} /></button>
          <button onClick={() => scroll("right")}><ChevronRight size={32} /></button>
        </div>
      </div>
    </section>
  );
}
