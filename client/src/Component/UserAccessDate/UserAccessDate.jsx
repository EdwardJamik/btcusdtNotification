import React, {useEffect, useState} from 'react';
import {DatePicker, message} from "antd";
import dayjs from "dayjs";
import axios from "axios";
import {url} from "../../Config.jsx";

const UserAccessDate = ({chat_id,date}) => {
    const [isDate, setDate] = useState('');

    useEffect(() => {
        setDate(dayjs(date))
    }, [date]);

    const handleDateChange = async (date) => {
        const formatDate = dayjs(date).format()

        const {data} = await axios.post(
            `${url}/api/v1/updatedAccess`,
            {access_time:formatDate,access:true,chat_id},
            {withCredentials: true}
        );

        if (data.success) {
            message.success(data.message)
            setDate(date)
        }
    };

    const disabledDate = (current) => {
        return current && current.isBefore(dayjs(), 'day');
    };

    const disabledHours = () => {
        const currentHour = dayjs().hour();
        return Array.from({ length: currentHour }, (_, i) => i);
    };

    const disabledMinutes = () => {
        let minutes = [];
        for (let i = 1; i < 60; i++) {
            minutes.push(i);
        }
        return minutes;
    };

    return (
        <div style={{marginTop:'6px',width:'100%'}}>
            <DatePicker
                value={isDate}
                showTime={{
                    format: 'HH:00',
                    disabledHours: disabledHours,
                    disabledMinutes: disabledMinutes
                }}
                changeOnBlur={true}
                format="DD.MM.YYYY HH:00"
                onChange={handleDateChange}
                disabledDate={disabledDate}
                style={{width:'100%',maxWidth:'200px'}}
            />
        </div>
    );
};

export default UserAccessDate;