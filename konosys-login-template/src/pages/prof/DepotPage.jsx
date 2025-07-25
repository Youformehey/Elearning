import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { FiUpload } from "react-icons/fi";

const DepotPage = () => {
  const { id } = useParams();
  const [file, setFile] = useState(null);

  return (
    <div className="p-10 max-w-3xl mx-auto bg-white rounded-xl shadow">
      <h2 className="text-2xl font-bold text-green-700 mb-4">
        Dépôt de devoir - {id}
      </h2>
      <div className="space-y-4">
        <label className="flex items-center gap-3">
          <FiUpload className="text-xl text-green-500" />
          <input type="file" onChange={(e) => setFile(e.target.files[0])} />
        </label>
        {file && (
          <p className="text-sm text-gray-700">
            ✅ Fichier sélectionné : {file.name}
          </p>
        )}
      </div>
    </div>
  );
};

export default DepotPage;
