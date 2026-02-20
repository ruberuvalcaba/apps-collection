import { BrowserRouter, Routes, Route } from "react-router";
import LaunchPad from "./pages/launchPad/LaunchPad";

const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route index element={<LaunchPad />} />
      </Routes>
    </BrowserRouter>
  );
};

export default Router;
