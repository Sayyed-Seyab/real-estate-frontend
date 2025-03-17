import { StoreContext } from '@/context/context';
import Loader from '@/widgets/loader/Loader';
import React, { useContext, useEffect, useState } from 'react'
import { Navigate, Outlet } from 'react-router-dom';


const  AuthProvider = () =>{
    const [loading, setloading] = useState(true);
    const {adminData} = useContext(StoreContext);
  
    
    useEffect(() => {
        // Simulating an async check, you can replace it with actual async operations if needed
        setTimeout(() => {
            setloading(false);
        }, 1000); // Adjust the delay as per your needs
          console.log(adminData)
    }, [adminData]);

        if(loading ){
            return   <div> <Loader/> </div>
        }

    
 
    return  adminData?.role === 'admin'? <Outlet/> : <Navigate to='/'/>
  
}
  

export default AuthProvider
