import React, {useEffect, useState} from 'react';
import {useLocation, useNavigate} from "react-router-dom";
import {useCookies} from "react-cookie";
import axios from "axios";
import Topbar from "./Component/Topbar/Topbar";
import {url} from "./Config";

export const ProtectedRoute = ({element}) => {

    const [cookies, removeCookie] = useCookies([]);
    const navigate = useNavigate();

    const {pathname} = useLocation()

    const [isLoggedIn, setLoggedIn] = useState(false)

    useEffect(() => {
        const loggedIn = async () => {
            if (!cookies.token) {
                navigate("/login");
            } else {
                const {data} = await axios.post(
                    `${url}/api/v1/`,
                    {},
                    {withCredentials: true}
                );

                const {user, status} = data;
                if (user || status === true) {
                    setLoggedIn(true);
                } else if (status === false){
                    navigate("/login");
                }
            }
        };

        loggedIn();
    }, [navigate]);


    if(pathname.includes("/") && isLoggedIn ){
        return( <>
            <Topbar/>
            <div className="admin__container">
                {element}
            </div>
        </>)

    }

    if (isLoggedIn) {
        return element
    }
};