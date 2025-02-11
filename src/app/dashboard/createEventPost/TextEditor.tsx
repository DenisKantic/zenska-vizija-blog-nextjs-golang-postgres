// MyRichTextEditor.tsx
import React, { useState } from 'react'
import dynamic from 'next/dynamic'
import 'react-quill/dist/quill.snow.css' // Import the styles
import type { ReactQuillProps } from 'react-quill'

const QuillEditor = dynamic(() => import('react-quill'), { ssr: false })

interface MyRichTextEditorProps extends ReactQuillProps {
  onTextChange: (value: string) => void // Function to update parent state
}

const MyRichTextEditor: React.FC<MyRichTextEditorProps> = ({
  onTextChange,
  ...props
}) => {
  const [text, setText] = useState('')

  console.log(text)

  const handleChange = (value: string) => {
    setText(value)
    onTextChange(value)
  }

  return (
    <QuillEditor
      value={text}
      className="h-[45vh] bg-white overflow-hidden
                xxs:w-[95%]"
      onChange={handleChange}
      modules={{
        toolbar: [
          [{ color: ['blue', '#F93EDF', 'red', 'pink', 'black'] }],
          ['bold', 'italic', 'underline', 'strike'],
          ['link', 'image'],
          ['clean'],
        ],
      }}
      formats={[
        'strike',
        'bold',
        'italic',
        'underline',
        'link',
        'image',
        'color',
      ]}
      {...props}
    />
  )
}

export default MyRichTextEditor
