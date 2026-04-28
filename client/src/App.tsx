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
import AvocatDashboard from "@/pages/AvocatDashboard";
import Practitioners from "@/pages/Practitioners";
import PractitionerProfile from "@/pages/PractitionerProfile";
import AvocatsLanding from "@/pages/AvocatsLanding";
import AvocatInscription from "@/pages/AvocatInscription";
import AdminLawyers from "@/pages/AdminLawyers";
import { useAuth } from "@/hooks/use-auth";
import { RoleGate } from "@/components/RoleGate";

function Router() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return null;
  }

  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/procedure/:id/wizard" component={Wizard} />
      <Route path="/procedure/:id/result" component={Result} />
      <Route path="/practitioners" component={Practitioners} />
      <Route path="/practitioners/:id" component={PractitionerProfile} />

      {/* Lawyer-side public pages */}
      <Route path="/avocats" component={AvocatsLanding} />
      <Route path="/avocats/inscription" component={AvocatInscription} />

      {/* Protected Routes */}
      <Route path="/dashboard">
        {user ? <Dashboard /> : <Home />}
      </Route>
      <Route path="/avocat">
        <RoleGate allow={["lawyer", "admin"]} loginRedirect="/avocats">
          <AvocatDashboard />
        </RoleGate>
      </Route>

      {/* Admin */}
      <Route path="/admin/lawyers">
        <RoleGate allow={["admin"]}>
          <AdminLawyers />
        </RoleGate>
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
