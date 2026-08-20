import { BrowserRouter as Router } from "react-router-dom";
import { Layout } from "./app/layout/Layout";

export default function App() {
  return (
    <Router>
      <Layout />
    </Router>
  );
}
