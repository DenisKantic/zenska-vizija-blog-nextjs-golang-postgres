'use server'

import React from 'react'
import axios from 'axios'
import Image from 'next/image'

interface Blog {
  id: number
  title: string
  description: string
  image_paths: string[] // Array of image paths
  date_created: string
  updated_at: string
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
      `http://localhost:8080/getBlogItem/${slug}?slug=${slug}`
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

export default async function BlogItem({ params: { slug } }: Props) {
  const blog = await fetchBlogItem(slug)

  if (!blog) {
    return <p>NOT FOUND!</p>
  }

  const images = processImagePaths(blog.image_paths)
  console.log(typeof images)

  return (
    <div className="bg-red-200 w-full min-h-[50svh]">
      <p className="text-2xl text-black font-bold">Naslov: {blog.title}</p>
      <p
        className="py-5"
        dangerouslySetInnerHTML={{ __html: blog.description }}
      ></p>
      <p>Images: {blog.image_paths}</p>
      <Image
        alt={blog.title}
        height={50}
        width={50}
        className="w-full h-[50svh] object-contain"
        src={`http://localhost:8080/${images[0]}`}
      />
    </div>
  )
}
