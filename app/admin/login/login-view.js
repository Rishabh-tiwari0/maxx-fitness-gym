"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signInWithEmailAndPassword } from "firebase/auth";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { auth } from "@/lib/firebase/client";
import { createSessionAction } from "./actions";

export default function LoginView() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      // 1. Sign in with Firebase Auth in the browser.
      const credential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const idToken = await credential.user.getIdToken();

      // 2. Hand the ID token to a Server Action, which verifies it with
      //    the Admin SDK and sets an httpOnly session cookie.
      const result = await createSessionAction(idToken);
      if (!result.success) {
        setError(result.error);
        setIsSubmitting(false);
        return;
      }

      router.push("/admin/dashboard");
      router.refresh();
    } catch (err) {
      console.error(err);
      setError("Invalid email or password.");
      setIsSubmitting(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-10">
      <Card className="w-full max-w-md border-border/80 shadow-lg">
        <CardHeader className="space-y-2 text-center">
          <CardTitle className="text-2xl uppercase tracking-tight">
            Admin Login
          </CardTitle>
          <CardDescription>
            Access the Max Fitness management dashboard.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="admin@maxxfitness.com"
                autoComplete="username"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="••••••••"
                autoComplete="current-password"
              />
            </div>

            {error ? (
              <p role="alert" className="text-sm text-destructive">
                {error}
              </p>
            ) : null}

            <Button
              type="submit"
              size="lg"
              className="w-full uppercase tracking-wide"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Signing in..." : "Login to Dashboard"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
