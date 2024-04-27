import { HashRouter, Route, Routes } from "react-router-dom";
import { EthProvider } from "./contexts/EthContext";
import Header from "./components/header/Header";
import ProductMain from "./components/ProductMain/ProductMain";
import ProductManage from "./components/ProductManage/ProductManage";

function App() {
  return (
    <EthProvider>
      <HashRouter>
        <div id="App">
          <Header />
          <Routes>
            <Route path="/products" element={<ProductManage />} />
            <Route path="/" element={<ProductMain />} />
          </Routes>
        </div>
      </HashRouter>
    </EthProvider>
  );
}

export default App;
