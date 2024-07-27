"use client";
import React from "react";

const GreetingBlock = () => {
  return (
    <div className="mb-6 px-6">
      <div className="flex justify-center items-center mt-6 py-4">
        <p className="text-[48px] font-bold">Nisi sama!</p>
      </div>
      <div className="flex-col flex justify-between gap-4 w-full text-center items-stretch px-4 py-4 sm:flex-row">
        <div className="bg-white flex-1 sm:w-1/2 rounded-[16px] p-8">
          <p className="text-chineseBlackLight opacity-80 text-[16px]">
            Nasilje nije tvoja krivica. Ne zaslužuješ da budeš povrijeđena,
            ponižena ili zastrašena. Tvoje tijelo je hram ljubavi, dostojanstva
            i samopoštovanja. Nemoj da dozvoliš da te nasilnik odvede u tamu
            koja ti pokušava uzeti snagu.
          </p>
        </div>
        <div className="bg-white flex-1 sm:w-1/2 rounded-[16px] p-8">
          <p className="text-chineseBlackLight opacity-80 text-[16px]">
            Tvoje srce zaslužuje da ljubi i bude voljeno, tvoj um zaslužuje mir
            i sigurnost. Obrati nam se slobodno, nisi sama, mi smo tvoj podrška.
          </p>
        </div>
      </div>
    </div>
  );
};

export default GreetingBlock;
