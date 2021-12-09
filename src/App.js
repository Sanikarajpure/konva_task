import "./App.css";
import { CookiesProvider } from "react-cookie";

import Canvas from "./canvas/index";

function App() {
  return (
    <CookiesProvider>
      <div className="App">
        <Canvas />
      </div>
    </CookiesProvider>
  );
}

export default App;
