import { createContext, useContext, useEffect, useState } from "react";

export const DateContext = createContext()

export const useDate = () => {
    const context = useContext(DateContext)
    if(!context){
        throw new Error("useDatenecesita ser usado dentro de DateProvider")
    }
    return context
}

export const DateProvider = ({children}) => {
    const [nowDateTime, setNowDateTime] = useState(new Date())

    useEffect(() => {
        const intervalDateTime = setInterval(() => setNowDateTime(new Date()), 1000);
    
      return () => {
        clearInterval(intervalDateTime)
      }
    }, [])
    
    return(
        <DateContext.Provider
            value={{nowDateTime}}    
        >
            {children}
        </DateContext.Provider>
    )
}