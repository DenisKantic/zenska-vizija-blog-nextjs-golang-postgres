'use client'
import React, { useEffect, useState } from 'react'
import axios from 'axios'
import Image from 'next/image'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Pagination } from 'swiper/modules'

// Import Swiper styles
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'

interface Blog {
  id: number
  title: string
  description: string
  image_paths: string[] // Array of image paths
  date_created: string
  updated_at: string
  time: string
  location: string
  slug: string
}

type Props = {
  params: {
    slug: string
  }
}

const fetchBlogItem = async (slug: string): Promise<Blog | null> => {
  try {
    const response = await axios.get<Blog>(
      `http://localhost:8080/getEventItem/${slug}?slug=${slug}`
    )
    return response.data
  } catch (error) {
    console.error('Error fetching blog item:', error)
    return null
  }
}

const processImagePaths = (imagePaths: string | string[]): string[] => {
  if (typeof imagePaths === 'string') {
    return imagePaths
      .replace(/{|}/g, '') // Remove curly braces
      .split(',') // Split by comma
      .map((path: string) => path.trim()) // Trim whitespace
  }
  return imagePaths // If already an array, use it directly
}

export default function BlogItem({ params: { slug } }: Props) {
  const [blog, setBlog] = useState<Blog | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [fullscreen, setFullscreen] = useState<boolean>(false)
  const [currentSlide, setCurrentSlide] = useState<number>(0)

  useEffect(() => {
    const loadBlogItem = async () => {
      const blogItem = await fetchBlogItem(slug)
      setBlog(blogItem)
      setLoading(false)
    }

    loadBlogItem()
  }, [slug])

  const openFullscreen = (index: number) => {
    setCurrentSlide(index)
    setFullscreen(true)
  }

  const closeFullscreen = () => {
    setFullscreen(false)
  }

  if (loading) {
    return <p>Loading...</p>
  }

  if (!blog) {
    return <p className="text-2xl font-bold">TRAŽENA PUTANJA NE POSTOJI!</p>
  }

  const images = Array.isArray(blog.image_paths)
    ? blog.image_paths
    : processImagePaths(blog.image_paths)

  return (
    <div className="w-full min-h-[100svh] xxs:px-5 md:px-16 overflow-y-scroll pb-20 focus:outline-none">
      <p className="text-2xl text-black font-bold">{blog.title}</p>
      <p
        className="py-5 text-justify mb-5 text-gray-800"
        dangerouslySetInnerHTML={{ __html: blog.description }}
      ></p>
      <Swiper
        modules={[Navigation, Pagination]}
        spaceBetween={0}
        keyboard
        pagination={{ clickable: true }}
        navigation={{}} // Enable navigation
        slidesPerView={1}
        scrollbar={{ draggable: true }}
        onSlideChange={() => console.log('slide change')}
        onSwiper={(swiper) => console.log(swiper)}
      >
        {images.map((url, index) => (
          <SwiperSlide className="w-full h-[50vh]" key={index}>
            <Image
              alt={blog.title}
              height={50}
              width={50}
              className="w-[90%] mx-auto h-[50svh] object-cover cursor-pointer"
              src={`http://localhost:8080/${url}`}
              onClick={() => openFullscreen(index)} // Open fullscreen on click
            />
          </SwiperSlide>
        ))}
      </Swiper>
      <p className="text-lg text-black text-center py-5">
        Kliknite na fotografiju za prikaz preko čitavog ekrana
      </p>

      {/* Fullscreen Overlay */}
      {fullscreen && (
        <div className="fixed h-screen inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 focus:outline-none">
          <Swiper
            initialSlide={currentSlide}
            modules={[Navigation, Pagination]}
            spaceBetween={0}
            pagination={{ clickable: true }}
            navigation={{}} // Enable navigation
            slidesPerView={1}
            scrollbar={{ draggable: true }}
            className="w-full h-[90svh] focus:outline-none"
          >
            {images.map((url, index) => (
              <SwiperSlide
                className="w-full h-[90svh] flex items-center justify-center focus:outline-none"
                key={index}
              >
                <Image
                  alt={blog.title}
                  height={1000}
                  width={1000}
                  className="p-5 object-contain h-[85svh] w-[90%] mx-auto"
                  src={`http://localhost:8080/${url}`}
                />
              </SwiperSlide>
            ))}
          </Swiper>
          <button
            onClick={closeFullscreen}
            className="absolute hover:cursor-pointer top-4 right-4 text-white text-xl font-bold z-60"
          >
            Zatvori
          </button>
        </div>
      )}
    </div>
  )
}
