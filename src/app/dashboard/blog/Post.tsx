"use client";
import React, { useState, useEffect } from 'react'
import { getDocs, collection,query, orderBy, deleteDoc, doc } from 'firebase/firestore';
import { db } from '@/app/FirebaseConfig';
import Post from './interface'
import Image from 'next/image';
import { RiDeleteBinLine } from "react-icons/ri";
import { FaEdit } from "react-icons/fa";
import { useRouter } from 'next/navigation';
import ReactPaginate from 'react-paginate'
import { AiFillLeftCircle, AiFillRightCircle } from "react-icons/ai";
import { IconContext } from "react-icons";
async function fetchDataFirestore(){
  const listCollection = collection(db, "blog");
  const querySnapshot = await getDocs(query(listCollection, orderBy("dateCreated", "desc")))
  const list:any = [];
      
  querySnapshot.forEach((doc)=>{
    const newList = doc.data();
    list.push({id: doc.id, ...newList})
  })

  return list;
}

const UserDataFetcher: React.FC = () => {
  const [userData, setUserData] = useState<Post[]>([]);
  const router = useRouter()
  const items = userData;

  const [itemOffset, setItemOffset] = useState(0);
  const itemsPerPage = 6;

  const endOffset = itemOffset + itemsPerPage;
  const currentItems = items.slice(itemOffset, endOffset);
  const pageCount = Math.ceil(items.length / itemsPerPage);


  const handlePageClick = (event: any) => {
    const newOffset = (event.selected * itemsPerPage) % items.length;
    setItemOffset(newOffset);
  };


    useEffect(()=>{
        async function fetchData(){
          const data: Post[] = await fetchDataFirestore();
          setUserData(data);
        }
        fetchData();
    },[])

    async function deleteFromDatabase(id:any){
        try{
          await deleteDoc(doc(db, "blog", id));
          window.location.reload()
          return id;
        } catch (error){
          alert("error")
          console.log(error);
        }
      }
 
  return (
    <>
    <div className='grid items-center justify-center w-full h-full grid-flow-row auto-cols-max 
    xxs:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xxl:grid-cols-4 md:gap-10
    xxs:mt-0 md:mt-10'>
        {currentItems.map((data)=>(
         
        <div className='flex flex-col justify-around bg-red-100 mt-10' key={data.id}>
        <div className='h-full rounded-xl'>
            <Image src={data.imageURL} height={50} width={50}
            alt='test' unoptimized priority={false}
            className='w-full h-[230px] object-cover'
            />
            <div className='p-2 h-full overflow-hidden'>
            <h1 className='text-lg font-bold'>Naslov:<span className='font-normal ml-2'>{data.title.substring(0,15)}...</span></h1>
            <p className='text-md font-bold flex'>Tekst: <span className='font-normal ml-2' dangerouslySetInnerHTML={{__html: data.description.substring(0,20)}}>
            </span>...</p>
            <p  className='text-lg font-bold'>Kreirano: <span className='font-normal ml-2'>{data.dateCreated}</span></p>
            </div>
         </div>

          <div className='flex flex-row'>
              <button className='w-[50%] flex items-center justify-center bg-red-400 py-3 cursor-pointer
              hover:bg-red-600' type='button'
                onClick={()=>deleteFromDatabase(data.id)}
              >
                <RiDeleteBinLine />
              </button>

              <button className='w-[50%] flex items-center justify-center bg-blue-200 py-3 cursor-pointer
              hover:bg-blue-400' type='button'
                onClick={()=> router.push(`/dashboard/editBlogPost/${data.id}`)}
              ><FaEdit /></button>
          </div>
          </div>
        ))}
    </div>
    {
      items.length >= itemsPerPage ? <ReactPaginate
      breakLabel="..."
      pageClassName={"page-item"}
    activeClassName={"active"}
      onPageChange={handlePageClick}
      pageRangeDisplayed={5}
      pageCount={pageCount}
      previousLabel={
        <IconContext.Provider value={{ color: "#B8C1CC", size: "36px" }}>
          <AiFillLeftCircle />
        </IconContext.Provider>
      }
      nextLabel={
        <IconContext.Provider value={{ color: "#B8C1CC", size: "36px" }}>
          <AiFillRightCircle />
        </IconContext.Provider>
      }
      containerClassName={"pagination"}
      renderOnZeroPageCount={null}
    /> : null
    }
    
  </>
  )
 }

export default UserDataFetcher;