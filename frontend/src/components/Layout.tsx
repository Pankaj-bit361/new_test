import { LayoutDashboard, Users, Briefcase, Settings, Bell, Search, Menu } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
import { useState } from "react";

export default function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navigation = [
    { name: "Dashboard", href: "/", icon: LayoutDashboard },
    { name: "Contacts", href: "/contacts", icon: Users },
    { name: "Deals", href: "/deals", icon: Briefcase },
  ];

  const NavLinks = () => (
    <div className="flex flex-col gap-1">
      {navigation.map((item) => {
        const isActive = location.pathname === item.href;
        return (
          <Link
            key={item.name}
            to={item.href}
            onClick={() => setIsMobileMenuOpen(false)}
            className={`flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-300 group ${
              isActive
                ? "bg-primary text-primary-foreground font-bold shadow-lg shadow-primary/20"
                : "text-muted-foreground hover:bg-secondary/80 hover:text-foreground"
            }`}
          >
            <item.icon className={`h-4.5 w-4.5 transition-colors ${isActive ? "text-primary-foreground" : "text-muted-foreground group-hover:text-foreground"}`} />
            <span className="text-[13px] tracking-tight">{item.name}</span>
          </Link>
        );
      })}
    </div>
  );

  return (
    <div className="min-h-screen bg-background flex w-full selection:bg-primary/10 selection:text-primary font-sans">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-72 flex-col border-r bg-card/40 backdrop-blur-xl px-6 py-10 sticky top-0 h-screen">
        <div className="flex items-center gap-3 px-2 mb-12">
          <div className="bg-primary p-2.5 rounded-2xl shadow-xl shadow-primary/30">
            <Briefcase className="h-6 w-6 text-primary-foreground" />
          </div>
          <span className="text-2xl font-black tracking-tighter text-foreground">Rahul</span>
        </div>
        <nav className="flex-1">
          <NavLinks />
        </nav>
        <div className="mt-auto px-2">
          <Link
            to="#"
            className="flex items-center gap-3 px-4 py-3 rounded-2xl text-muted-foreground hover:bg-secondary/80 hover:text-foreground transition-all duration-300 group"
          >
            <Settings className="h-5 w-5 group-hover:rotate-45 transition-transform duration-500" />
            <span className="text-sm font-medium tracking-tight">Settings</span>
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="h-20 border-b bg-background/60 backdrop-blur-xl flex items-center justify-between px-8 lg:px-12 sticky top-0 z-30">
          <div className="flex items-center gap-6 flex-1">
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="lg:hidden rounded-2xl hover:bg-secondary">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-72 p-8 bg-card border-r">
                <div className="flex items-center gap-3 mb-12">
                  <div className="bg-primary p-2.5 rounded-2xl shadow-xl shadow-primary/30">
                    <Briefcase className="h-6 w-6 text-primary-foreground" />
                  </div>
                  <span className="text-2xl font-black tracking-tighter">Rahul</span>
                </div>
                <nav>
                  <NavLinks />
                </nav>
              </SheetContent>
            </Sheet>

            <div className="relative w-full max-w-sm hidden sm:block group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/60 group-focus-within:text-primary transition-colors" />
              <Input
                type="search"
                placeholder="Search anything..."
                className="w-full pl-11 h-10 bg-secondary/40 border-transparent focus:bg-background focus:ring-4 focus:ring-primary/10 rounded-2xl transition-all text-sm font-medium"
              />
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="relative group">
              <Button variant="ghost" size="icon" className="relative rounded-2xl hover:bg-secondary transition-all">
                <Bell className="h-5 w-5 text-muted-foreground/80" />
                <span className="absolute top-3 right-3 h-2 w-2 rounded-full bg-destructive ring-4 ring-background"></span>
              </Button>
            </div>
            <div className="flex items-center gap-4 pl-4 border-l border-border">
              <div className="text-right hidden md:block">
                <p className="text-sm font-bold leading-none">John Doe</p>
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-1">Admin</p>
              </div>
              <div className="h-10 w-10 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-sm font-bold text-primary shadow-sm shadow-primary/10">
                JD
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 p-8 lg:p-12 overflow-auto bg-muted/5">
          {children}
        </div>
      </main>
    </div>
  );
}
