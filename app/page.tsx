"use client"
import { logOut } from "@/actions/auth";
import { useSession } from "next-auth/react";

export default function Home() {
  const { data } = useSession();

  return (
    <>
      {JSON.stringify(data?.user)}
      <button onClick={logOut} className="cursor-pointer">log out</button>
    </>
  );
}