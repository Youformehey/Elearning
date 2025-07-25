import React, { useState, useEffect } from "react";
import HomeNavbar from "../../Components/HomeNavbar"; // ✅ Correct
import CountUp from "react-countup";

export default function About() {
  const [start, setStart] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setStart(false);
      setTimeout(() => setStart(true), 100);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="font-sans bg-white text-[#0f172a]">
      <Navbar />

      {/* Hero */}
      <section className="bg-white text-center py-20 px-6">
        <h1 className="text-4xl md:text-5xl font-bold mb-6">About LearnUp</h1>
        <p className="max-w-3xl mx-auto text-gray-600 text-lg">
          At LearnUp, we believe language is the key to connection. Our mission is to empower
          learners through interactive, expert-led courses designed to help everyone — from beginners
          to pros — grow confidently.
        </p>
      </section>

      {/* Stats */}
      <section className="bg-[#f8fbff] py-12 grid grid-cols-2 md:grid-cols-4 text-center text-blue-900">
        <StatBox label="Years of Experience" value={9} suffix="+" start={start} />
        <StatBox label="Courses Offered" value={47} suffix="+" start={start} />
        <StatBox label="Teachers Worldwide" value={70} start={start} />
        <StatBox label="Happy Students" value={67589} suffix="+" start={start} />
      </section>

      {/* Why Choose Us */}
      <section className="py-20 px-6 text-center">
        <h2 className="text-3xl font-bold mb-6 text-blue-900">Why Choose LearnUp</h2>
        <p className="max-w-xl mx-auto text-gray-600 mb-10">
          Our platform is designed for real learners. We focus on quality, accessibility, and
          personalization.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto text-left">
          <Feature text="✔ Certified Native Instructors" />
          <Feature text="✔ Flexible Online Schedule" />
          <Feature text="✔ Personalized Feedback" />
          <Feature text="✔ Community & Peer Support" />
          <Feature text="✔ Live & On-Demand Lessons" />
          <Feature text="✔ Beginner to Advanced Tracks" />
        </div>
      </section>

      {/* Partners */}
      <section className="bg-white py-24 px-8">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-10 items-center">
          <div>
            <h2 className="text-3xl font-bold text-[#0f172a] mb-4">
              Trusted by the World's Leading Organisations
            </h2>
            <p className="text-gray-600">
              We collaborate with the best institutions to ensure top-quality language education.
            </p>
          </div>

          <div className="grid grid-cols-3 md:grid-cols-6 gap-4 opacity-70">
            {[...Array(6)].map((_, i) => (
              <img
                key={i}
                src={`/company${i + 1}.png`}
                alt={`Partner ${i + 1}`}
                className="h-10 object-contain"
              />
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="bg-blue-800 text-white py-20 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-16">Meet the Passionate Team</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
            {[
              { name: "Nat Reynolds", role: "Founder", img: "/team1.jpg" },
              { name: "Sasha Payne", role: "Co-Founder", img: "/team2.jpg" },
              { name: "Jennie Roberts", role: "Manager", img: "/team3.jpg" },
              { name: "Mila Parker", role: "Spanish Teacher", img: "/team4.jpg" },
              { name: "Monica Pouli", role: "English Teacher", img: "/team5.jpg" },
              { name: "Walter Lilly", role: "French Teacher", img: "/team6.jpg" },
            ].map((member, i) => (
              <TeamCard key={i} {...member} />
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#f8fbff] text-black text-xl  py-10 text-center ">
        <p>&copy; {new Date().getFullYear()} LearnUp. All rights reserved.</p>
      </footer>
    </div>
  );
}

// Stat Box
function StatBox({ label, value, suffix = "", start }) {
  return (
    <div>
      <div className="text-4xl font-bold">
        {start && <CountUp end={value} duration={2.5} />} {suffix}
      </div>
      <div className="text-sm mt-2 text-gray-600">{label}</div>
    </div>
  );
}

// Feature Bullet
function Feature({ text }) {
  return <div className="text-gray-700">{text}</div>;
}

// Team Card
function TeamCard({ name, role, img }) {
  return (
    <div className="bg-white text-[#0f172a] rounded-xl p-6 space-y-4 hover:scale-105 transition duration-300">
      <img
        src={img}
        alt={name}
        className="w-28 h-28 mx-auto rounded-full object-cover border-4 border-white"
      />
      <h3 className="text-xxl font-bold">{name}</h3>
      <p className="text-sm">{role}</p>
      <div className="flex justify-center gap-4 text-lg text-blue-600">
        <i className="fab fa-facebook-f" />
        <i className="fab fa-twitter" />
        <i className="fab fa-instagram" />
      </div>
    </div>
  );
}
