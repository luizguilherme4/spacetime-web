import { api } from '@/lib/api'
import dayjs from 'dayjs'
import ptBr from 'dayjs/locale/pt-br'
import { ChevronLeft } from 'lucide-react'
import { cookies } from 'next/headers'
import Image from 'next/image'
import Link from 'next/link'

dayjs.locale(ptBr)

interface UniqueMemory {
  id: string
  userId: string
  coverUrl: string
  content: string
  isPublic: boolean
  createAt: string
}

export default async function ViewMemory({ params }: any) {
  const isAuthenticated = cookies().has('token')

  if (!isAuthenticated) {
    return
  }

  const token = cookies().get('token')?.value

  const response = await api
    .get(`/memories/${params?.viewMemory}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .catch((error) => console.log(error))

  const memory: UniqueMemory | undefined = response?.data

  return (
    <div className="flex flex-col gap-10 p-8">
      <Link
        href="/"
        className="flex items-center gap-1 text-sm text-gray-200 hover:text-gray-100"
      >
        <ChevronLeft className="h-4 w-4" />
        voltar à timeline
      </Link>

      {memory ? (
        <div key={memory.id} className="space-y-4">
          <time className="tezt-gray-100 -ml-8 flex items-center gap-2 text-sm before:h-px before:w-5 before:bg-gray-50">
            {dayjs(memory.createAt).format('D[ de ]MMMM[, ]YYYY')}
          </time>
          <Image
            src={memory.coverUrl}
            width={592}
            height={280}
            alt=""
            className="aspect-square w-full rounded-lg object-cover"
          />
          <p className="text-lg leading-relaxed text-gray-100">
            {memory.content}
          </p>
        </div>
      ) : (
        <h1>teste deu errado</h1>
      )}
    </div>
  )
}
