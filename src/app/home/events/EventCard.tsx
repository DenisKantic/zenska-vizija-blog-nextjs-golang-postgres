"use client";
import Image, { StaticImageData } from "next/image";

interface EventCardProps {
  imageURL: string | StaticImageData;
  title: string;
  locationIcon: string | StaticImageData;
  location: string;
  clockIcon: string | StaticImageData;
  calendarIcon: string | StaticImageData;
  time: string;
  description: string;
}

const EventCard: React.FC<EventCardProps> = ({
  imageURL,
  title,
  locationIcon,
  clockIcon,
  time,
  calendarIcon,
  description,
  location,
}) => {
  return (
    <div className="lg:py-4 lg:px-4 md:px-2 md:py-3 sm:px-6 sm:py-4 flex justify-center md:gap-1 sm:gap-3">
      <div className="bg-white shadow-xl p-7 flex rounded-[16px]">
        {/* start of icons */}
        <div className="flex">
          <div className="flex flex-col gap-2">
            <div className="flex flex-row gap-5">
              <div
                className="flex items-center gap-2 border-[1px] border-solid 
              rounded-[16px] border-purplePizzazz px-3 py-2"
              >
                <Image
                  src={locationIcon}
                  alt="location"
                  width={20}
                  height={20}
                />
                <span className="lg:text-[12px] xs:text-[10px] text-purplePizzazz font-bold">
                  {location}
                </span>
              </div>
              <div
                className="flex items-center gap-2 border-[1px] border-solid
              rounded-[16px] border-purplePizzazz px-3 py-2"
              >
                <Image src={clockIcon} alt="clock" width={20} height={20} />
                <span className="lg:text-[12px] xs:text-[10px] text-purplePizzazz font-bold">
                  {time}
                </span>
              </div>
            </div>

            <p className="lg:text-[16px] xs:text-[14px] font-semibold text-purplePizzazz">
                {title.substring(0,20)+"..."}
              </p>
            <div className="py-2">
              <p className="text-chineseBlack lg:text-[26px] xs:text-[20px] font-semibold overflow-hidden" dangerouslySetInnerHTML={{__html: description }}>
              </p>
            </div>

            <div className="flex mt-2">
              <Image
                src={imageURL}
                alt={title}
                className="w-[500px] h-[300px] object-cover"
                width={500}
                height={300}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventCard;