'use client'
import React, { ChangeEvent, useState } from 'react'
import MyRichTextEditor from './TextEditor'
import { TbCameraPlus } from 'react-icons/tb'
import { useRouter } from 'next/navigation'

const CreatePost = () => {
  const [title, setTitle] = useState('')
  const [text, setText] = useState('')
  const [image, setImage] = useState<File | null>(null)
  const [error, setError] = useState(false)

  const updateParentState = (newValue: any) => {
    setText(newValue)
  }

  const uploadImage = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0])
    } else {
      console.log('error upload image')
    }
  }

  const handleSubmit = async (e: any) => {
    e.preventDefault()
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
          required
          placeholder="Unesite Vaš naslov"
          className="mt-5 text-[#C86DD7] text-xl rounded-full outline-none
          hover:outline-1 hover:outline-[#F93EDF] focus:outline-[#AC009B]
          xxs:text-sm xxs:p-2 xxs:w-full sm:p-7 sm:text-xl sm:py-3 lg:w-[80%] xl:w-[50%]"
          onChange={(e) => setTitle(e.target.value)}
        />
        <br />

        <p className="text-xl">Ubacite sliku</p>
        <label
          className="mt-5 cursor-pointer rounded-full bg-white text-[#C86DD7] border-[2px] border-[#F93EDF]
          xxs:text-sm xxs:p-2 xxs:w-full sm:p-7 sm:text-xl sm:py-3 lg:w-[80%] xl:w-[50%]"
        >
          {image == null ? <TbCameraPlus className="mx-auto" /> : image.name}
          <input
            type="file"
            accept="image/png, image/jpg, image/jpeg"
            required
            onChange={(e: any) => uploadImage(e)}
            className="hidden"
          />
        </label>
        <p
          className={error ? 'block font-bold text-lg text-red-500' : 'hidden'}
        >
          **Morate unijeti sliku
        </p>

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
