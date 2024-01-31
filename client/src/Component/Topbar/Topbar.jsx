import React from "react";
import "./topbar.scss";
import {
    PoweroffOutlined, SettingOutlined,
} from "@ant-design/icons";
import axios from "axios";
import {useNavigate} from "react-router-dom";
import {url} from "../../Config";
import Setting from "../Setting/Setting.jsx";

export default function Topbar() {
    const navigate = useNavigate();

    const Logout =  async () => {
        const {data} = await axios.post(
            `${url}/api/v1/logout`,
            {},
            {withCredentials: true}
        );
        if (data.success) {
            navigate('/login')
        }
    };

    return (
        <>
            <div className="topbar">
                <div className="topbarWrapper">

                    <div className="topLeft">
                        <span className="logo">Notification Dashboard</span>
                    </div>
                    <div className="topRight">
                        <div className="topbarIconContainer setting">
                            <Setting/>
                        </div>
                        <div className="topbarIconContainer">
                            <PoweroffOutlined onClick={Logout}/>
                        </div>
                    </div>
                </div>
            </div>

        </>
    )
}
