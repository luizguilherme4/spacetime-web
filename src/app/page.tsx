import { EmptyMemories } from '@/components/EmptyMemories'
import { api } from '@/lib/api'
import { cookies } from 'next/headers'
import dayjs from 'dayjs'
import ptBr from 'dayjs/locale/pt-br'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, Edit } from 'lucide-react'
import { DeleteButton } from '@/components/DeleteButton'

dayjs.locale(ptBr)

interface Memory {
  coverUrl: string
  excerpt: string
  id: string
  createAt: string
}

export default async function Home() {
  const isAuthenticated = cookies().has('token')

  if (!isAuthenticated) {
    return <EmptyMemories />
  }

  const token = cookies().get('token')?.value
  const response = await api.get('/memories', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  const memories: Memory[] = response.data

  const handleDeleteMemory = async (id: string) => {
    'use server'

    await api
      .delete(`/memories/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .catch((error) => console.log(error))
  }

  return (
    <div className="flex flex-col gap-10 p-8">
      {memories.map((memory) => {
        return (
          <div key={memory.id} className="space-y-4">
            <time className="tezt-gray-100 -ml-8 flex items-center gap-2 text-sm before:h-px before:w-5 before:bg-gray-50">
              {dayjs(memory.createAt).format('D[ de ]MMMM[, ]YYYY')}
            </time>
            <Image
              src={memory.coverUrl}
              width={592}
              height={280}
              alt=""
              className="aspect-video w-full rounded-lg object-cover"
            />

            <p className="text-lg leading-relaxed text-gray-100">
              {memory.excerpt}
            </p>

            <div className="flex items-center justify-between">
              <Link
                href={`/memories/${memory.id}`}
                className="flex items-center gap-2 text-sm text-gray-100 hover:text-gray-200"
              >
                Ler mais
                <ArrowRight className="h-4 w-4" />
              </Link>

              <div className="flex gap-8">
                <Link
                  href={`/memories/edit/${memory.id}`}
                  className="flex cursor-pointer items-center gap-1.5 text-sm text-gray-100 hover:text-green-500"
                >
                  <Edit className="h-4 w-4" />
                  Editar
                </Link>

                <DeleteButton
                  deleteMemory={handleDeleteMemory}
                  id={memory.id}
                />
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
