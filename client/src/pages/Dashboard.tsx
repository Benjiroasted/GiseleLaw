import { Link } from "wouter";
import { useProcedures, useDeleteProcedure } from "@/hooks/use-procedures";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, FileText, Trash2, ChevronRight, Clock } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";

export default function Dashboard() {
  const { data: procedures, isLoading } = useProcedures();
  const deleteProcedure = useDeleteProcedure();
  const { toast } = useToast();

  const handleDelete = async (id: number) => {
    try {
      await deleteProcedure.mutateAsync(id);
      toast({
        title: "Dossier supprimé",
        description: "Le dossier a été supprimé avec succès.",
      });
    } catch (err) {
      toast({
        title: "Erreur",
        description: "Impossible de supprimer le dossier.",
        variant: "destructive",
      });
    }
  };

  return (
    <Layout>
      <div className="max-w-5xl mx-auto py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-serif font-bold text-primary">Mes Dossiers</h1>
          <Link href="/procedure/new">
            <Button className="shadow-md">
              <Plus className="mr-2 h-4 w-4" />
              Nouveau dossier
            </Button>
          </Link>
        </div>

        {isLoading ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
             {[1, 2, 3].map(i => (
               <div key={i} className="h-40 bg-slate-100 animate-pulse rounded-xl" />
             ))}
          </div>
        ) : procedures && procedures.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {procedures.map((proc) => (
              <Card key={proc.id} className="group hover:shadow-lg transition-all duration-300 border-border/60">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <div className="p-2 bg-primary/5 rounded-lg text-primary mb-2">
                      <FileText className="h-5 w-5" />
                    </div>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Êtes-vous sûr ?</AlertDialogTitle>
                          <AlertDialogDescription>
                            Cette action est irréversible. Le dossier "{proc.title}" sera définitivement supprimé.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Annuler</AlertDialogCancel>
                          <AlertDialogAction 
                            onClick={() => handleDelete(proc.id)}
                            className="bg-destructive hover:bg-destructive/90"
                          >
                            Supprimer
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                  <CardTitle className="line-clamp-1">{proc.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Clock className="mr-2 h-4 w-4" />
                      {proc.createdAt ? format(new Date(proc.createdAt), 'dd MMM yyyy', { locale: fr }) : ''}
                    </div>
                    <div className="flex items-center justify-between pt-2">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-800">
                        {proc.type === 'unpaid_work' ? 'Travail' : 'Propriété Intellectuelle'}
                      </span>
                      <Link href={`/procedure/${proc.id}/result`}>
                        <Button variant="link" className="p-0 h-auto font-semibold text-primary">
                          Voir le plan <ChevronRight className="ml-1 h-3 w-3" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
              <FileText className="h-8 w-8 text-muted-foreground/50" />
            </div>
            <h3 className="text-lg font-medium text-foreground mb-2">Aucun dossier pour le moment</h3>
            <p className="text-muted-foreground mb-6 max-w-sm mx-auto">
              Commencez une nouvelle procédure pour obtenir un plan d'action personnalisé.
            </p>
            <Link href="/procedure/new">
              <Button>Créer mon premier dossier</Button>
            </Link>
          </div>
        )}
      </div>
    </Layout>
  );
}
