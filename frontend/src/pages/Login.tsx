import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Briefcase, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { API_URL } from "@/App";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || "Login failed");
      login(data.token, data.user);
      toast.success("Welcome back!");
      navigate("/");
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <Card className="w-full max-w-md shadow-xl border-none rounded-3xl overflow-hidden">
        <CardHeader className="space-y-4 pt-10 pb-6 px-10">
          <div className="flex justify-center">
            <div className="bg-primary p-3 rounded-2xl shadow-lg shadow-primary/30">
              <Briefcase className="h-8 w-8 text-white" />
            </div>
          </div>
          <div className="text-center space-y-1">
            <CardTitle className="text-3xl font-black tracking-tight">Welcome Rahul</CardTitle>
            <CardDescription className="text-slate-500 font-medium">Log in to your Rahul CRM account</CardDescription>
          </div>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6 px-10">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-xs font-bold uppercase tracking-widest text-slate-400">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="name@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-12 bg-slate-100 border-transparent focus:bg-white focus:ring-2 focus:ring-primary/20 rounded-xl transition-all"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-xs font-bold uppercase tracking-widest text-slate-400">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="h-12 bg-slate-100 border-transparent focus:bg-white focus:ring-2 focus:ring-primary/20 rounded-xl transition-all"
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-6 px-10 pb-10 pt-4">
            <Button type="submit" className="w-full h-12 rounded-xl text-sm font-bold shadow-lg shadow-primary/20" disabled={isLoading}>
              {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Sign In"}
            </Button>
            <p className="text-center text-sm text-slate-500 font-medium">
              Don't have an account?{" "}
              <Link to="/signup" className="text-primary font-bold hover:underline underline-offset-4">
                Sign up
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
