import { EditMemoryForm } from '@/components/EditMemoryForm'
import { api } from '@/lib/api'
import dayjs from 'dayjs'
import ptBr from 'dayjs/locale/pt-br'
import { ChevronLeft } from 'lucide-react'
import { cookies } from 'next/headers'
import Link from 'next/link'

dayjs.locale(ptBr)

export interface UniqueMemory {
  id: string
  userId: string
  coverUrl: string
  content: string
  isPublic: boolean | any
  createAt: string
}

export default async function EditMemory({ params }: any) {
  const isAuthenticated = cookies().has('token')

  if (!isAuthenticated) {
    return
  }

  const token = cookies().get('token')?.value

  const response = await api
    .get(`/memories/${params?.editMemory}`, {
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
        <div key={memory.id} className="space-y-6">
          <time className="tezt-gray-100 -ml-8 flex items-center gap-2 text-sm before:h-px before:w-5 before:bg-gray-50">
            {dayjs(memory.createAt).format('D[ de ]MMMM[, ]YYYY')}
          </time>

          <EditMemoryForm {...memory} />
        </div>
      ) : (
        <h1>teste deu errado</h1>
      )}
    </div>
  )
}
