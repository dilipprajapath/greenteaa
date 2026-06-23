import "@/App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "sonner";
import { Analytics } from "@vercel/analytics/react";
import { AuthProvider } from "@/context/AuthContext";
import Landing from "@/pages/Landing";
import Admin from "@/pages/Admin";

function App() {
  return (
    <div className="App">
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/admin" element={<Admin />} />
          </Routes>
        </BrowserRouter>
        <Toaster position="top-center" richColors />
      </AuthProvider>
      <Analytics />
    </div>
  );
}

export default App;
