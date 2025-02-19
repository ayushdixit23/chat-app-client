"use client"
import { useSession } from 'next-auth/react'
import Image from 'next/image'
import React from 'react'

const UserImage = () => {
    const { data } = useSession()

    if (!data || !data.user) {
        return <></>
    }

    return (
        <Image src={data?.user.profilePic} alt={data?.user.fullName} width={50} height={50} className='w-full h-full object-cover' />
    )
}

export default UserImage