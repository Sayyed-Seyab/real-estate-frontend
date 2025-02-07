import { Routes, Route, Navigate } from "react-router-dom";
import { Dashboard, Auth } from "@/layouts";
import { ToastContainer } from "react-toastify";

function App() {
  return (
    <div>
       <div>
      {/* Your app content */}
      <ToastContainer />
    </div>
    <Routes>
      <Route path="/dashboard/*" element={<Dashboard />} />
      <Route path="/auth/*" element={<Auth />} />
      <Route path="*" element={<Navigate to="/dashboard/home" replace />} />
    </Routes>
    </div>
  );
}

export default App;
