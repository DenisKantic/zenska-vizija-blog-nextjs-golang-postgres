"use client";
import CardSlider from "./CardSlider";

const Programs = () => {
  return (
    <>
      <div id="programs"
        className="flex items-center justify-center font-bold text-5xl 
      pt-10 pb-4 px-6 mb-4 mt-10 text-chineseBlack"
      >
        <h1>Programi</h1>
      </div>
      <div className="my-6 px-6 py-2 flex items-center justify-center">
        <p className="text-chineseBlackLight opacity-80 text-[20px] ">
          Ženska vizija vam pruža razne programe koje pomažu ženama u borbi
          protiv diskriminacije u svim životnim sferama. Takođe,
          <br />{" "}
          <span className="flex items-center justify-center">
            na njihovom individualnom osnaživanju.
          </span>
        </p>
      </div>
      <CardSlider />
    </>
  );
};

export default Programs;
