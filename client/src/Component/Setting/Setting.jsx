import React, {useState} from 'react';
import {Button, Input, message, Modal} from "antd";
import {SettingOutlined} from "@ant-design/icons";
import axios from "axios";
import {url} from "../../Config.jsx";

const Setting = () => {
    const [open, setOpen] = useState(false);
    const [username, setUsername] = useState(null);
    const [password, setPassword] = useState(null);

    const showModalEdit = async () => {
        setOpen(!open);
    };

    const changeAdminData = async () => {

        const {data} = await axios.post(
            `${url}/api/v1/updatedAdminData`,
            {username,password},
            {withCredentials: true}
        );

        if (data.success) {
            setOpen(!open);
            setUsername("")
            setPassword("")
            message.success(data.message)
        } else{
            message.warning(data.message)
        }
    };

    return (
        <>
            <SettingOutlined onClick={()=>showModalEdit(!open)}/>
            <Modal
                title={`Зміна даних авторизації`}
                open={open}
                key='ok1'
                closable={false}
                footer={[<Button key="disabled" className="button_continue" onClick={()=>showModalEdit()}>
                    Закрити
                </Button>,
                    <Button key="save" className="button_continue" onClick={()=>changeAdminData()}>
                        Змінити
                    </Button>
                ]}
            >
                <form>
                    <div className="mb-3" style={{marginBottom:'10px'}}>
                        <label htmlFor="email" className="form-label">Username</label>
                        <Input type="email" value={username} onChange={(e) => { setUsername(e.target.value) }} className="form-control" id="email"/>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="password" className="form-label">Password</label>
                        <Input type="password" value={password} onChange={(e) => { setPassword(e.target.value) }} className="form-control" id="password"/>
                    </div>
                </form>
            </Modal>
        </>
    );
};

export default Setting;