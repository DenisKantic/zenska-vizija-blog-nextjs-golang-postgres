"use client";
import Image from "next/image";

const HeroSection = () => {
  const scrollTo = () => {
    const element = document.getElementById("contact");
    if (element)
      element.scrollIntoView({
        behavior: "smooth",
        block: "start",
        inline: "nearest",
      });
  };

  return (
    <section id="home">
      <div className="flex md:flex-row flex-col pb-12 h-[100%]">
        <div
          className="px-4 pb-14 pt-32 bg-crayola flex-wrap w-full md:w-1/2 md:px-10 lg:px-16 flex flex-col md:items-start 
          md:text-left text-center items-center justify-center"
        >
          <div className="leading-8 pt-8 ">
            <h1 className="text-4xl md:text-5xl mb-4 font-bold text-white">
              U ZNAK SOLIDARNOSTI ZA NAŠA PRAVA
            </h1>
            <p className="text-white mb-8 text-[20px]">
              Posvećeni smo borbi za pravednost, jednakost i autonomiju svih
              žena.
            </p>
          </div>
          <div className="flex my-4 md:mb-0">
            <button
              onClick={() => scrollTo()}
              className="inline-flex items-center justify-center text-white  bg-purplePizzazz
                  border-0 py-2 px-6 focus:outline-none hover:text-purplePizzazz hover:bg-brightGray 
                   rounded-[16px] text-[14px] lg:w-169 lg:h-43 sm:w-48 sm:h-12"
            >
              Kontakiraj nas
            </button>
          </div>
        </div>
        <div className="w-full  md:w-1/2">
          <Image
            className="object-cover object-center w-full h-full"
            alt="hero"
            src="/images/landing/hero_img.png"
            width={600}
            height={600}
          />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
