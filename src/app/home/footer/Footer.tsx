"use client";
import Image from "next/image";
import Link from "next/link";
import phoneIcon from "../../../../public/images/landing/phone_icon.png";

const Footer = () => {
  const scrollTo = (route: any) => {
    const element = document.getElementById(`${route}`);
    if (element) element.scrollIntoView({ behavior: "smooth", block: "start", inline: "nearest" });
  }
  return (
    <>
      <div
        className="md:w-[93%] bg-lotion px-10 py-12 sm:mx-auto flex justify-between
		 md:flex-nowrap flex-wrap flex-col  rounded-[16px]"
      >
        <div className="flex flex-col lg:flex-row items-center justify-center">
          <div className=" flex-shrink-0 lg:mr-40 lg:ml-20">
            <a className="flex title-font font-medium items-center justify-center text-gray-900">
              <Image
                src="/images/landing/company_logo.png"
                alt="company-logo"
                width={120}
                height={120}
              />
            </a>
          </div>

        <div className="flex-grow flex flex-wrap gap-5 justify-between">
          <div className="lg:w-1/4 md:w-1/2 w-full">
            <h2 className="font-medium text-chineseBlackLight text-[16px] mb-3">
              Linkovi
            </h2>
            <nav className="list-none mb-10 py-2 gap-2 flex flex-col items-start cursor-pointer text-[14px]">
              <li>
                <a className="text-chineseBlackLight hover:text-crayola">
                <Link href='/about_us'>
                  O nama
                  </Link>
                </a>
              </li>
              <li onClick={() => scrollTo('programs')}>
                <a className="text-chineseBlackLight hover:text-crayola">
                  Programi
                </a>
              </li>
              <li onClick={() => scrollTo('events')}>
                <a className="text-chineseBlackLight hover:text-crayola">
                  Događaji
                </a>
              </li>
              <li onClick={() => scrollTo('blog')}>
                <a className="text-chineseBlackLight hover:text-crayola">
                  Blog
                </a>
              </li>
              <li onClick={() => scrollTo('gallery')}>
                <a className="text-chineseBlackLight hover:text-crayola">
                  Galerija
                </a>
              </li>
            </nav>
          </div>
          <div className="lg:w-1/4 md:w-1/2 w-full ">
            <div className="flex flex-col items-start cursor-pointer gap-2">
              <h2 className="font-medium text-chineseBlackLight text-[16px] mb-4">
                Podrška
              </h2>
              <a className="text-[14px] text-chineseBlackLight hover:text-crayola">
                Politika Privatnosti
              </a>
              <a className="text-[14px] text-chineseBlackLigh hover:text-crayola">
                Uslovi korištenja
              </a>
              <a className="text-chineseBlackLight hover:text-crayola text-[14px]">
                Pomoć
              </a>
            </div>
          </div>
          <div className="lg:w-1/4 md:w-1/2 w-full">
            <h2 className="font-medium text-chineseBlackLight text-[16px] mb-4">
              Kontakt
            </h2>
            {/* Location */}
            <div className="flex items-center space-x-2 gap-2 py-2">
              <Image
                src="/images/landing/location_icon.png"
                alt="location-icon"
                width={18}
                height={18}
              />
              <p className="text-[14px] text-chineseBlackLight text-left">
                Mihaila I Zivka Crnogorcevica 9, Tuzla
              </p>
            </div>
            {/* Mail */}
            <div className="flex items-center space-x-2 gap-3">
              <Image
                src="/images/landing/mail_icon.png"
                alt="mail-icon"
                width={16}
                height={16}
              />
              <p className="text-[14px] text-chineseBlackLight">
                info@zenska-vizija.org
              </p>
            </div>
            {/* Phone */}
            <div className="flex items-center space-x-2 py-2">
              <Image
                src="/images/landing/phone_icon.png"
                alt="phone-icon"
                width={19}
                height={19}
              />
              <p className="text-[14px] text-chineseBlackLight px-2">
                +38760 123456
              </p>
            </div>
          </div>
          
        </div>
        </div>
        <div className="my-12">
            <p className="text-chineseBlackLight text-center opacity-80 text-[12px]">
              © Ženska Vizija 2024. Sva prava zadržava.
            </p>
          </div>
      </div>
    </>
  );
};

export default Footer;
