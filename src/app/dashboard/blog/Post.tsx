"use client";
import React, { useState, useEffect } from 'react'
import { getDocs, collection,query, orderBy, deleteDoc, doc } from 'firebase/firestore';
import { db } from '@/app/FirebaseConfig';
import Post from './interface'
import Image from 'next/image';

    async function fetchDataFirestore(){
        const listCollection = collection(db, "blog");
        const querySnapshot = await getDocs(query(listCollection, orderBy("title", "desc")))
        const list:any = [];
      
        querySnapshot.forEach((doc)=>{
          const newList = doc.data();
          list.push({id: doc.id, ...newList})
        })
        return list;
    }

    const UserDataFetcher: React.FC = () => {
    const [userData, setUserData] = useState<Post[]>([]);
    const [title, setTitle] = useState("");


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

    <div className='grid grid-cols-3 gap-20 grid-flow-row items-center mt-10 w-full h-full'>
        {userData.map((data)=>(
        <div className='flex flex-col justify-around w-[300px] h-[350px] bg-red-200' key={data.id}>
            <div className='h-full p-2'>
                <Image src="/images/zenskaBG.png" height={50} width={50}
                alt='test' unoptimized
                className='w-full h-[200px] object-contain'
                />
                <h1 className='text-lg'>Naslov:{data.title}</h1>
                <p className='text-sm'>ID: {data.id}</p>
                <p>Date: {data.date}</p>
             </div>
        <button 
        className='w-full bg-orange-400 py-3'
        onClick={()=>deleteFromDatabase(data.id)}
        >Obrisi</button>
        </div>
        ))}
    </div>
  )
 }

export default UserDataFetcher;