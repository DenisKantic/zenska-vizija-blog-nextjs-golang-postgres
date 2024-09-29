'use server'

export async function SaveEventToDB(formData: FormData, description: string) {
  const images = formData.getAll('images')
  const eventTitle = formData.get('eventTitle')?.toString() || ' '
  const time = formData.get('time')?.toString() || ''
  const location = formData.get('location')?.toString() || ''

  const formDataToSend = new FormData()

  formDataToSend.append('eventTitle', eventTitle)
  formDataToSend.append('time', time)
  formDataToSend.append('location', location)
  formDataToSend.append('description', description)

  if (images.length === 0) {
    return {
      success: false,
    }
  }

  // Append all images with the same key 'images'
  images.forEach((image) => {
    if (images.length == 0) {
      return {
        success: false,
      }
    } else {
      formDataToSend.append('images', image)
    }
  })

  try {
    const response = await fetch('http://localhost:8080/createEvent', {
      method: 'POST',
      body: formDataToSend,
    })
    console.log('FORM FILES FOR API', formDataToSend)

    // Try to parse response as JSON
    const contentType = response.headers.get('Content-Type')
    if (contentType && contentType.includes('application/json')) {
      const result = await response.json()
      console.log('RESULT:', result)
      return {
        success: true,
      }
    } else {
      const text = await response.text()
      console.log('Non-JSON response:', text)
      return {
        success: false,
      }
    }
  } catch (error) {
    console.log('Error:', error)
    return {
      success: false,
    }
  }
}
