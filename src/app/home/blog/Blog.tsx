"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
// firebase
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/app/FirebaseConfig";
// components
import BlogCard from "./BlogCard";

const Blog = () => {
  const [startIndex, setStartIndex] = useState(0);
  const [blogs, setBlogs] = useState([]);
 
  // get blogs from firestore
  const getBlogs = () => {
    const blogsCollectionRef = collection(db, "blog");

    getDocs(blogsCollectionRef)
      .then((response) => {
        const blogData: any = response.docs.map((doc) => ({
          data: doc.data(),
          id: doc.id,
        }));
        setBlogs(blogData);
      })
      .catch((error) => {
        console.log(error.message);
      });
  };

  useEffect(() => {
    getBlogs();
  }, []);

  useEffect(() => {
    console.log("svi blogovi: ", blogs);
  }, [blogs]);

  // pagination logic
  const handleNextBlogs = () => {
    setStartIndex((prevIndex) => prevIndex + 4);
  };

  const handlePrevBlogs = () => {
    setStartIndex((prevIndex) => Math.max(prevIndex - 4, 0));
  };

  const currentBlogs = blogs.slice(startIndex, startIndex + 4);
  const currentPage = Math.floor(startIndex / 4) + 1;
  const totalPages = Math.ceil(blogs.length / 4);

  return (
    <div id="blog" className="py-8">
      <div
        className="flex items-center justify-center font-bold text-5xl 
      pt-10 pb-4 px-6 mb-4 mt-10 text-chineseBlack"
      >
        <h1>Blog</h1>
      </div>
      {/* Arrows */}
      <div className="flex mt-4 justify-end items-center mr-4 mb-4 py-6 px-5">
        <span className="text-chineseBlack mr-4 pr-4">Vidi druge programe</span>
        <div className="flex space-x-2 mr-8">
          <div className="px-2">
            <Image
              className="hover:text-purplePizzazz h-full w-full"
              src="/images/landing/grayArrow.png"
              alt="grayArrow"
              width={100}
              height={100}
              onClick={handlePrevBlogs}
            />
          </div>
          <div className="px-1">
            <Image
              className=" hover:text-grayy h-full w-full"
              src="/images/landing/pinkArrow.png"
              alt="pinkArrow"
              width={100}
              height={100}
              onClick={handleNextBlogs}
            />
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 py-4 gap-7 px-6">
        {currentBlogs.map((blog: any) => (
          <BlogCard
            key={blog.id}
            blogId={blog.id}
            imageUrl={blog.data.imageURL}
            title={blog.data.title}
            description={blog.data.description}
            date={blog.data.date}
          />
        ))}
      </div>
      {/* Pagination */}
      <div className="flex justify-center mt-4">
        <span className="text-chineseBlack mr-1 mt-1">
          {currentPage}/{totalPages}
        </span>
      </div>
    </div>
  );
};

export default Blog;