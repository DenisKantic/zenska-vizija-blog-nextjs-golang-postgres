"use client";
import React, { useState } from "react";
import Link from "next/link";
import { auth } from "@/app/FirebaseConfig";
import { sendPasswordResetEmail } from "firebase/auth";

const Profile = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [passwrodError, setPasswordError] = useState("");
  const [emailError, setEmailError] = useState("");

  const changePassword = async () => {
    setPasswordError("");

    // email format validation
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      setEmailError("Niste ispravno unijeli e-mail");
      return;
    }

    if (password !== newPassword) {
      setPasswordError("Sifre se ne poklapaju, pokusajte opet");
      return;
    }

    try {
      await sendPasswordResetEmail(auth, email);
      // reset input fields after successful password change
      setEmail("");
      setPassword("");
      setNewPassword("");
    } catch (error: any) {
      console.log("Error changing password:", error.message);
      setPasswordError("Sifre se ne poklapaju, pokusajte opet");
    }
  };

  return (
    <div className="w-full h-screen">
      <h1 className="text-4xl">Postavke profila</h1>

      <div className="flex flex-col justify-start items-start mt-20">
        <label>Promijenite Vaš e-mail</label>
        <input
          type="email"
          required
          placeholder="Unesite Vaš mail"
          className="w-[50%] py-3 p-7 text-[#C86DD7] text-xl rounded-full outline-none cursor-pointer
          hover:outline-1 hover:outline-[#F93EDF] focus:outline-[#AC009B]"
          onChange={(e) => setEmail(e.target.value)}
        />
        {emailError && <p className="text-red-500 mt-2">{emailError}</p>}
        <button className="px-4 py-2 bg-red-400 rounded-full mt-5">
          Promijeni
        </button>

        <label className="mt-10">Unesite novu šifru</label>
        <input
          type="password"
          required
          placeholder="Šifra"
          className="w-[50%] mt-5 py-3 p-7 text-[#C86DD7] text-xl rounded-full outline-none cursor-pointer
          hover:outline-1 hover:outline-[#F93EDF] focus:outline-[#AC009B]"
          onChange={(e) => setPassword(e.target.value)}
        />

        <br />
        <label>Potvrdite Vašu šifru</label>
        <input
          type="password"
          required
          placeholder="Šifra"
          className="w-[50%] mt-5 py-3 p-7 text-[#C86DD7] text-xl rounded-full outline-none cursor-pointer
        hover:outline-1 hover:outline-[#F93EDF] focus:outline-[#AC009B]"
          onChange={(e) => setNewPassword(e.target.value)}
        />
        {passwrodError && (
          <p className="text-red-500 mt-2 pl-2">{passwrodError}</p>
        )}
        <button
          className="px-4 py-2 bg-red-400 rounded-full mt-5"
          onClick={() => changePassword()}
        >
          Promijeni
        </button>
      </div>
    </div>
  );
};

export default Profile;
