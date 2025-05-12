import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home/Home";
import SuperheroDetail from "./pages/Superhero/SuperheroDetail";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path='/' element={<Home />} />
      <Route path='/hero/:id' element={<SuperheroDetail />} />
    </Routes>
  );
}
