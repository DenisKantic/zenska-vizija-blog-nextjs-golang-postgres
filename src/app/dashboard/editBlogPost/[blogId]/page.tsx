
import React,{ChangeEvent, useState, useEffect} from 'react';
import { getDoc, getDocs, collection,query, orderBy, deleteDoc, doc } from 'firebase/firestore';
import BlogPost from '../blogPost';
import { db } from '@/app/FirebaseConfig';

interface BlogItem {
  id: string;
  title: string;
  description: string// Add any other properties you expect in your blog items
}

type Props = {
  params: {
      blogId: string
  }
}

export async function generateStaticParams() {
  const listCollection = collection(db, "blog");
  const querySnapshot = await getDocs(query(listCollection, orderBy("title", "desc")));
  const list: BlogItem[] = [];

querySnapshot.forEach((doc) => {
  const newList = doc.data();
  list.push({ id: doc.id, ...newList } as BlogItem);
});
 
  return list.map((post: any) => ({
    blogId: post.id,
  }))
}


const EditBlogPost = ({ params: { blogId }}: Props) => {
  

  return (
    <BlogPost id={blogId}/>
  )
}

export default EditBlogPost;