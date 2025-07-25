// controllers/adminManageController.js

const Student = require("../models/Student");
const Teacher = require("../models/Teacher");

// 📥 Get all students
const getAllStudents = async (req, res) => {
  const students = await Student.find().select("-password");
  res.json(students);
};

// 🧍 Get student by ID
const getStudentById = async (req, res) => {
  const student = await Student.findById(req.params.id).select("-password");
  if (!student) return res.status(404).json({ message: "Student not found" });
  res.json(student);
};

// 🗑 Delete one or multiple students
const deleteStudents = async (req, res) => {
  const ids = req.body.ids || [req.params.id];
  await Student.deleteMany({ _id: { $in: ids } });
  res.json({ message: "Student(s) deleted", deleted: ids });
};

// ➕ Add a student (optionnel si tu veux que seul l'admin puisse créer)
const createStudent = async (req, res) => {
  const { name, email, password } = req.body;
  const exists = await Student.findOne({ email });
  if (exists) return res.status(400).json({ message: "Email already used" });
  const student = await Student.create({ name, email, password });
  res.status(201).json(student);
};

// 🔁 Pareil pour les Teachers :

const getAllTeachers = async (req, res) => {
  const teachers = await Teacher.find().select("-password");
  res.json(teachers);
};

const getTeacherById = async (req, res) => {
  const teacher = await Teacher.findById(req.params.id).select("-password");
  if (!teacher) return res.status(404).json({ message: "Teacher not found" });
  res.json(teacher);
};

const deleteTeachers = async (req, res) => {
  const ids = req.body.ids || [req.params.id];
  await Teacher.deleteMany({ _id: { $in: ids } });
  res.json({ message: "Teacher(s) deleted", deleted: ids });
};

const createTeacher = async (req, res) => {
  const { name, email, password } = req.body;
  const exists = await Teacher.findOne({ email });
  if (exists) return res.status(400).json({ message: "Email already used" });
  const teacher = await Teacher.create({ name, email, password });
  res.status(201).json(teacher);
};

module.exports = {
  getAllStudents,
  getStudentById,
  deleteStudents,
  createStudent,
  getAllTeachers,
  getTeacherById,
  deleteTeachers,
  createTeacher,
};
