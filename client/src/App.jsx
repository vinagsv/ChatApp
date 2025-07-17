import { Route, Routes } from "react-router-dom";
import Login from "./Authentication/Login";
import Register from "./Authentication/Register";
import Main from "./components/Main";

function App() {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/main" element={<Main />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
