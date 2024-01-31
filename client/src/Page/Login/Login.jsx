import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {Button, message, Form, Input, Row} from "antd";

import './login.scss'
import {url} from "../../Config";

const Login = () => {

    const navigate = useNavigate();

    const [inputValue, setInputValue] = useState({
        username: "",
        password: "",
    });
    const {username, password} = inputValue;
    const handleOnChange = (e) => {
        const {name, value} = e.target;
        setInputValue({
            ...inputValue,
            [name]: value,
        });
    };

    const warnings = (info) => {
        message.warning(info);
    };

    const handleSubmit = async () => {
        try {
            const {data} = await axios.post(
                `${url}/api/v1/login`,
                {
                    ...inputValue,
                },
                {withCredentials: true}
            );
            const {success, message} = data;
            if (success) {
                setTimeout(() => {
                    navigate("/");
                }, 1000);
            } else {
                warnings(message)
            }
        } catch (error) {
            console.error(error);
        }

    };

    return (
        <Row className='login_container' style={{flexDirection:'column'}}>
            <Form
                className='formLogin'
                name="basic"
                labelCol={{
                    span: 8,
                }}
                wrapperCol={{
                    span: 16,
                }}
                style={{
                    maxWidth: 600,
                }}
                initialValues={{
                    remember: true,
                }}
                onFinish={handleSubmit}
                onFinishFailed={handleSubmit}
                onSubmit={handleSubmit}
                autoComplete="off"
            >


                <Form.Item
                    label="Логін"
                    name="username"
                >
                    <Input name="username" value={username} onChange={handleOnChange}/>
                </Form.Item>

                <Form.Item
                    label="Пароль"
                    name="password"
                >
                    <Input.Password name="password" value={password} onChange={handleOnChange}/>
                </Form.Item>

                <Form.Item
                    wrapperCol={{
                        offset: 8,
                        span: 16,
                    }}
                    // style={{width:'100%'}}
                >
                    <Button
                        // style={{margin:'0 auto', width:'100%'}}
                        type="primary" htmlType="submit" className='login_button'>
                        Login
                    </Button>
                </Form.Item>
            </Form>
        </Row>
    );
};

export default Login;
