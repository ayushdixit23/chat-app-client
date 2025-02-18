"use client"
import { logOut } from "@/actions/auth";
import axios from "axios";
import { useSession } from "next-auth/react";
import { API } from "./utils/constants";


export default function Home() {
  const session = useSession()

  const requestServer = async () => {
    try {
      const res = await axios.get(`${API}/auth/verify`, {
        headers: {
          "Authorization": `Bearer ${session.data?.user.accessToken}`
        }
      })

      console.log(res.data)
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <>
      {JSON.stringify(session.data?.user)}
      <button onClick={logOut} className="cursor-pointer">log out</button>
      <button onClick={requestServer}>Request Server</button>
    </>
  );
}