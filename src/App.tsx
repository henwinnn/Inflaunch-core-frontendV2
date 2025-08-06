import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider } from "wagmi";
import { getDefaultConfig, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import Home from "./pages/Home";
import CreateToken from "./pages/CreateToken";
// import Explore from "./pages/Explore";
import Token from "./pages/Token";
import { coreTestnet2 } from "viem/chains";
import ExplorePage from "./pages/explore";
import { SiteHeader } from "./pages/components/site-header";
import "./index.css";
import { Toaster } from "./pages/components/ui/toaster";

export const config = getDefaultConfig({
  appName: "Base Network App",
  projectId: "YOUR_PROJECT_ID", // Replace with your WalletConnect projectId
  chains: [coreTestnet2],
});

const queryClient = new QueryClient();

function App() {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
          <Router>
            <SiteHeader />
            <div className="h-80vh bg-background">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/create-token" element={<CreateToken />} />
                <Route path="/explore" element={<ExplorePage />} />
                <Route path="/token/:id" element={<Token />} />
              </Routes>
            </div>
            <footer className="py-6 md:px-8 md:py-0 border-t">
              <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
                <p className="text-balance text-center text-sm leading-loose text-muted-foreground md:text-left">
                  &copy; {new Date().getFullYear()} Inflaunch.core. All rights
                  reserved. 🎉
                </p>
              </div>
            </footer>
            <Toaster />
          </Router>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}

export default App;
