import React from 'react';
import {Button, message} from "antd";
import axios from "axios";
import {url} from "../../Config.jsx";

const DisableAccess = ({chat_id}) => {

    const handleAccessChange = async (chat_id) => {

        const {data} = await axios.post(
            `${url}/api/v1/updatedAccess`,
            {access:false,chat_id},
            {withCredentials: true}
        );

        if (data.success) {
            message.success(data.message)
        }
    };

    return (
        <div style={{marginTop: '6px'}}>
            <Button danger style={{width:'100%',maxWidth:'200px'}} onClick={()=>handleAccessChange(chat_id)}>Вимкнути</Button>
        </div>
    );
};

export default DisableAccess;