import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/AuthContext";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";


export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { login ,isAuthenticated} = useAuth();
 const navigate = useNavigate(); // ✅ add navigate

  useEffect(() => {
    // If already authenticated, redirect to home
    if (isAuthenticated) {
      navigate("/", { replace: true });
    }
  }, [isAuthenticated, navigate]);
const handleLogin = async (e: React.FormEvent) => {
  e.preventDefault();
  setLoading(true);
  setError("");

  try {
    const success = await login(email, password); // ✅ await the async function

    if (success) {
      console.log("Logged in!");
    } else {
      setError("Invalid credentials");
    }
  } catch (err) {
    console.error(err);
    setError("Something went wrong");
  } finally {
    setLoading(false); // ✅ stop loading in all cases
  }
};


  return (
    <div className="flex min-h-screen items-center justify-center bg-background text-foreground">
      <div className="w-full max-w-md rounded-lg bg-card p-8 shadow-card">
        <h1 className="mb-6 text-center text-2xl font-bold">Glam Nest Admin</h1>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label htmlFor="email" className="mb-1 block text-sm font-medium">
              phone number
            </label>
            <Input
              id="phone_number"
              type="text"
              placeholder="admin@glamnest.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="mb-1 block text-sm font-medium">
              Password
            </label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full"
              required
            />
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          © 2025 Glam Nest. All rights reserved.
        </p>
      </div>
    </div>
  );
}
