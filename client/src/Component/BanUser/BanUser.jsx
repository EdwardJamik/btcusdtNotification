import React from 'react';
import {Button, message} from "antd";
import axios from "axios";
import {url} from "../../Config.jsx";

const BanUser = ({ban, chat_id}) => {

    const banUser = async (ban,chat_id) => {
        const {data} = await axios.post(
            `${url}/api/v1/banTgUser`,
            {ban,chat_id},
            {withCredentials: true}
        );

        if(data.success){
            message.success(data.message)
        }
    };

    return (
        <>
        <Button type='primary' danger={!ban} onClick={()=>banUser(!ban,chat_id)}>{ban ? 'UnBan' : 'Ban'}</Button>
        </>
    );
};

export default BanUser;