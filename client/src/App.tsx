import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import Wizard from "@/pages/Wizard";
import Result from "@/pages/Result";
import Dashboard from "@/pages/Dashboard";
import Practitioners from "@/pages/Practitioners";
import { useAuth } from "@/hooks/use-auth";

function Router() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return null; // Or a loading spinner
  }

  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/procedure/:id/wizard" component={Wizard} />
      <Route path="/procedure/:id/result" component={Result} />
      <Route path="/practitioners" component={Practitioners} />
      
      {/* Protected Routes - simple check for now */}
      <Route path="/dashboard">
        {user ? <Dashboard /> : <Home />} 
      </Route>

      {/* Fallback to 404 */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
