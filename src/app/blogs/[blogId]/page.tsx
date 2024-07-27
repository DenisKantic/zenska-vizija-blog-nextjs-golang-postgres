import {
  doc,
  getDoc,
  collection,
  getDocs,
  query,
  orderBy,
} from 'firebase/firestore'
import { db } from '@/app/FirebaseConfig'
import Blog from '../blog'

interface BlogItem {
  id: string
  title: string
  description: string // Add any other properties you expect in your blog items
}

type Props = {
  params: {
    blogId: string
  }
}

async function fetchDataFirestore(blogId: string) {
  const docRef = doc(db, 'blog', blogId)
  const docSnap = await getDoc(docRef)

  if (docSnap.exists()) {
    return docSnap.data()
  } else {
    return null
  }
}

export async function generateStaticParams() {
  const listCollection = collection(db, 'blog')
  const querySnapshot = await getDocs(
    query(listCollection, orderBy('title', 'desc'))
  )
  const list: BlogItem[] = []

  querySnapshot.forEach((doc) => {
    const newList = doc.data()
    list.push({ id: doc.id, ...newList } as BlogItem)
  })

  return list.map((post: any) => ({
    blogId: post.id,
  }))
}

export default function Blogs({ params: { blogId } }: Props) {
  const blog = fetchDataFirestore(blogId)

  return <Blog />
}
