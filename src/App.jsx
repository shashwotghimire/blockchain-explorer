import React from "react";
import AppRouter from "./router/AppRouter"; // Router handling authentication
import { ThemeProvider } from "./components/theme/theme-provider";

function App() {
  return (
    <ThemeProvider>
      <div>
        <AppRouter /> {/* Handles routing and auth state */}
      </div>
    </ThemeProvider>
  );
}

export default App;
