"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Eye, EyeOff, Music } from "lucide-react"
import { useNavigate } from "react-router-dom";
import axiosInstance from "@/lib/axios"

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		try {
			const response = await axiosInstance.post("/auth/login", {
				email,
				password,
			});

			const { access_token, user } = response.data;
            if (!access_token || !user) {
                throw new Error("Login failed");
            }
			localStorage.setItem("token", access_token);
			localStorage.setItem("user", JSON.stringify(user));

			navigate("/");
    } catch (err: unknown) {
      console.error("Login failed:", err);
      setError("Email ou senha inválidos.");
    }
	};

  const handleForgotPassword = () => {
    // Navegação para página de recuperação de senha
    console.log("Redirecionando para recuperação de senha...")
    alert("Redirecionando para recuperação de senha...")
  }

  const handleSignUp = () => {
    // Navegação para página de cadastro
    console.log("Redirecionando para cadastro...")
    alert("Redirecionando para cadastro...")
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
              <Music className="w-5 h-5 text-black" />
            </div>
            <span className="text-white text-2xl font-bold">Spotify</span>
          </div>
        </div>

        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader className="space-y-1 pb-6">
            <CardTitle className="text-2xl font-bold text-white text-center">Entrar no Spotify</CardTitle>
            <CardDescription className="text-zinc-400 text-center">
              Digite seu email e senha para continuar
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-white font-medium">
                  Email ou nome de usuário
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Email ou nome de usuário"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-400 focus:border-green-500 h-12"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-white font-medium">
                  Senha
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Senha"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-400 focus:border-green-500 h-12 pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-zinc-400 hover:text-white"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <input
                    id="remember"
                    type="checkbox"
                    className="w-4 h-4 text-green-500 bg-zinc-800 border-zinc-700 rounded focus:ring-green-500"
                  />
                  <Label htmlFor="remember" className="text-sm text-zinc-400">
                    Lembrar de mim
                  </Label>
                </div>
                <button
                  type="button"
                  onClick={handleForgotPassword}
                  className="text-sm text-white hover:text-green-500 underline bg-transparent border-none cursor-pointer"
                >
                  Esqueceu a senha?
                </button>
              </div>

              <Button
                type="submit"
                className="w-full bg-green-500 hover:bg-green-600 text-black font-semibold h-12 rounded-full"
              >
                Entrar
              </Button>
            </form>
            {error && <p style={{ color: "red" }}>{error}</p>}

            <Separator className="bg-zinc-700" />

            <div className="text-center">
              <span className="text-zinc-400">Não tem uma conta? </span>
              <button
                onClick={handleSignUp}
                className="text-white hover:text-green-500 underline font-medium bg-transparent border-none cursor-pointer"
              >
                Inscreva-se no Spotify
              </button>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="mt-8 text-center text-xs text-zinc-500">
          <p>
            Esta página é protegida pelo reCAPTCHA e se aplicam a{" "}
            <button className="underline hover:text-zinc-400 bg-transparent border-none cursor-pointer">
              Política de Privacidade
            </button>{" "}
            e os{" "}
            <button className="underline hover:text-zinc-400 bg-transparent border-none cursor-pointer">
              Termos de Serviço
            </button>{" "}
            do Google.
          </p>
        </div>
      </div>
    </div>
  )
}
