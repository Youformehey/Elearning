import React, { Suspense, lazy } from "react";
import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import { ThemeProvider } from "./context/ThemeContext";
import { RappelsProvider } from "./context/RappelsContext";

// --- Hook pour récupérer userInfo
function useUserInfo() {
  const raw = localStorage.getItem("userInfo");
  return raw ? JSON.parse(raw) : null;
}

// --- Fonction utilitaire pour vérifier rôle
function hasRole(userInfo, roles) {
  return userInfo && roles.includes(userInfo.role);
}

// --- Routes protégées

// Route protégée globale : utilisateur connecté
function PrivateRoute() {
  const userInfo = useUserInfo();
  return userInfo ? <Outlet /> : <Navigate to="/login" replace />;
}

// Route protégée Professeur uniquement
function PrivateRouteProf() {
  const userInfo = useUserInfo();
  if (!hasRole(userInfo, ["prof"])) return <Navigate to="/login" replace />;
  return <Outlet />;
}

// Route protégée Étudiant uniquement
function PrivateRouteStudent() {
  const userInfo = useUserInfo();
  if (!hasRole(userInfo, ["etudiant"])) return <Navigate to="/login" replace />;
  return <Outlet />;
}

// Route protégée Professeur ET Étudiant (accès commun)
function PrivateRouteProfEtudiant() {
  const userInfo = useUserInfo();
  if (!hasRole(userInfo, ["prof", "etudiant"])) return <Navigate to="/login" replace />;
  return <Outlet />;
}

// --- Lazy loading pages publiques (optimisation bundle)
const Contact = lazy(() => import("./pages/dashboard/Contact"));
const About = lazy(() => import("./pages/dashboard/About"));
const ProfessionalTestimonials = lazy(() =>
  import("./pages/dashboard/ProfessionalTestimonials")
);
const CarouselSection = lazy(() => import("./pages/dashboard/CarouselSection"));

// --- Pages Auth
import LoginPage from "./pages/dashboard/LoginPage";

// --- Pages Professeur
import ProfesseurLayout from "./pages/prof/ProfesseurLayout";
import HomeAfterLoginProf from "./pages/prof/HomeAfterLoginProf";
import MesCours from "./pages/prof/MesCours";
import AddCourse from "./pages/prof/AddCourse";
import CourseDetails from "./pages/prof/CourseDetails";
import NotesProfesseur from "./pages/prof/NotesProfesseur";
import AbsencesProfesseur from "./pages/prof/AbsencesProfesseur";
import PlanningProfesseur from "./pages/prof/PlanningProfesseur";
import ForumPage from "./pages/prof/ForumPage";
import QuizPage from "./pages/prof/QuizPage";
import DepotPage from "./pages/prof/DepotPage";
import DocumentsProfesseur from "./pages/prof/DocumentsProfesseur";
import DocumentsCours from "./pages/prof/DocumentsCours";
import ProfilProfesseur from "./pages/prof/ProfilProfesseur";
import RappelsProfesseur from "./pages/prof/RappelsProfesseur";
import RappelsFaitsProfesseur from "./pages/prof/RappelsFaitsProfesseur";
import SettingsProfesseur from "./pages/prof/SettingsProfesseur";
import MatieresPage from "./pages/prof/MatieresPage";
import GererDevoirs from "./pages/prof/GererDevoirs";

// --- Pages Étudiant
import StudentLayout from "./pages/student/StudentLayout";
import DashboardStudent from "./pages/student/DashboardStudent";
import CoursStudent from "./pages/student/CoursStudent";
import CoursStudentDetails from "./pages/student/CoursStudentDetails";
import AbsencesStudent from "./pages/student/AbsencesStudent";
import PlanningStudent from "./pages/student/PlanningStudent";
import RappelsStudent from "./pages/student/RappelsStudent";
import ProfilStudent from "./pages/student/ProfilStudent";
import DemandesStudent from "./pages/student/DemandesStudent";
import AssistantIA from "./pages/student/AssistantIA";
import Formations from "./pages/student/Formations";

// --- Nouveaux composants étudiants lecture seule
import ForumStudent from "./pages/student/ForumStudent";
import DocumentsCoursStudent from "./pages/student/DocumentsCoursStudent";
import QuizPageStudent from "./pages/student/QuizPageStudent";

