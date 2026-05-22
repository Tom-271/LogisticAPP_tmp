"use client";

import { useActionState } from "react";
import { signupAction } from "@/app/actions/auth";
import { FormState } from "@/app/lib/definitions";
import Link from "next/link";

export default function SignUp() {
  const initialState: FormState = {
    errors: {},
    values: {},
    message: "",
    success: false,
  };

  const [state, formAction, isPending] = useActionState(
    signupAction,
    initialState
  );

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4 py-12">
      <div className="w-full max-w-xl bg-white p-8 rounded-2xl shadow-lg border border-gray-100 space-y-6">
        
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900">Registrati</h2>
          <p className="text-sm text-gray-500 mt-2">Crea un nuovo account per iniziare</p>
        </div>

        <form action={formAction} className="space-y-6">
          
          {/* Messaggio di Errore Globale */}
          {!state?.success && state?.message && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-600 text-sm font-medium rounded-lg text-center">
              {state.message}
            </div>
          )}

          {/* 1. Username (Centrato, riga singola) */}
          <div className="flex flex-col space-y-1">
            <label className="text-sm font-semibold text-gray-700 text-center">Username</label>
            <input
              type="text"
              name="username"
              defaultValue={state?.values?.username as string}
              placeholder="Scegli un username"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-gray-50 text-gray-800 text-center placeholder-gray-400 placeholder:font-light"
            />
            {state?.errors?.username && (
              <p className="text-red-500 text-xs mt-1 text-center">{state?.errors.username}</p>
            )}
          </div>

          {/* 2. Nome e Cognome (Affiancati) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="flex flex-col space-y-1">
              <label className="text-sm font-semibold text-gray-700 text-center">Nome</label>
              <input
                type="text"
                name="name"
                defaultValue={state?.values?.name as string}
                placeholder="Inserisci il tuo nome"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-gray-50 text-gray-800 text-center placeholder-gray-400 placeholder:font-light"
              />
              {state?.errors?.name && (
                <p className="text-red-500 text-xs mt-1 text-center">{state?.errors.name}</p>
              )}
            </div>

            <div className="flex flex-col space-y-1">
              <label className="text-sm font-semibold text-gray-700 text-center">Cognome</label>
              <input
                type="text"
                name="surname"
                defaultValue={state?.values?.surname as string}
                placeholder="Inserisci il tuo cognome"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-gray-50 text-gray-800 text-center placeholder-gray-400 placeholder:font-light"
              />
              {state?.errors?.surname && (
                <p className="text-red-500 text-xs mt-1 text-center">{state?.errors.surname}</p>
              )}
            </div>
          </div>

          {/* Separatore */}
          <hr className="border-gray-200 w-1/2 mx-auto" />

          {/* 3. Email (Centrata, riga singola) */}
          <div className="flex flex-col space-y-1">
            <label className="text-sm font-semibold text-gray-700 text-center">Email</label>
            <input
              type="email"
              name="email"
              defaultValue={state?.values?.email as string}
              placeholder="Inserisci la tua e-mail"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-gray-50 text-gray-800 text-center placeholder-gray-400 placeholder:font-light"
            />
            {state?.errors?.email && (
              <p className="text-red-500 text-xs mt-1 text-center">{state?.errors.email}</p>
            )}
          </div>

          {/* Separatore */}
          <hr className="border-gray-200 w-1/2 mx-auto" />

          {/* 4. Password e Conferma Password (Affiancati) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="flex flex-col space-y-1">
              <label className="text-sm font-semibold text-gray-700 text-center">Password</label>
              <input
                type="password"
                name="password"
                defaultValue={state?.values?.password as string}
                placeholder="Crea una password"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-gray-50 text-gray-800 text-center placeholder-gray-400 placeholder:font-light"
              />
              {state?.errors?.password && (
                <p className="text-red-500 text-xs mt-1 text-center">{state?.errors.password}</p>
              )}
            </div>

            <div className="flex flex-col space-y-1">
              <label className="text-sm font-semibold text-gray-700 text-center">Conferma Password</label>
              <input
                type="password"
                name="confirmPassword"
                defaultValue={state?.values?.confirmPassword as string}
                placeholder="Ripeti la password"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-gray-50 text-gray-800 text-center placeholder-gray-400 placeholder:font-light"
              />
              {state?.errors?.confirmPassword && (
                <p className="text-red-500 text-xs mt-1 text-center">
                  {state?.errors.confirmPassword}
                </p>
              )}
            </div>
          </div>

          {/* Pulsante Submit */}
          <button
            type="submit"
            disabled={isPending}
            className="w-full mt-4 py-2.5 bg-blue-600 text-white font-medium rounded-lg shadow-md hover:bg-blue-700 hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isPending ? "Registrazione in corso..." : "Registrati"}
          </button>
        </form>

        {/* Link di Accesso */}
        <div className="text-center text-sm text-gray-600 mt-6 pt-4 border-t border-gray-100">
          Hai già un account?{" "}
          <Link href="/auth/login" className="text-blue-600 font-semibold hover:text-blue-800 transition-colors">
            Accedi
          </Link>
        </div>
        
      </div>
    </div>
  );
}