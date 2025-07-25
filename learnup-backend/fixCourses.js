const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

console.log("📦 MONGO_URI:", process.env.MONGO_URI);

const Course = require("./models/Course");
const Teacher = require("./models/Teacher");

async function fixCourses() {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ Connecté à MongoDB");

    const teacher = await Teacher.findOne({ email: "sofo@gmail.com" });
    if (!teacher) {
      console.error("❌ Professeur 'sofo@gmail.com' non trouvé.");
      return;
    }

    const coursesToFix = await Course.find({
      $or: [
        { teacher: { $exists: false } },
        { teacher: null },
        { teacher: { $type: "string" } },
      ],
    });

    console.log(`🔧 ${coursesToFix.length} cours sans teacher correct`);

    if (coursesToFix.length === 0) return;

    const result = await Course.updateMany(
      {
        _id: { $in: coursesToFix.map(c => c._id) }
      },
      { $set: { teacher: teacher._id } }
    );

    console.log(`✅ ${result.modifiedCount} cours mis à jour avec 'sofo@gmail.com'`);
  } catch (err) {
    console.error("❌ Erreur :", err);
  } finally {
    await mongoose.disconnect();
  }
}

fixCourses();
