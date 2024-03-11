"use client";
import Image, { StaticImageData } from "next/image";

interface BlogCardProps {
  imageUrl: string | StaticImageData;
  title: string;
  description: string;
  date: string;
}

const BlogCard: React.FC<BlogCardProps> = ({
  imageUrl,
  title,
  description,
  date,
}) => {
  return (
    <div
      className="mx-auto overflow-hidden bg-white rounded-[16px] shadow-lg 
				flex flex-col justify-center items-center shadow-chineseBlackLight"
    >
      <div className="relative flex">
        <Image
          className="object-cover w-[600px] h-[416px]"
          src={imageUrl}
          alt={title}
          width={600}
          height={416}
        />
        <div
          className="absolute top-[50%] inset-0 flex my-4 mx-4 py-2 px-2
					text-center  rounded-[10px] outline-none bg-chineseBlackLight 
					opacity-70"
        >
          <div className="flex w-full justify-between">
            <div className="flex items-start flex-col">
              <span className="text-2xl font-medium text-lotion pt-1 px-1">
                {title}
              </span>
              <span className="text-[12px] text-lotion opacity-50 px-1 pb-0.5">
                {date}
              </span>
              <span className="text-white text-[14px] pl-1">{description}</span>
            </div>

            <div className="flex items-end">
              <button className="hover:text-white text-purplePizzazz font-bold py-2 px-2 rounded focus:outline-none">
                Pročitaj
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogCard;
