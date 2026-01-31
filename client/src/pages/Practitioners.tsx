import { Layout } from "@/components/Layout";
import { useQuery } from "@tanstack/react-query";
import { Practitioner } from "@shared/schema";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Star, MapPin, User, Search } from "lucide-react";
import { useState } from "react";

export default function Practitioners() {
  const [specialty, setSpecialty] = useState<string>("all");
  const [city, setCity] = useState("");
  const [legalAid, setLegalAid] = useState(false);

  const { data: practitioners, isLoading } = useQuery<Practitioner[]>({
    queryKey: ["/api/practitioners", specialty, city, legalAid],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (specialty && specialty !== "all") params.append("specialty", specialty);
      if (city) params.append("city", city);
      if (legalAid) params.append("accepts_legal_aid", "true");
      
      const res = await fetch(`/api/practitioners?${params.toString()}`);
      if (!res.ok) throw new Error("Failed to fetch practitioners");
      return res.json();
    }
  });

  const specialtiesList = [
    "Droit du travail",
    "Propriété intellectuelle",
    "Licenciement",
    "Salaires impayés",
    "Marques",
    "Brevets",
    "Droit civil"
  ];

  return (
    <Layout>
      <div className="max-w-7xl mx-auto py-12 px-4">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar Filters */}
          <aside className="w-full md:w-64 space-y-6">
            <div className="bg-card border rounded-lg p-6 sticky top-24">
              <h2 className="font-serif text-xl font-bold text-primary mb-4 flex items-center gap-2">
                <Search className="w-5 h-5" />
                Filtres
              </h2>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Spécialité</Label>
                  <Select value={specialty} onValueChange={setSpecialty}>
                    <SelectTrigger>
                      <SelectValue placeholder="Toutes les spécialités" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Toutes les spécialités</SelectItem>
                      {specialtiesList.map(s => (
                        <SelectItem key={s} value={s}>{s}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Ville</Label>
                  <Input 
                    placeholder="Ex: Paris, Lyon..." 
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                  />
                </div>

                <div className="flex items-center space-x-2 pt-2">
                  <Checkbox 
                    id="legal-aid" 
                    checked={legalAid}
                    onCheckedChange={(checked) => setLegalAid(!!checked)}
                  />
                  <Label 
                    htmlFor="legal-aid"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Aide juridictionnelle
                  </Label>
                </div>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <div className="flex-1">
            <h1 className="text-3xl font-bold font-serif text-primary mb-2">
              Trouver un professionnel du droit
            </h1>
            <p className="text-muted-foreground mb-8">
              Consultez les profils d'avocats spécialisés pour vous accompagner.
            </p>

            {isLoading ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="h-64 bg-muted animate-pulse rounded-lg" />
                ))}
              </div>
            ) : practitioners?.length === 0 ? (
              <div className="text-center py-12 bg-muted/30 rounded-lg border-2 border-dashed">
                <p className="text-muted-foreground">Aucun praticien ne correspond à vos critères.</p>
                <Button 
                  variant="ghost" 
                  onClick={() => { setSpecialty("all"); setCity(""); setLegalAid(false); }}
                >
                  Réinitialiser les filtres
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {practitioners?.map((p) => (
                  <Card key={p.id} className="hover-elevate overflow-hidden flex flex-col">
                    <CardContent className="p-6 flex-1">
                      <div className="flex gap-4">
                        <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center shrink-0 overflow-hidden border-2 border-primary/5">
                          {p.photoUrl ? (
                            <img src={p.photoUrl} alt={p.name} className="w-full h-full object-cover" />
                          ) : (
                            <User className="w-10 h-10 text-primary/40" />
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between items-start mb-1">
                            <h3 className="font-serif text-xl font-bold text-primary">{p.name}</h3>
                            <div className="flex items-center text-amber-500 bg-amber-50 px-2 py-0.5 rounded text-sm font-bold">
                              <Star className="w-4 h-4 fill-current mr-1" />
                              {p.rating}
                            </div>
                          </div>
                          <div className="flex items-center text-muted-foreground text-sm mb-3">
                            <MapPin className="w-4 h-4 mr-1" />
                            {p.locationCity}, {p.locationDepartment}
                          </div>
                          <div className="flex flex-wrap gap-1 mb-4">
                            {p.specialties?.slice(0, 3).map((s) => (
                              <Badge key={s} variant="secondary" className="text-[10px] uppercase tracking-wider">
                                {s}
                              </Badge>
                            ))}
                            {p.specialties && p.specialties.length > 3 && (
                              <Badge variant="outline" className="text-[10px]">
                                +{p.specialties.length - 3}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {p.bio}
                      </p>
                    </CardContent>
                    <CardFooter className="p-6 pt-0 border-t bg-muted/10 flex justify-between items-center">
                      <div className="text-sm">
                        <span className="font-bold text-primary">{p.rateConsultation}€</span>
                        <span className="text-muted-foreground"> / consultation</span>
                      </div>
                      <Button variant="default" className="bg-primary hover:bg-primary/90">
                        Voir le profil
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
