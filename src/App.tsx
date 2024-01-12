import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import CompletionView from "./pages/completion/CompletionView";
import PaymentConfirmationView from "./pages/confirmation/PaymentConfirmationView";
import CheckoutButton from "./pages/checkout/CheckoutButton";

function App() {
  return (
    <main>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<CheckoutButton />} />
          <Route path="/payment" element={<PaymentConfirmationView />} />
          <Route path="/completion" element={<CompletionView />} />
        </Routes>
      </BrowserRouter>
    </main>
  );
}

export default App;
