import { Navigate, Route, Routes } from "react-router-dom";

import MainLayout from "./layouts/MainLayout";
import NationalDashboard from "./pages/NationalDashboard";
import Projects from "./pages/Projects";
import ProjectDetails from "./pages/ProjectDetails";
import Proposals from "./pages/Proposals";
import LandParcels from "./pages/LandParcels";
import Notifications from "./pages/Notifications";

const App = () => {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route
          path="/dashboard"
          element={<NationalDashboard />}
        />

        <Route
          path="/projects"
          element={<Projects />}
        />

        <Route
          path="/projects/:id"
          element={<ProjectDetails />}
        />

        <Route
          path="/proposals"
          element={<Proposals />}
        />

        <Route
          path="/land-parcels"
          element={<LandParcels />}
        />

        <Route
          path="/notifications"
          element={<Notifications />}
        />

        <Route
          path="/"
          element={
            <Navigate
              to="/dashboard"
              replace
            />
          }
        />
      </Route>
    </Routes>
  );
};

export default App;