import "./App.css";
import Home from "./containers/Home";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <div className="app-container">
      <ToastContainer />
      <Home />
    </div>
  );
}

export default App;
