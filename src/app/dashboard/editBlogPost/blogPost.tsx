"use client"
import React,{ChangeEvent, useState, useEffect} from 'react';
import MyRichTextEditor from './TextEditor';
import { updateDoc,doc, getDoc } from 'firebase/firestore';
import { db } from '@/app/FirebaseConfig';
import {storage} from '@/app/FirebaseConfig'
import {ref, uploadBytes, getDownloadURL} from "firebase/storage"
import { TbCameraPlus } from "react-icons/tb";
import { useParams } from 'next/navigation';
import Image from 'next/image';
import { useRouter } from 'next/navigation'
import { FaArrowAltCircleLeft } from "react-icons/fa";
import Link from 'next/link';

const BlogPost = ({id}:any) => {
  
  const router = useRouter();
  const [title,setTitle] = useState("");
  const [option, setOption] = useState("blog");
  const [text, setText] = useState("");
  const [event, setEvent] = useState(false);
  const [date, setDate] = useState("");
  const [image,setImage] = useState<File | null>(null);
  const [location, setLocation] = useState("");
  const [formattedDate, setFormattedDate] = useState('');
  const [error, setError] = useState(false);
  const [time,setTime] = useState("")
  const [imageURL, setImageURL] = useState("");


  //Date formatter currently not needed for blogs
  const formatDate = (e:any) => {
    const rawDateValue = e.target.value;
    const parsedDate = new Date(rawDateValue);
    const formattedDate = `${String(parsedDate.getDate()).padStart(2, '0')}/${String(parsedDate.getMonth() + 1).padStart(2, '0')}/${parsedDate.getFullYear().toString().slice(-2)}`;
    setFormattedDate(formattedDate);
  };

  const updateParentState =(newValue: any) =>{
    setText(newValue);
  }


  const uploadImage = (e: ChangeEvent<HTMLInputElement>) =>{
    if(e.target.files && e.target.files[0]){
      setImage(e.target.files[0])
    } else {
      console.log("error upload image")
    }
  }


  const handleUploadImage = async ()=>{
      try{
      if(image){
      const storageRef = ref(storage, `images/${image.name}`)
      await uploadBytes(storageRef, image);
      console.log(`Upload is done`);
      const downloadURL = await getDownloadURL(storageRef)
      setImageURL(downloadURL)
      const submit = await editPostData(title, text, option,formattedDate, location, time, downloadURL);
      console.log("sucessfully created new data");
        } else {
          const submit = await editPostData(title, text, option,formattedDate, location, time, imageURL);
      }
      } catch (error){
        console.log("error in handleUploadImage", error)
      }
    }



  const handleSubmit = async (e: any) =>{
    e.preventDefault();
    try{
      const imageUpload = await handleUploadImage();
      console.log("sucess in handleSubmit");
   } catch(error){
    console.log("ERROR in handleSubmit", error);
  }
}


const editPostData = async (title: any, description: any, option: any, date: any, time: any, location: any, imageUrl: string) => {
  const docRef = doc(db, "blog", String(id));

  try {
    const docUpdate = await updateDoc(docRef, {
      title: title,
      description: description,
      type: option,
      date: date,
      time: time,
      location: location,
      imageURL: imageUrl
    });
    console.log("Hello" + docUpdate)
    console.log('Success updating blog data', docUpdate); // Log docUpdate here
    router.push('/dashboard/blog');
  } catch (error) {
    console.error("Error updating blog data: ", error);
  }
  
}


useEffect(()=> {
  const getBlogData = async () => {
    try {
      const docRef = doc(db, "blog",  String(id)); // Assuming params.blogId holds the ID of the blog post
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        setText(data.description);
        setImageURL(data.imageURL);
        setTitle(data.title);
        setOption(data.type);
        setLocation(data.location)
        setTime(data.time)
      } else {
        console.log("No such document exists!");
      }
    } catch (error) {
      console.error("Error fetching blog data:", error);
    }
  };

  getBlogData();
},[])

  return (
    <div className='w-full h-screen overflow-y-scroll
    xxs:p-1 md:p-10'>
      <Link href="/dashboard/blog" className='cursor-pointer text-4xl'>
        <FaArrowAltCircleLeft className='text-[#F93EDF]' />
        </Link>
      <h1 className='text-4xl'>Uredi objavu</h1>

      <form onSubmit={handleSubmit}  className='flex flex-col justify-start items-start mt-10 min-h-screen'>

        <p className='text-xl'>Promijenite naslovnu sliku</p>
        <div className='w-32'> 
          <Image className='w-full' src={imageURL} width={800} height={800} alt="image upload"/>
        </div>
        <label className='mt-5 w-[50%] cursor-pointer rounded-full bg-white text-[#C86DD7] border-[2px] border-[#F93EDF]
           xxs:text-sm xxs:p-2 xxs:w-full sm:p-7 sm:text-xl sm:py-3 lg:w-[80%] xl:w-[50%]'>
         {image==null ? (<TbCameraPlus className='mx-auto' />) : image.name}
        <input 
        type="file" 
        accept='image/png, image/jpg, image/jpeg'
        onChange={(e:any)=> uploadImage(e)}
        className='hidden'
        />
        </label>
        <p className={error ? "block font-bold text-lg text-red-500" : "hidden"}>**Morate unijeti sliku</p>
          
        <p className='text-xl mt-5'>Naslov objave</p>
        <input 
        type="text" 
        required 
        placeholder='Unesite Vaš naslov' 
        value={title}
        className='w-[50%] mt-5 text-[#C86DD7] text-xl rounded-full outline-none
        hover:outline-1 hover:outline-[#F93EDF] focus:outline-[#AC009B]
        xxs:text-sm xxs:p-2 xxs:w-full sm:p-7 sm:text-xl sm:py-3 lg:w-[80%] xl:w-[50%]'
        onChange={(e)=>setTitle(e.target.value)}
        />
        <br />

        <p className='text-xl mb-5 mt-5'>Tekst objave</p>
        
      <MyRichTextEditor onTextChange={updateParentState} description={text}/>
 
    {/* za testiranje teksta nakon upisivanja u editor<p
      dangerouslySetInnerHTML={{__html: text }} 
      className='w-[50%] min-h-[50vh] text-lg'>
      </p>
  */}

          <button className='px-8 bg-[#F93EDF] mt-5 text-white border-[2px] border-[#F93EDF] rounded-full py-1
                       hover:bg-transparent hover:border-[#F93EDF] hover:font-bold hover:text-[#F93EDF]
                       xxs:text-sm sm:text-lg'
                       type='submit'
                       >
                        Izmjeni objavu
              </button>

      </form>
      </div>
     
  )
}

export default BlogPost;