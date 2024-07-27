"use client";
import Image from "next/image";

const Contact = () => {
  return (
    <div id="contact" className="p-2 flex flex-col md:flex-row justify-center items-center mt-12 mx-10 md:px-8 mb-8 py-4 bg-lotion rounded-[16px]">
      <div className="flex flex-col w-full md:w-1/2 py-4 px-5">
        <div className="mb-4 py-4 mt-7">
          <h2 className="text-5xl text-chineseBlackLight font-bold ">
            Kontakt
          </h2>
        </div>
        <p className="text-[16px] text-chineseBlackLight pb-4 my-4">
          Za bilo koje informacije, molimo vas da nam se obratite ili putem
          društvenih mreža ili putem email-a.
        </p>
        <div className="flex w-full lg:w-2/3 flex-col space-y-4 sm:space-y-0 sm:flex-row sm:space-x-4 mb-8 mt-4 mr-5">
          <button
            className="bg-purplePizzazz text-white hover:bg-grayy text-[16px] flex-grow py-3 px-4 
            rounded-[16px] flex justify-center items-center space-x-2"
          >
            <Image
              src="/images/landing/facebook_logo.png"
              width={12}
              height={12}
              alt="facebook-icon"
            />
            <span>Facebook</span>
          </button>
          <button
            className="bg-crayola text-white text-[16px] flex flex-grow py-3 px-4 rounded-[16px] 
					justify-center items-center space-x-2 hover:bg-grayy"
          >
            <Image
              src="/images/landing/tiktok_logo.png"
              alt="tiktok-icon"
              width={17}
              height={17}
            />
            <span>Tik Tok</span>
          </button>
        </div>
        <div className="flex flex-col space-y-6 pt-2 mt-2">
          <div className="flex items-center space-x-2">
            <Image
              src="/images/landing/mail_icon.png"
              width={19}
              height={19}
              alt="mail-icon"
            />
            <p className="text-[16px] text-chineseBlackLight">
              info@zenska-vizija.org
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Image
              src="/images/landing/location_icon.png"
              alt="location-icon"
              width={18}
              height={18}
            />
            <p className="text-[16px] text-chineseBlackLight">
              Mihaila I Zivka Crnogorcevica 9, Tuzla, BiH
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Image
              src="/images/landing/phone_icon.png"
              alt="phone-icon"
              width={20}
              height={20}
            />
            <p className="text-[16px] text-chineseBlackLight">+38760 123456</p>
          </div>
        </div>
      </div>
      <div className="w-full md:w-1/2 p-2 md:p-8">
        {/* Embedded Google Map */}
        <iframe
          className="w-full h-full rounded-[16px] mt-4"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d45498.815361522684!2d18.634478709767258!3d44.54226702044187!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x475ead03ad64e779%3A0xa667fa80a17fd8cb!2sTuzla!5e0!3m2!1sen!2sba!4v1709570652260!5m2!1sen!2sba"
          style={{ border: 0, height: "450px" }}
          allowFullScreen
          loading="lazy"
        ></iframe>
      </div>
    </div>
  );
};

export default Contact;