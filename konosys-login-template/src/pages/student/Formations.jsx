import React from "react";

const fakeFormations = [
  {
    id: 1,
    titre: "🧠 Apprendre à apprendre",
    prix: "29€",
    description: "Une formation pour mieux s’organiser et réussir ses révisions.",
  },
  {
    id: 2,
    titre: "💻 Premiers pas en programmation",
    prix: "49€",
    description: "Découvre le monde du code avec des exercices simples et ludiques.",
  },
  {
    id: 3,
    titre: "✍️ Devenir un pro de la rédaction",
    prix: "39€",
    description: "Améliore ton orthographe et ton expression écrite.",
  },
];

export default function Formations() {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-3xl font-bold text-blue-700 mb-6">🎓 Formations disponibles</h2>

      <div className="grid md:grid-cols-2 gap-6">
        {fakeFormations.map((f) => (
          <div key={f.id} className="bg-white shadow p-6 rounded-xl border border-gray-200">
            <h3 className="text-xl font-semibold text-gray-800 mb-2">{f.titre}</h3>
            <p className="text-sm text-gray-600 mb-3">{f.description}</p>
            <p className="text-lg font-bold text-green-600 mb-4">{f.prix}</p>
            <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded">
              Acheter
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
