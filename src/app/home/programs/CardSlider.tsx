import { useState } from "react";
import Image from "next/image";

import { dummyData } from "./data/dummyData";

const CardSlider = () => {
  const [startIndex, setStartIndex] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  const goToPrevSet = () => {
    const newIndex = Math.max(startIndex - 3, 0);
    setStartIndex(newIndex);
    setCurrentPage(currentPage - 1);
  };

  const goToNextSet = () => {
    const newIndex = Math.min(startIndex + 3, dummyData.length - 3);
    setStartIndex(newIndex);
    setCurrentPage(currentPage + 1);
  };

  const totalPages = Math.ceil(dummyData.length / 3);

  return (
    <div className="flex flex-col">
      <div className="flex mt-4 justify-end items-center mr-4 mb-4 py-6 px-5">
        <span className="text-chineseBlack mr-4 pr-4">Vidi druge programe</span>
        <div className="flex space-x-2 mr-8">
          <div className="px-2">
            <Image
              className="hover:text-purplePizzazz h-full w-full"
              src="/images/landing/grayArrow.png"
              alt="grayArrow"
              onClick={goToPrevSet}
              width={100}
              height={100}
            />
          </div>
          <div className="px-3">
            <Image
              className=" hover:text-grayy h-full w-full"
              src="/images/landing/pinkArrow.png"
              alt="pinkArrow"
              onClick={goToNextSet}
              width={100}
              height={100}
            />
          </div>
        </div>
      </div>

      <div className="py-4 flex flex-row space-x-12 justify-center overflow-hidden">
        {dummyData.slice(startIndex, startIndex + 3).map((card, index) => (
          <div
            key={index}
            className=" bg-white shadow-lg rounded-xl flex flex-col items-center justify-center px-4"
          >
            <div className="flex justify-center items-center">
              <h2 className="text-2xl font-bold opacity-60 py-6">
                {card.title}
              </h2>
            </div>
            <div className="flex-1 mb-2">
              <Image
                src={card.backgroundImage}
                alt={card.title}
                width={344}
                height={376}
                className="py-1 px-2 rounded-[16px]"
              />
              <div className="flex py-4 px-2">
                <button
                  className=" w-full px-4 py-2 bg-purplePizzazz text-white rounded-[16px]
                  hover:text-purplePizzazz hover:bg-chineseBlackLight 
                  hover:bg-opacity-10"
                >
                  Saznaj Više
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-center mt-4">
        <button
          onClick={goToPrevSet}
          className="h-8 w-8 mr-2 text-gray-500 hover:text-gray-700"
          disabled={startIndex === 0}
        >
          &lt;
        </button>
        <span className="text-chineseBlack mr-1 mt-1">
          {currentPage}/{totalPages}
        </span>
        <button
          onClick={goToNextSet}
          className="h-8 w-8 ml-2 text-gray-500 hover:text-gray-700"
          disabled={startIndex + 3 >= dummyData.length}
        >
          &gt;
        </button>
      </div>
    </div>
  );
};

export default CardSlider;
