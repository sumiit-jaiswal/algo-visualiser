import "./app.scss";
import Searching from "./components/Search";
import Sorting from "./components/Sorting";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./components/Homepage";
import Graph from "./components/Graph";
import Header from "./components/Header";

function App() {
  return (
    <Router>
      <div>
        <Header />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/sorting" element={<Sorting />} />
            <Route path="/searching" element={<Searching />} />
            <Route path="/Graph-traversal" element={<Graph />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
