import React from 'react'

type Props = {
  params: string
}

export default function page({ params: title }: Props) {
  return (
    <div className="text-black bg-white h-screen justify-center items-center">
      <h1>This is test</h1>
    </div>
  )
}
