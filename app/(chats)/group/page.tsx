import React from 'react'
import NoChats from '../_components/NoChats'
import PrivateChat from '../_components/PrivateChat'

const Page = async ({
    searchParams,
}: {
    searchParams?: { id?: string;[key: string]: string | string[] | undefined };
}) => {
    return (
        <>
            {searchParams?.id ? (
                <PrivateChat id={searchParams?.id} />
            ) : (
                <NoChats />
            )}
        </>
    )
}

export default Page