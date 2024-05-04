import { HashRouter, Route, Routes } from "react-router-dom";
import { EthProvider } from "./contexts/EthContext";
import Header from "./components/header/Header";
import ProductMain from "./components/ProductMain/ProductMain";
import ProductManage from "./components/ProductManage/ProductManage";
import ProductBought from "./components/ProductBought/ProductBought";
import Record from "./components/Record/Record";

function App() {
  return (
    <EthProvider>
      <HashRouter>
        <div id="App">
          <Header />
          <Routes>
            <Route path="/products" element={<ProductManage />} />
            <Route path="/bought" element={<ProductBought />} />
            <Route path="/record" element={<Record />} />
            <Route path="/" element={<ProductMain />} />
          </Routes>
        </div>
      </HashRouter>
    </EthProvider>
  );
}

export default App;
