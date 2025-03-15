import React from 'react'
import NoChats from '../_components/NoChats'
import PrivateChat from '../_components/PrivateChat'
import GroupComponent from './_components/GroupComponent';

const Page = async ({
    searchParams,
}: {
    searchParams?: { id?: string;[key: string]: string | string[] | undefined };
}) => {
    const currSearchParams = await searchParams;
    return (
        <>
            <div className="flex w-full bg-gray-50 dark:bg-[#0d0d0d] dark:text-white">
                <GroupComponent id={currSearchParams?.id} />
                {currSearchParams?.id ? (
                    <PrivateChat id={currSearchParams?.id} />
                ) : (
                    <NoChats />
                )}
            </div>

        </>
    )
}

export default Page