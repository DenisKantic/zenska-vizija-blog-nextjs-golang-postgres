'use client'
import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import axios from 'axios'
import { useRouter } from 'next/navigation'

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
  const router = useRouter()

  console.log('BLOGS', blogs)

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

  useEffect(() => {
    fetchBlogs()
  }, []) // Empty dependency array means this effect runs once on mount

  if (loading) return <p>Loading...</p>
  if (error) return <p>{error}</p>

  function formatDate(dateString: string): string {
    const date = new Date(dateString)

    // Extract day, month, and year
    const day = date.getUTCDate()
    const month = date.getUTCMonth() + 1 // Months are zero-based
    const year = date.getUTCFullYear()

    // Format day and month with leading zeroes if needed
    const formattedDay = day.toString().padStart(2, '0')
    const formattedMonth = month.toString().padStart(2, '0')

    // Return formatted date in "day/month/year" format
    return `${formattedDay}/${formattedMonth}/${year}`
  }

  const deleteBlog = async (id: number) => {
    try {
      await axios.delete(`http://localhost:8080/deleteBlog?id=${id}`)
      console.log(`Blog with ID ${id} deleted successfully.`)
      fetchBlogs()
    } catch (error) {
      console.log('error while deleting the blog', error)
    }
  }

  return (
    <>
      {blogs.map((blog) => (
        <div
          key={blog.id}
          className="relative group overflow-hidden text-black bg-gray-300  h-full rounded-xl"
        >
          <Image
            src={`http://localhost:8080/${blog.image_paths[0]}`}
            alt={`Blog Image ${blog.title}`}
            unoptimized
            className="w-full h-[30vh] object-cover bg-gray-400 rounded-t-xl"
            height={150} // Adjust as needed
            width={150} // Adjust as needed
            onError={(e) => {
              console.error(
                'Error loading image:',
                (e.target as HTMLImageElement).src
              )
            }}
          />
          <div className="p-2">
            <p className="text-2xl font-bold text-black">
              {blog.title.substring(0, 20) + '...'}
            </p>
            <p
              className="text-lg"
              dangerouslySetInnerHTML={{
                __html: blog.description.substring(0, 20) + '...',
              }}
            ></p>
            <div>
              {/* {blog.image_paths.map((path, index) => {
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
                  />  */}
            </div>
            <p className="text-md">Kreirano: {formatDate(blog.date_created)}</p>
          </div>
          <div className="absolute inset-0 bg-black bg-opacity-80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="flex gap-5 flex-col justify-start">
              <span className="text-white text-2xl font-bold btn btn-success">
                Pročitaj
              </span>
              <span className="text-white text-2xl font-bold btn btn-info">
                Uredi
              </span>
              <button
                onClick={() => deleteBlog(blog.id)}
                className="text-white text-2xl font-bold btn btn-error"
              >
                Obriši
              </button>
            </div>
          </div>
        </div>
      ))}
    </>
  )
}

export default BlogList
