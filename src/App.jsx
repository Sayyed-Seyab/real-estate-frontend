import { Routes, Route, Navigate } from "react-router-dom";
import { Dashboard, Auth } from "@/layouts";
import { ToastContainer } from "react-toastify";
import { SignIn } from "./pages/auth";
import AuthProvider from "./pages/auth/AuthProvider";

function App() {
  return (
    <div>
       <div>
      {/* Your app content */}
      <ToastContainer />
    </div>
    <Routes>
      <Route element={<AuthProvider/>}>
      <Route path="/dashboard/*" element={<Dashboard />} />
       <Route path='*' element={ <div className="flex items-center justify-center h-screen text-center">
      <h1 className="text-2xl font-bold text-gray-700">Page Not Found</h1>
    </div>} />
    <Route path='/auth/*' element={ <div className="flex items-center justify-center h-screen text-center">
      <h1 className="text-2xl font-bold text-gray-700">Page Not Found</h1>
    </div>} />
      </Route>

      <Route path="/" element={<SignIn />} />
    </Routes>
    </div>
  );
}

export default App;
