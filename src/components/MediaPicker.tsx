'use client'

import { ChangeEvent, useState } from 'react'

interface MediaProps {
  changeImage?: (image: File) => void
  cover?: string
}

export function MediaPicker({ changeImage, cover }: MediaProps) {
  const [preview, setPreview] = useState<string | undefined>(cover)

  function onFileSelected(event: ChangeEvent<HTMLInputElement>) {
    const { files } = event.target

    if (!files) {
      return
    }

    const previewURL = URL.createObjectURL(files[0])

    setPreview(previewURL)
    changeImage && changeImage(files[0])
  }

  return (
    <>
      <input
        onChange={onFileSelected}
        type="file"
        name="coverUrl"
        id="media"
        accept="image/*"
        className="invisible h-0 w-0"
      />

      {preview && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={preview}
          alt=""
          className="aspect-square w-full rounded-lg object-cover"
        />
      )}
    </>
  )
}
