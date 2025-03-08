import React from 'react'
import NoChats from '../_components/NoChats'
import PrivateChat from '../_components/PrivateChat'

const Page = async ({
    searchParams,
}: {
    searchParams?: { id?: string;[key: string]: string | string[] | undefined };
}) => {
    const currSearchParams = await searchParams;
    return (
        <>
            {currSearchParams?.id ? (
                <PrivateChat id={currSearchParams?.id} />
            ) : (
                <NoChats />
            )}
        </>
    )
}

export default Page