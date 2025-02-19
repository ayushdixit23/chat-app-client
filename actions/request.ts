"use server"
import { API } from "@/app/utils/constants"
import { auth } from "@/auth"
import axios from "axios"

export const fetchSuggestedUser = async () => {
    const data = await auth()
    try {
        const res = await axios.get(`${API}/chats/get-user-suggestion`, {
            headers: {
                "Authorization": `Bearer ${data?.user.accessToken}`
            }
        })
        console.log(`data fetched`)
        return res.data
    } catch (error) {
        console.log(error)
    }
}