import React, { Suspense } from "react";
import CreateGroup from "../../_components/CraeteGroup";
import GroupComponent from "../_components/GroupComponent";
import Loader from "../../_components/Loader";

const page = () => {
  return (
    <Suspense fallback={<Loader />}>
      <div className="flex bg-gray-50 w-full h-full justify-center items-center dark:bg-[#0d0d0d] dark:text-white">
        <div className="sm:hidden block  h-full">
          <GroupComponent hide={true} />
        </div>
        <div className="sm:block hidden h-full">

          <GroupComponent />
        </div>
        <div className="w-full h-full flex justify-center items-center">
          <CreateGroup />
        </div>

      </div>
    </Suspense>
  );
};

export default page;
