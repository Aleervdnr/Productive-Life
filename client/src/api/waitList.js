import axios from "./axios"

export const addEmailWaitListRequest = (email) => 
    axios.post("/waitlist",email)
