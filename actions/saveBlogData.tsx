'use server'

export async function SaveBlogToDB(formData: FormData, description: string) {
  const images = formData.getAll('images')
  const title = formData.get('title')?.toString()

  console.log(images, title, description)

  const formDataToSend = new FormData()
  // Append all images with the same key 'images'
  images.forEach((image) => {
    formDataToSend.append('images', image)
  })

  try {
    const response = await fetch('http://localhost:8080/uploadImages', {
      method: 'POST',
      body: formDataToSend,
    })

    // Try to parse response as JSON
    const contentType = response.headers.get('Content-Type')
    if (contentType && contentType.includes('application/json')) {
      const result = await response.json()
      console.log('RESULT:', result)
    } else {
      const text = await response.text()
      console.error('Non-JSON response:', text)
    }
  } catch (error) {
    console.error('Error:', error)
  }
}
