import { Route, Routes } from "react-router-dom";
import Login from "./Authentication/Login";
import Register from "./Authentication/Register";
import SignedIn from "./components/SignedIn";
import Hero from "./Landing/Hero";
import Footer from "./Landing/Footer";
import { Toaster } from "react-hot-toast";

function App() {
  return (
    <div className="flex flex-col min-h-screen">
      <Toaster />
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Hero />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/main/*" element={<SignedIn />} />
        </Routes>
      </main>
      {/* <Footer /> */}
    </div>
  );
}

export default App;
