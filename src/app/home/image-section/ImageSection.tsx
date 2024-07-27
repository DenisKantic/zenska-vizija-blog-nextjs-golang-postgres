"use client";
import Image from "next/image";

const ImageSection = () => {
  return (
    <div className="flex items-center justify-center p-5">
      <Image
        src="/images/landing/nasilje_u_vezi.png"
        alt="relationship"
        className="w-full h-full rounded-[16px] px-6 my-6"
        width={1000}
        height={1000}
      />
    </div>
  );
};

export default ImageSection;
