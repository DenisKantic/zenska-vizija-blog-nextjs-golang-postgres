import { getDoc, getDocs, collection,query, orderBy, } from 'firebase/firestore';
import { db } from '@/app/FirebaseConfig';
import EventPost from '../eventPost';


type Props = {
  params: {
      eventId: string
  }
}

export async function generateStaticParams() {
  const listCollection = collection(db, "event");
  const querySnapshot = await getDocs(query(listCollection, orderBy("title", "desc")))
  const list:any = [];
      
  querySnapshot.forEach((doc)=>{
    const newList = doc.data();
    list.push({id: doc.id, ...newList})
  })
 
  return list.map((post: any) => ({
    eventId: post.id,
  }))
}

const EditBlogPost = ({ params: { eventId }}: Props) => {
  
  return (
   <EventPost id={eventId}/>
     
  )
}

export default EditBlogPost;