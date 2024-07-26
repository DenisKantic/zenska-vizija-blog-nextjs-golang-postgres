'use client'
import React, { useState, useEffect } from 'react'
import MyRichTextEditor from './TextEditor'
import { useRouter } from 'next/navigation'
import { useTransition } from 'react'
import Image from 'next/image'
import { SaveBlogToDB } from '../../../../actions/saveBlogData'

const CreatePost = () => {
  const [title, setTitle] = useState('')
  const [text, setText] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [previewUrls, setPreviewUrls] = useState<string[]>([])
  const [visible, setVisible] = useState<boolean>(false)
  const [inputKey, setInputKey] = useState<number>(0) // Add key state to force input re-render
  const [fileName, setFileName] = useState<string | null>(null) // State to store file name
  const router = useRouter() // Initialize the router
  const [isPending, startTransition] = useTransition() // loading state

  const updateParentState = (newValue: any) => {
    setText(newValue)
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const files = Array.from(event.target.files)
      const totalFiles = selectedFiles.length + files.length
      setVisible(true)

      if (totalFiles > 5) {
        setError('Možete objaviti samo 5 slika.')
        return
      } else {
        setError(null)
      }

      const newFiles = files.slice(0, 3 - selectedFiles.length)
      setSelectedFiles((prevFiles) => [...prevFiles, ...newFiles])

      // Generate preview URLs
      const urls = newFiles.map((file) => URL.createObjectURL(file))
      setPreviewUrls((prevUrls) => [...prevUrls, ...urls])
    }
  }

  // Clean up object URLs to avoid memory leaks
  useEffect(() => {
    return () => {
      previewUrls.forEach((url) => URL.revokeObjectURL(url))
    }
  }, [previewUrls])

  // const handleRemoveImage = (index: number) => {
  //   // Remove the file and preview URL at the given index
  //   const updatedFiles = selectedFiles.filter((_, i) => i !== index)
  //   const updatedUrls = previewUrls.filter((_, i) => i !== index)

  //   setSelectedFiles(updatedFiles)
  //   setPreviewUrls(updatedUrls)
  // }

  // Clean up object URLs to avoid memory leaks
  useEffect(() => {
    return () => {
      previewUrls.forEach((url) => URL.revokeObjectURL(url))
    }
  }, [previewUrls])

  const handleRemoveImage = () => {
    // Clear the file and preview URL
    setSelectedFiles([])
    setPreviewUrls([])
    setError(null) // Clear any previous error
    setVisible(false)
    setFileName(null) // Clear file name
    setInputKey((prevKey) => prevKey + 1) // Force input re-render by changing key
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const formElement = e?.target as HTMLFormElement
    if (formElement) {
      const formData = new FormData(formElement)
      const response = await SaveBlogToDB(formData, text)
    }
  }

  return (
    <div
      className="w-full h-full overflow-y-scroll 
                    xxs:p-1 md:p-10"
    >
      <h1 className="text-4xl">Kreiraj objavu</h1>

      <form
        onSubmit={handleSubmit}
        className="flex flex-col justify-start items-start mt-10 min-h-screen"
      >
        <p className="text-xl mt-5">Naslov objave</p>
        <input
          type="text"
          name="title"
          required
          placeholder="Unesite Vaš naslov"
          className="mt-5 text-[#C86DD7] text-xl rounded-full outline-none
          hover:outline-1 hover:outline-[#F93EDF] focus:outline-[#AC009B]
          xxs:text-sm xxs:p-2 xxs:w-full sm:p-7 sm:text-xl sm:py-3 lg:w-[80%] xl:w-[50%]"
          onChange={(e) => setTitle(e.target.value)}
        />
        <br />

        <p className="text-xl">Ubacite sliku</p>

        <div
          className="mt-5 cursor-pointer rounded-full bg-white text-[#C86DD7] border-[2px] border-[#F93EDF]
          xxs:text-sm xxs:p-2 xxs:w-full sm:p-7 sm:text-xl sm:py-3 lg:w-[80%] xl:w-[50%]"
        >
          <label
            htmlFor="fileUpload"
            className="w-full cursor-pointer flex items-center justify-center"
          >
            <p className="w-full text-lg">
              {fileName ? fileName : 'Izaberite fotografiju'}
            </p>
          </label>
          <input
            key={inputKey}
            multiple
            type="file"
            id="fileUpload"
            name="images"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
        </div>
        {error && <p className="text-red-600 py-3">{error}</p>}

        <div
          className={
            visible
              ? 'flex gap-5 mt-4 w-full border-dashed border-4 border-gray-400 z-2'
              : 'hidden'
          }
        >
          {previewUrls.map((url, index) => (
            <div key={index} className="relative m-2 w-full">
              <Image
                height={200}
                width={200}
                key={index}
                src={url}
                alt={`Preview ${index}`}
                className="h-[50vh] w-full object-contain z-2 m-2"
              />
              <button
                type="button"
                onChange={handleRemoveImage}
                className="absolute top-0 bg-red-600 right-0 text-white rounded-full w-10 h-10 flex items-center justify-center
                            hover:bg-red-300 hover:text-black"
              >
                <p className="text-2xl w-full font-bold">&times;</p>
              </button>
            </div>
          ))}
        </div>

        <p className="text-xl mb-5 mt-5">Tekst objave</p>

        <MyRichTextEditor onTextChange={updateParentState} />

        {/* za testiranje teksta nakon upisivanja u editor<p
      dangerouslySetInnerHTML={{__html: text }} 
      className='w-[50%] min-h-[50vh] text-lg'>
      </p>
  */}

        <button
          className="bg-[#F93EDF] mt-5 text-white border-[2px] border-[#F93EDF] rounded-full py-1
                       hover:bg-transparent hover:border-[#F93EDF] hover:font-bold hover:text-[#F93EDF]
                       xxs:text-sm xxs:w-full md:w-[200px] sm:text-lg"
          type="submit"
        >
          Kreiraj objavu
        </button>
      </form>
    </div>
  )
}

export default CreatePost
