import { useQuery } from "@tanstack/react-query";
import { API_URL } from "@/App";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus, MoreVertical } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function Deals() {
  const stages = ["Discovery", "Proposal", "Negotiation", "Closed Won"];

  const { data: deals, isLoading } = useQuery({
    queryKey: ["deals"],
    queryFn: () => fetch(`${API_URL}/api/deals`).then(res => res.json())
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto h-full flex flex-col">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Deals Pipeline</h1>
          <p className="text-muted-foreground mt-1">Track and manage your active opportunities.</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" /> New Deal
        </Button>
      </div>

      <div className="flex-1 overflow-x-auto pb-4">
        <div className="flex gap-6 min-w-max h-full">
          {stages.map((stage) => {
            const stageDeals = deals?.filter((d: any) => d.stage === stage) || [];
            
            return (
              <div key={stage} className="w-80 flex flex-col bg-secondary/30 rounded-xl p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-sm">{stage}</h3>
                  <Badge variant="secondary" className="bg-background">
                    {isLoading ? "..." : stageDeals.length}
                  </Badge>
                </div>
                
                <div className="space-y-3 flex-1 overflow-y-auto">
                  {isLoading ? (
                    [1, 2].map(i => <Skeleton key={i} className="h-32 w-full" />)
                  ) : (
                    stageDeals.map((deal: any) => (
                      <Card key={deal.id} className="cursor-pointer hover:border-primary/50 transition-colors shadow-sm">
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start mb-2">
                            <div className="font-medium text-sm line-clamp-2 pr-2">{deal.name}</div>
                            <Button variant="ghost" size="icon" className="h-6 w-6 -mr-2 -mt-1 text-muted-foreground">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </div>
                          <div className="text-sm text-muted-foreground mb-3">{deal.company}</div>
                          <div className="flex items-center justify-between mt-auto">
                            <div className="font-semibold">${deal.value.toLocaleString()}</div>
                            <Badge variant="outline" className={
                                 deal.probability >= 80 ? "text-emerald-500 border-emerald-500/30 bg-emerald-500/10" :
                                 deal.probability >= 50 ? "text-blue-500 border-blue-500/30 bg-blue-500/10" :
                                 "text-amber-500 border-amber-500/30 bg-amber-500/10"
                               }>
                              {deal.probability}%
                            </Badge>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  )}
                  
                  {!isLoading && stageDeals.length === 0 && (
                    <div className="h-24 border-2 border-dashed border-border rounded-lg flex items-center justify-center text-sm text-muted-foreground">
                      No deals
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
