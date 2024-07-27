"use client";
import { useAuth } from "@/app/AuthContext";
import React, { useState } from "react";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [resetMessage, setResetMessage] = useState("");
  const { forgotPassword } = useAuth();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      await forgotPassword(email);
      setResetMessage(
        "Zahtjev za resetovanje lozinke poslat! Molimo provjerite Vašu e-mail adresu kako biste nastavili."
      );
      setEmail("");
    } catch (error: any) {
      if (error.code === "auth/user-not-found") {
        setResetMessage("Korisnik sa unesenom e-mail adresom nije pronađen.");
      } else if (error.code === "auth/invalid-user") {
        setResetMessage("Niste unijeli ispravan e-mail.");
      } else {
        setResetMessage("Doslo je do greske. Pokusajte jos jednom.");
      }
    }
  };

  return (
    <div className="flex flex-col items-center mt-10 min-h-screen">
      <div className="border border-gray-300 p-6 rounded-lg w-80">
        <div className="mb-5 mt-4">
          <h1 className="text-2xl font-bold mb-4">Resetovanje lozinke</h1>
        </div>
        <form
          onSubmit={handleSubmit}
          className="flex flex-col items-start w-90"
        >
          <input
            type="email"
            placeholder="Unesite e-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border border-gray-300 rounded-lg px-4 py-2 mb-4 focus:outline-none"
          />

          <button
            type="submit"
            className="bg-purplePizzazz hover:bg-grayy text-white font-bold 
            py-2 px-6 rounded-lg focus:outline-none"
          >
            Potvrdi
          </button>
          <div className="pl-1 py-5">
            {resetMessage && (
              <p className="text-red-500 font-bold text-[14px]">
                {resetMessage}
              </p>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
