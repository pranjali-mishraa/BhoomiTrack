import { Navigate, Route, Routes } from "react-router-dom";

import MainLayout from "./layouts/MainLayout";
import NationalDashboard from "./pages/NationalDashboard";

const App = () => {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route
          path="/dashboard"
          element={<NationalDashboard />}
        />

        <Route
          path="/"
          element={<Navigate to="/dashboard" replace />}
        />
      </Route>
    </Routes>
  );
};

export default App;