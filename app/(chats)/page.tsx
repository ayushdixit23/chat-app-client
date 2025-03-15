import React from "react";
import PrivateChat from "./_components/PrivateChat";
import ListChats from "./_components/ListChats";
import NoChats from "./_components/NoChats";
import ChatSearch from "./_components/ChatSearch";

const Page = async ({ searchParams }: { searchParams: Promise<{ id: string | undefined }> }) => {
  const currSearchParams = await searchParams;
  return (
    <div className="flex w-full bg-gray-50 dark:bg-[#0d0d0d] dark:text-white">

      {/* Users List */}

      {/* hide this for mobile device when there is id */}
      <div className={`${currSearchParams?.id ? "hidden sm:block" : ""} w-full sm:w-[350px] bg-white dark:bg-[#0d0d0d] dark:text-white border-r light:border-gray-200 flex flex-col`}>
        <div className="p-4 border-b light:border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold dark:text-white text-gray-800">
              Messages
            </h2>

          </div>
          <ChatSearch />
        </div>

        <ListChats searchParamsId={currSearchParams?.id as string} />
      </div>
      {/* hide this for mobile device */}

      {currSearchParams?.id ? (
        <PrivateChat id={currSearchParams?.id} />
      ) : (
        <NoChats />
      )}
    </div>
  );
}

export default Page;
