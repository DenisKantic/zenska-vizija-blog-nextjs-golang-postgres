"use client"
import React,{useEffect, useState} from 'react'
import Home from './home/Home'
import Spinner from './Spinner'

const Page = () => {

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1200); // Display spinner for 2 seconds

    return () => clearTimeout(timer);
  }, []);

  return (
    <div>
      {isLoading ? (<Spinner />) : 
      (
      <Home />
      )
      }
    </div>
  )
}

export default Page