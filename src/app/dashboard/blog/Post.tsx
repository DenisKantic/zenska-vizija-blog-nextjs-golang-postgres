'use client'
import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import axios from 'axios'

interface Blog {
  id: number
  title: string
  description: string
  image_paths: string[] // Array of image paths
  date_created: string
  updated_at: string
}

const BlogList: React.FC = () => {
  const [blogs, setBlogs] = useState<Blog[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  console.log('BLOGS', blogs)

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await axios.get<Blog[]>('http://localhost:8080/blogs')
        const processedBlogs = (response.data as any[]).map((blog) => {
          // Ensure `image_paths` is an array of strings
          const imagePaths =
            typeof blog.image_paths === 'string'
              ? blog.image_paths
                  .replace(/{|}/g, '') // Remove curly braces
                  .split(',') // Split by comma
                  .map((path: string) => path.trim()) // Trim whitespace
              : blog.image_paths // If already an array, use it directly

          return {
            ...blog,
            image_paths: imagePaths,
          }
        })

        setBlogs(processedBlogs)
        console.log(response.data)
      } catch (error) {
        setError('Failed to fetch blogs')
      } finally {
        setLoading(false)
      }
    }

    fetchBlogs()
  }, []) // Empty dependency array means this effect runs once on mount

  if (loading) return <p>Loading...</p>
  if (error) return <p>{error}</p>

  return (
    <div>
      {blogs.map((blog) => (
        <div key={blog.id}>
          <h2>{blog.title}</h2>
          <p dangerouslySetInnerHTML={{ __html: blog.description }}></p>
          <div>
            {blog.image_paths.map((path, index) => {
              // Log the image path to verify
              console.log(`Image path: ${path}`)
              return (
                <div key={index}>
                  <Image
                    src={`http://localhost:8080/${path}`}
                    alt={`Blog Image ${index}`}
                    unoptimized
                    className="w-full h-full pb-10"
                    height={150} // Adjust as needed
                    width={150} // Adjust as needed
                    onError={(e) => {
                      console.error(
                        'Error loading image:',
                        (e.target as HTMLImageElement).src
                      )
                    }}
                  />
                </div>
              )
            })}
          </div>
          <p>Date Created: {blog.date_created}</p>
          <p>Last Updated: {blog.updated_at}</p>
        </div>
      ))}
    </div>
  )
}

export default BlogList
