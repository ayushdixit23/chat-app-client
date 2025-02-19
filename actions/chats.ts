"use server"

import { API } from "@/app/utils/constants"
import { auth } from "@/auth"
import axios from "axios"

export const getAllChats = async () => {
    const data = await auth()
    try {
        const res = await axios.get(`${API}/chats/getallchats`, {
            headers: {
                Authorization: `Bearer ${data?.user.accessToken}`
            }
        })
        return res.data
    } catch (error) {
        console.log(error)
    }
}