import { useQuery } from "@tanstack/react-query";
import { API_URL } from "@/App";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, Users, Briefcase, TrendingUp, ArrowUpRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Skeleton } from "@/components/ui/skeleton";

export default function Dashboard() {
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ["stats"],
    queryFn: () => fetch(`${API_URL}/api/stats`).then(res => res.json())
  });

  const { data: chartData, isLoading: chartLoading } = useQuery({
    queryKey: ["chart-data"],
    queryFn: () => fetch(`${API_URL}/api/chart-data`).then(res => res.json())
  });

  const { data: deals, isLoading: dealsLoading } = useQuery({
    queryKey: ["deals"],
    queryFn: () => fetch(`${API_URL}/api/deals`).then(res => res.json()),
    initialData: []
  });

  if (statsLoading || chartLoading || dealsLoading) {
    return (
      <div className="space-y-8 max-w-7xl mx-auto">
        <div className="grid gap-8 md:grid-cols-4">
          {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-32 w-full rounded-[2rem]" />)}
        </div>
        <Skeleton className="h-[450px] w-full rounded-[2.5rem]" />
      </div>
    );
  }

  return (
    <div className="space-y-10 max-w-7xl mx-auto font-sans">
      <div className="flex flex-col gap-2">
        <h1 className="text-4xl font-black tracking-tighter text-foreground leading-[1.1]">Dashboard</h1>
        <p className="text-muted-foreground text-lg font-medium opacity-80 tracking-tight">Welcome back, John. Here's your workspace overview.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Total Revenue", value: stats?.totalRevenue, trend: stats?.revenueGrowth, icon: DollarSign, color: "primary" },
          { label: "Active Deals", value: stats?.activeDeals, trend: "+3 new this week", icon: Briefcase, color: "blue" },
          { label: "New Contacts", value: stats?.newContacts, trend: "+12% from last month", icon: Users, color: "amber" },
          { label: "Win Rate", value: "64.2%", trend: "+2.4% from last month", icon: TrendingUp, color: "indigo" }
        ].map((item, i) => (
          <Card key={i} className="rounded-[2.25rem] border-none shadow-xl shadow-muted/10 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 bg-card overflow-hidden group">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 px-7 pt-7">
              <CardTitle className="text-[10px] font-bold uppercase tracking-[0.25em] text-muted-foreground/50">{item.label}</CardTitle>
              <div className={`p-2.5 bg-muted rounded-xl group-hover:scale-110 transition-transform`}>
                <item.icon className="h-4 w-4 text-muted-foreground/60" />
              </div>
            </CardHeader>
            <CardContent className="px-7 pb-7 pt-0">
              <div className="text-3xl font-black tracking-tighter text-foreground">{item.value}</div>
              <div className="flex items-center gap-1.5 mt-3">
                <div className="flex items-center gap-1 bg-emerald-500/10 px-3 py-1 rounded-full text-emerald-600 text-[9px] font-black uppercase tracking-widest border border-emerald-500/10">
                  {item.trend.includes('+') ? <TrendingUp className="h-3 w-3" /> : null}
                  {item.trend}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-10 md:grid-cols-7 items-stretch">
        {/* Chart */}
        <Card className="md:col-span-4 lg:col-span-5 rounded-[2.5rem] border-none shadow-xl shadow-muted/10 bg-card p-4 overflow-hidden relative">
          <CardHeader className="px-8 pt-6 pb-2">
            <CardTitle className="text-xl font-black tracking-tight">Revenue Insights</CardTitle>
          </CardHeader>
          <CardContent className="pl-0 pb-0">
            <div className="h-[380px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 20, right: 30, left: 10, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.15}/>
                      <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="5 5" vertical={false} stroke="hsl(var(--border))" opacity={0.4} />
                  <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={11} fontWeight="700" tickLine={false} axisLine={false} tickMargin={15} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} fontWeight="700" tickLine={false} axisLine={false} tickFormatter={(value) => `$${value}`} tickMargin={15} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'hsl(var(--card))', borderRadius: '18px', boxShadow: '0 15px 20px -5px rgba(0,0,0,0.1)', border: 'none', padding: '12px' }}
                    itemStyle={{ color: 'hsl(var(--primary))', fontWeight: 'bold' }}
                    cursor={{ stroke: 'hsl(var(--primary))', strokeWidth: 1.5, strokeDasharray: '4 4' }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="revenue" 
                    stroke="hsl(var(--primary))" 
                    strokeWidth={3} 
                    fillOpacity={1} 
                    fill="url(#colorRevenue)" 
                    animationDuration={1800}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Recent Deals */}
        <Card className="md:col-span-3 lg:col-span-2 rounded-[2.5rem] border-none shadow-xl shadow-muted/10 bg-card h-full flex flex-col">
          <CardHeader className="px-8 pt-8 pb-6">
            <CardTitle className="text-xl font-black tracking-tight">Recent Deals</CardTitle>
          </CardHeader>
          <CardContent className="px-8 flex-1">
            <div className="space-y-4">
              {deals?.slice(0, 5).map((deal: any) => (
                <div key={deal.id} className="flex items-start group cursor-pointer hover:bg-muted/50 p-3 -mx-3 rounded-[1.25rem] transition-all duration-300">
                  <div className="h-10 w-10 rounded-[0.85rem] bg-muted flex items-center justify-center text-muted-foreground font-bold text-base transition-transform group-hover:scale-105 shadow-inner mt-0.5">
                    {deal.company[0]}
                  </div>
                  <div className="ml-3.5 flex-1">
                    <div className="flex justify-between items-start">
                      <div className="pr-4">
                        <p className="text-[13px] font-black text-foreground leading-tight tracking-tight">{deal.name}</p>
                        <p className="text-[9px] text-muted-foreground font-black uppercase tracking-widest opacity-60 mt-1">{deal.company}</p>
                      </div>
                      <div className="text-right shrink-0">
                        <div className="text-[13px] font-black text-foreground tracking-tight leading-none">+${deal.value.toLocaleString()}</div>
                        <div className="text-[8px] font-black text-emerald-500 uppercase tracking-[0.15em] mt-2">{deal.stage}</div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <button className="w-full mt-auto py-4 rounded-[1.5rem] bg-muted border border-transparent text-[9px] font-black text-muted-foreground hover:bg-primary hover:text-primary-foreground hover:shadow-xl hover:shadow-primary/20 transition-all uppercase tracking-[0.25em]">
              Full Pipeline
            </button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
