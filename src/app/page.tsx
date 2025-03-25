'use client'
import { useRouter } from 'next/navigation'
import React from 'react'

function Page() {

  const router = useRouter()

  React.useEffect(() => {
    router.push('/leaderboard')
  }, [])

  return (
    <div>page</div>
  )
}

export default Page