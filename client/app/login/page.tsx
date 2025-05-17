"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useDashboardStore } from "@/store/dashboardStore";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Loader2 } from "lucide-react";

function Page() {

  const router = useRouter();
  const { toast } = useToast();
  const { user, setUser } = useDashboardStore();
  const [loading, setLoading] = useState(false);
  const [loginInfo, setLoginInfo] = useState({email: "",password: "",});

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setLoginInfo({...loginInfo,[name]: value,});
  };

  const submitForm = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    try {

      const url = `${process.env.NEXT_PUBLIC_BASE_URL}/auth/login`;
      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(loginInfo),
      });

      const result = await res.json();
      const { success, message, jwtToken, email, name } = result;

      if (success) {
        toast({
          title: "Login Successful",
          variant: "default",
          className: "bg-green-400 text-black",
          duration: 2000,
        });

        await localStorage.setItem("user",JSON.stringify({name: name,email: email,token: jwtToken,}));
        setUser(localStorage.getItem("user")? JSON.parse(localStorage.getItem("user") as string): null);
        router.push("/");

      } else {
        toast({
          title: "Error",
          description: message,
          variant: "default",
          className: "bg-red-400 text-black",
          duration: 2000,
        });
      }
    } catch (error: any) {
      const { message } = error;
      toast({
        title: "Error",
        description: message,
        variant: "default",
        className: "bg-red-400 text-black",
        duration: 2000,
      });
      console.error(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setUser(localStorage.getItem("user")? JSON.parse(localStorage.getItem("user") as string): null);
  }, []);

  // Redirecting the user to the dashboard if they are already logged in
  useEffect(() => {
    if (user) {
      router.push("/");
    }
  }, [user, router]);

  return (
    <motion.div
  initial={{ opacity: 0, scale: 0.95 }}
  animate={{ opacity: 1, scale: 1 }}
  transition={{ duration: 0.8, ease: "easeOut" }}
  className="flex items-center justify-center min-h-screen px-6 bg-muted"
>

    <div className="flex items-center justify-center min-h-screen px-6 bg-muted">


      <motion.div
  initial={{ opacity: 0, y: 40 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
  className="w-full max-w-3xl"
>
  
 <Card className="w-full max-w-3xl shadow-xl transition-all duration-300 p-1">




        <CardHeader className="space-y-1">

          <CardTitle className="text-3xl font-bold text-center ">
            Login Your Account
          </CardTitle>
          <CardDescription className="text-center ">
            Task Management Dashboard
          </CardDescription>
        </CardHeader>
        
            

        <CardContent>
        <div className="text-center">
        </div>
          <form className="space-y-4" onSubmit={submitForm}>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
              className="transition-all duration-200 focus:ring-2 focus:ring-blue-400"
                id="email"
                type="email"
                placeholder="Enter your email"
                name="email"
                onChange={handleChange}
                required
              />
              <p>Default Mail : test123@gmail.com</p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                className="transition-all duration-200 focus:ring-2 focus:ring-blue-400"
                type="password"
                placeholder="Enter your password"
                name="password"
                autoComplete="on"
                onChange={handleChange}
                required
              />
              <p>Default Password : Student@123</p>
            </div>
            <Button
  type="submit"
  disabled={loading}
  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md transition duration-300 ease-in-out flex items-center justify-center gap-2"
>
  {loading ? (
    <>
      <Loader2 className="animate-spin h-4 w-4" />
      Signing In...
    </>
  ) : (
    "Sign In"
  )}
</Button>
          </form>

          <div className="pt-4">
            <p className="text-center">
              Don't have an account?{" "}
              <Link href="/register" className="text-blue-600 hover:underline">
                Sign Up
              </Link>
            </p>
          </div>

        </CardContent>
      </Card>
      </motion.div>
    </div>
    </motion.div>
  );
}

export default Page;