// --- Route publique avec fallback loading pour lazy
function PublicRoute({ children }) {
  return <Suspense fallback={<div>Chargement...</div>}>{children}</Suspense>;
}

export default function App() {
  return (
    <ThemeProvider>
      <RappelsProvider>
        <Routes>
          {/* Redirection racine vers login */}
          <Route path="/" element={<Navigate to="/login" replace />} />

          {/* Authentification */}
          <Route path="/login" element={<LoginPage />} />

          {/* Routes Professeur */}
          <Route element={<PrivateRouteProf />}>
            <Route path="/prof" element={<ProfesseurLayout />}>
              <Route index element={<HomeAfterLoginProf />} />
              <Route path="cours" element={<MesCours />} />
              <Route path="ajouter-cours" element={<AddCourse />} />
              <Route path="cours/:id" element={<CourseDetails />} />
              {/* Routes forum, quiz, documents (uniquement prof) */}
              <Route path="cours/forum/:id" element={<ForumPage />} />
              <Route path="cours/quiz/:id" element={<QuizPage />} />
              <Route path="documents-cours/:id" element={<DocumentsCours />} />
              <Route path="notes" element={<NotesProfesseur />} />
              <Route path="absences" element={<AbsencesProfesseur />} />
              <Route path="planning" element={<PlanningProfesseur />} />
              <Route path="forum" element={<ForumPage />} />
              <Route path="depot" element={<DepotPage />} />
              <Route path="documents" element={<DocumentsProfesseur />} />
              <Route path="profil" element={<ProfilProfesseur />} />
              <Route path="rappels" element={<RappelsProfesseur />} />
              <Route path="rappels/:id/faits" element={<RappelsFaitsProfesseur />} />
              <Route path="rappels/:id/etudiants" element={<RappelsFaitsProfesseur />} />
              <Route path="parametres" element={<SettingsProfesseur />} />
              <Route path="matieres" element={<MatieresPage />} />
              <Route path="gerer-devoirs" element={<GererDevoirs />} />
            </Route>
          </Route>

          {/* Routes Étudiant */}
          <Route element={<PrivateRouteStudent />}>
            <Route path="/student" element={<StudentLayout />}>
              <Route index element={<DashboardStudent />} />
              <Route path="cours" element={<CoursStudent />} />
              <Route path="cours/:id" element={<CoursStudentDetails />} />

              {/* Routes forum, quiz, documents côté étudiant */}
              <Route path="cours/forum/:id" element={<ForumStudent />} />
              <Route path="cours/quiz/:id" element={<QuizPageStudent />} />
              <Route path="documents-cours/:id" element={<DocumentsCoursStudent />} />

              <Route path="absences" element={<AbsencesStudent />} />
              <Route path="planning" element={<PlanningStudent />} />
              <Route path="rappels" element={<RappelsStudent />} />
              <Route path="profil" element={<ProfilStudent />} />
              <Route path="demandes" element={<DemandesStudent />} />
              <Route path="assistant" element={<AssistantIA />} />
              <Route path="formations" element={<Formations />} />
            </Route>
          </Route>

          {/* Routes communes Prof/Étudiant (forum, quiz, documents côté prof accessibles aussi par étudiants) */}
          <Route element={<PrivateRouteProfEtudiant />}>
            <Route path="/prof/cours/forum/:id" element={<ForumPage />} />
            <Route path="/prof/cours/quiz/:id" element={<QuizPage />} />
            <Route path="/prof/documents-cours/:id" element={<DocumentsCours />} />
          </Route>

          {/* Routes publiques */}
          <Route
            path="/contact"
            element={
              <PublicRoute>
                <Contact />
              </PublicRoute>
            }
          />
          <Route
            path="/about"
            element={
              <PublicRoute>
                <About />
              </PublicRoute>
            }
          />
          <Route
            path="/testimonials"
            element={
              <PublicRoute>
                <ProfessionalTestimonials />
              </PublicRoute>
            }
          />
          <Route
            path="/carousel"
            element={
              <PublicRoute>
                <CarouselSection />
              </PublicRoute>
            }
          />

          {/* 404 Not Found - redirige vers login */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </RappelsProvider>
    </ThemeProvider>
  );
}
