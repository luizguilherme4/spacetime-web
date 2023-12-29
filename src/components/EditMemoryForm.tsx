'use client'

import { Camera } from 'lucide-react'
import { MediaPicker } from './MediaPicker'
import Cookie from 'js-cookie'
import { FormEvent, useState } from 'react'
import { api } from '@/lib/api'
import { useRouter } from 'next/navigation'
import { UniqueMemory } from '@/app/memories/edit/[editMemory]/page'

export function EditMemoryForm({
  id,
  userId,
  coverUrl,
  content,
  isPublic,
  createAt,
}: UniqueMemory) {
  const router = useRouter()

  const [memory, setMemory] = useState<any>({
    coverUrl,
    content,
    isPublic,
  })

  function handleChangeCoverUrl(image: File) {
    setMemory((prevMemory: any) => ({
      ...prevMemory,
      coverUrl: image,
    }))
  }

  async function handleCreateMemory(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const fileToUpload = memory?.coverUrl

    let newCoverUrl = ''

    if (fileToUpload !== coverUrl) {
      const uploadFormData = new FormData()
      uploadFormData.set('file', fileToUpload)

      const uploadResponse = await api.post('/upload', uploadFormData)

      newCoverUrl = uploadResponse.data.fileUrl
    } else {
      newCoverUrl = fileToUpload
    }

    const token = Cookie.get('token')

    await api.put(
      `/memories/${id}`,
      {
        coverUrl: newCoverUrl,
        content: memory?.content,
        isPublic: memory?.isPublic,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    )

    router.push('/')
    router.refresh()
  }

  return (
    <form onSubmit={handleCreateMemory} className="flex flex-1 flex-col gap-2">
      <div className="flex items-center gap-4">
        <label
          htmlFor="media"
          className="flex cursor-pointer items-center gap-1.5 text-sm text-gray-200 hover:text-gray-100"
        >
          <Camera className="h-4 w-4" />
          Alterar mídia
        </label>

        <label
          htmlFor="isPublic"
          className="flex items-center gap-1.5 text-sm  text-gray-200 hover:text-gray-100"
        >
          <input
            type="checkbox"
            name="isPublic"
            id="isPublic"
            checked={memory?.isPublic}
            onChange={(e) =>
              setMemory((prevMemory: any) => ({
                ...prevMemory,
                isPublic: e.target.checked,
              }))
            }
            className="h-4 w-4 rounded border-gray-400 bg-gray-700 text-purple-500"
          />
          Memória pública
        </label>
      </div>

      <MediaPicker cover={coverUrl} changeImage={handleChangeCoverUrl} />

      <textarea
        name="content"
        value={memory?.content}
        onChange={(e) =>
          setMemory((prevMemory: any) => ({
            ...prevMemory,
            content: e.target.value,
          }))
        }
        spellCheck={false}
        rows={4}
        maxLength={700}
        className="w-full flex-1 resize-none overflow-y-hidden rounded border-0 bg-transparent p-0 text-lg leading-relaxed text-gray-100 placeholder:text-gray-400 focus:ring-0"
        placeholder="Fique livre para adicionar fotos, vídeos e relatos sobre essa experiência que você quer lembrar para sempre"
      />

      <button
        type="submit"
        className="inline-block self-end rounded-full bg-green-500 px-5 py-3 font-alt text-sm uppercase leading-none text-black hover:bg-green-600"
      >
        Salvar
      </button>
    </form>
  )
}
