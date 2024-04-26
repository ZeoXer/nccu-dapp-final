import Header from "./components/header/Header";
import ProductPage from "./components/main/ProductPage";
import { EthProvider } from "./contexts/EthContext";

function App() {
  return (
    <EthProvider>
      <div id="App">
        <Header />
        <ProductPage />
      </div>
    </EthProvider>
  );
}

export default App;
