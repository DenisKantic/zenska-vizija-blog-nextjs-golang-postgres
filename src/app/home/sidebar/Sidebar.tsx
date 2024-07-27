"use client";
import React, { useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { HiOutlineMenuAlt3 } from "react-icons/hi";
import { TfiClose } from "react-icons/tfi";
export default function Sidebar({showAside, showSidebar}: any) {
    const router = useRouter();
  const sidebarRef = useRef<HTMLDivElement>(null); // Specify the type explicitly
   

  const scrollTo = (route: any) => {
    showAside();
    const element = document.getElementById(route);
    if (element) element.scrollIntoView({ behavior: "smooth", block: "start", inline: "nearest" });
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target as Node)) {
        showAside();
      }
    }

    if (showSidebar) {
        document.addEventListener("mousedown", handleClickOutside);
    }
    
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showAside, showSidebar]);

  return (
    <div ref={sidebarRef} className={` ${showSidebar ? 'right-3 opacity-1' : '-right-[100%] opacity-0'} bg-lotion transition-all ease-in-out delay-150 flex z-50 p-8 pt-20 rounded-lg   w-2/3 fixed top-3`}>
            <div className="absolute top-8 right-8 cursor-pointer" onClick={() => showAside()}>
                <TfiClose size={24} color="#97427B"/>
            </div>
            
            <ul className=" mr-12 flex flex-col gap-4 w-full">
                <li onClick={() => scrollTo('aboutUs')} className="cursor-pointer hover:bg-crayola hover:text-white rounded-[16px] px-5 py-3">
                <a className="text-[16px]">
                    O nama
                </a>
                </li>

                <li onClick={() => scrollTo('programs')} className="cursor-pointer hover:bg-crayola hover:text-white rounded-[16px] px-5 py-3">
                <a className="text-[16px]">
                    Programi
                </a>
                </li>

                <li onClick={() => scrollTo('events')} className="cursor-pointer hover:bg-crayola hover:text-white rounded-[16px] px-5 py-3">
                <a className="text-[16px]">
                    Događaji
                </a>
                </li>

                <li onClick={() => scrollTo('blog')} className="cursor-pointer hover:bg-crayola hover:text-white rounded-[16px] px-5 py-3">
                <a className="text-[16px]">
                    Blog
                </a>
                </li>

                <li onClick={() => scrollTo('gallery')} className="cursor-pointer hover:bg-crayola hover:text-white rounded-[16px] px-5 py-3">
                <a className="text-[16px]">
                    Galerija
                </a>
                </li>

                <li onClick={() => scrollTo('contact')} className="cursor-pointer hover:bg-crayola hover:text-white rounded-[16px] px-5 py-3">
                <a className="text-[16px]">
                    Kontaktiraj nas
                </a>
                </li>
            </ul>
          </div>
   
  )
}
