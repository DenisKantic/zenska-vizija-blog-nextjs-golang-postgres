'use client'
import React, { useEffect, useState, useTransition } from 'react'
import Image from 'next/image'
import axios from 'axios'
import LoadingSpinner from '@/app/spinner/LoadingSpinner'
import Link from 'next/link'

interface Blog {
  id: number
  title: string
  description: string
  image_paths: string[] // Array of image paths
  date_created: string
  updated_at: string
  slug: string
}

const PAGE_SIZE = 16

const BlogList: React.FC = () => {
  const [blogs, setBlogs] = useState<Blog[]>([])
  const [page, setPage] = useState<number>(1)
  const [totalPages, setTotalPages] = useState<number>(1)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(true) // loading state
  const [cache, setCache] = useState<Record<number, Blog[]>>({}) // state for caching previous fetched pages

  const fetchBlogs = async (page: number) => {
    try {
      const response = await axios.get<{
        blogs: Blog[]
        totalPages: number
        currentPage: number
      }>(`http://localhost:8080/blogs?page=${page}&pageSize=${PAGE_SIZE}`)
      const processedBlogs = response.data.blogs.map((blog) => {
        const imagePaths =
          typeof blog.image_paths === 'string'
            ? (blog.image_paths
                .replace(/{|}/g, '') // Remove curly braces
                .split(',') // Split by comma
                .map((path: string) => path.trim()) as string[]) // Trim whitespace // Assert as string array
            : blog.image_paths // If already an array, use it directly
        console.log('SLIKE', imagePaths)
        return {
          ...blog,
          image_paths: imagePaths,
        }
      })

      setCache((prevCache) => ({
        ...prevCache,
        [page]: processedBlogs,
      }))

      setBlogs(processedBlogs)
      setIsLoading(false)
      setTotalPages(response.data.totalPages)
    } catch (error) {
      if (axios.isAxiosError(error)) setError('Greška u učitavanju sa servera.')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    // fetch blogs for the current page if not in cache
    if (!cache[page]) {
      fetchBlogs(page)
    } else {
      setBlogs(cache[page])
      setIsLoading(false)
    }
  }, [page, cache])

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage)
    }
  }

  if (isLoading) return <LoadingSpinner />
  if (error) return <p className="text-2xl text-red-600 font-bold">{error}</p>

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
      fetchBlogs(id)
    } catch (error) {
      console.log('error while deleting the blog', error)
    }
  }

  return (
    <div className="relative w-full min-h-[100svh] pb-20 focus:outline-none">
      <div
        className={
          isLoading
            ? 'hidden'
            : 'w-full grid gap-10 xxs:grid-cols-1 md:grid-cols-2 xl:grid-cols-4'
        }
      >
        {isLoading && <LoadingSpinner />}
        {blogs.map((blog) => (
          <div
            key={blog.id}
            className="relative group overflow-hidden text-black bg-gray-300 min-h-[40svh] rounded-xl"
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
            <div className="p-4 h-full">
              <p className="text-2xl font-bold text-black">
                {blog.title.substring(0, 12) + '...'}
              </p>

              <p className="text-md">
                Kreirano: {formatDate(blog.date_created)}
              </p>
              <div className="w-full flex flex-col gap-2 overflow-hidden">
                <Link
                  href={`/dashboard/blog/${blog.slug}`}
                  className="text-white text-2xl w-full font-bold btn btn-info"
                >
                  Pročitaj
                </Link>
                <button
                  onClick={async () => {
                    const response = await deleteBlog(blog.id)
                    window.location.reload()
                  }}
                  className="text-white text-2xl w-full font-bold btn btn-error"
                >
                  Obriši
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="absolute bottom-0 left-0 w-full flex items-center justify-center">
        <button
          className="btn btn-secondary  disabled:text-black disabled:bg-pink-200 text-black text-md"
          onClick={() => handlePageChange(page - 1)}
          disabled={page <= 1}
        >
          Prethodna
        </button>
        <span className="text-black text-sm px-4">
          {' '}
          Stranica {page} od {totalPages}{' '}
        </span>
        <button
          className="btn btn-primary text-black disabled:text-black disabled:bg-pink-200 text-md"
          onClick={() => handlePageChange(page + 1)}
          disabled={page >= totalPages}
        >
          Sljedeća
        </button>
      </div>
    </div>
  )
}

export default BlogList
