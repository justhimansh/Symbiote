import React, { useEffect } from 'react';
import { useHistory } from 'react-router';

const Logout = () =>{
    const history = useHistory();

    const logout = async () => {
        try{
            const response = await fetch('/logout', {
                method : "GET",
                headers : {
                    Accept : "application/json",
                    "Content-type" : "application/json"
                },
                credentials: "include"
            });

            if(response.status === 401 || !response){
                window.alert("Please Logout Later");
            }else{
                history.push('/');
                window.location.reload()
            }
        }catch(error){
            console.log(error)
        }
    }

    useEffect(() => {
        logout();
    }, []);

    return (
        <div>

        </div>
    )
}

export default Logout;