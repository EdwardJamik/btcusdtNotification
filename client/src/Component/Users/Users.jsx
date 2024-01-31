import React, {useEffect, useRef, useState} from 'react';
import {Button, Input, Space, Table, Tag} from 'antd';
import {url} from "../../Config.jsx";
import axios from "axios";
import Highlighter from "react-highlight-words";
import {SearchOutlined} from "@ant-design/icons";
import BanUser from "../BanUser/BanUser.jsx";
import UserAccessDate from "../UserAccessDate/UserAccessDate.jsx";
import DisableAccess from "../DisableAccess/DisableAccess.jsx";
import dayjs from "dayjs";

const Users = () => {

    const [isUser,setUser] = useState([])

    useEffect(() => {
        async function getUsers() {
            const {data} = await axios.get(`${url}/api/v1/userList/`);
            setUser(data);
        }
        getUsers()
    }, [isUser]);

    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const searchInput = useRef(null);
    const handleSearch = (selectedKeys, confirm, dataIndex) => {
        confirm();
        setSearchText(selectedKeys[0]);
        setSearchedColumn(dataIndex);
    };
    const handleReset = (clearFilters) => {
        clearFilters();
        setSearchText('');
    };

    const getColumnSearchProps = (dataIndex) => ({
        filterDropdown: ({setSelectedKeys, selectedKeys, confirm, clearFilters, close}) => (
            <div
                style={{
                    padding: 8,
                }}
                onKeyDown={(e) => e.stopPropagation()}
            >
                <Input
                    ref={searchInput}
                    placeholder={`Search ${dataIndex}`}
                    value={selectedKeys[0]}
                    onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                    onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
                    style={{
                        marginBottom: 8,
                        display: 'block',
                    }}
                />
                <Space>
                    <Button
                        type="primary"
                        onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
                        icon={<SearchOutlined/>}
                        size="small"
                        style={{
                            width: 90,
                        }}
                    >
                        Search
                    </Button>
                    <Button
                        onClick={() => clearFilters && handleReset(clearFilters)}
                        size="small"
                        style={{
                            width: 90,
                        }}
                    >
                        Reset
                    </Button>
                    <Button
                        type="link"
                        size="small"
                        onClick={() => {
                            confirm({
                                closeDropdown: false,
                            });
                            setSearchText(selectedKeys[0]);
                            setSearchedColumn(dataIndex);
                        }}
                    >
                        Filter
                    </Button>
                    <Button
                        type="link"
                        size="small"
                        onClick={() => {
                            close();
                        }}
                    >
                        close
                    </Button>
                </Space>
            </div>
        ),
        filterIcon: (filtered) => (
            <SearchOutlined
                style={{
                    color: filtered ? '#1677ff' : undefined,
                }}
            />
        ),
        onFilter: (value, record) =>
            record[dataIndex]?.toString()?.toLowerCase()?.includes(value?.toLowerCase()),
        onFilterDropdownOpenChange: (visible) => {
            if (visible) {
                setTimeout(() => searchInput.current?.select(), 100);
            }
        },
        render: (text) =>
            searchedColumn === dataIndex ? (
                <Highlighter
                    highlightStyle={{
                        backgroundColor: '#ffc069',
                        padding: 0,
                    }}
                    searchWords={[searchText]}
                    autoEscape
                    textToHighlight={text ? text.toString() : ''}
                />
            ) : (
                text
            ),
    });

    const columns = [
        {
            title: 'chatId',
            dataIndex: 'chat_id',
            key: 'chat_id',
            align:"center",
            ...getColumnSearchProps('chat_id')
        },
        {
            title: 'Username',
            dataIndex: 'username',
            key: 'username',
            align:"center",
            ...getColumnSearchProps('username'),
            render: (text) => <a href={`https://t.me/${text}`} target='_blank'>{text}</a>,
        },
        {
            title: 'First Name',
            dataIndex: 'first_name',
            key: 'first_name',
            align:"center",
            ...getColumnSearchProps('first_name')
        },
        {
            title: 'Приєднався',
            dataIndex: 'createdAt',
            key: 'createdAt',
            align:"center",
            sorter: (a, b) => a.createdAt - b.createdAt,
            render: (text) => dayjs(text).format('DD.MM.YYYY HH:MM'),
        },
        {
            title: 'Доступ',
            dataIndex: 'access',
            key: 'access',
            align:"center",
            sorter: (a, b) => a.access - b.access,
            render: (_, record) => (
                <>
                    {record.access ?
                        <>
                            <Tag style={{width:'100%',maxWidth:'190px', textAlign:'center', fontSize:'12px'}} color={"green"} key={`access_${record._id}`}>
                               Активний доступ
                            </Tag>
                                <UserAccessDate chat_id={record.chat_id} date={record.access_time}/>
                                <DisableAccess chat_id={record.chat_id}/>
                        </>
                        :
                        <>
                            <Tag style={{width:'100%',maxWidth:'190px', textAlign:'center', fontSize:'12px'}} color={'red'} key={`no_access_${record._id}`}>
                                Доступ вимкнутий
                                </Tag>
                                <UserAccessDate chat_id={record.chat_id} date={record.access_time}/>
                        </>
                    }
                </>
            ),
        },
        {
            title: '',
            dataIndex: '',
            key: '',
            align:"center",
            sorter: (a, b) => a.access - b.access,
            render: (_, record) => (
                <div style={{display:'flex', flexDirection:'column', alignItems: 'center', gap:'6px'}}>
                    {record.bot_started ?
                        <>
                            <Tag style={{width:'100%',maxWidth:'300px', textAlign:'center', fontSize:'12px'}} color={"green"} key={`bot_started_${record._id}`}>
                                Користувач запустив бота
                            </Tag>
                        </>
                        :
                        <>
                            <Tag style={{width:'100%',maxWidth:'300px', textAlign:'center', fontSize:'12px'}} color={'red'} key={`bot_started_${record._id}`}>
                                Користувач не запускав бота
                            </Tag>
                        </>
                    }
                    {record.test_access ?
                        <>
                            <Tag style={{width:'100%',maxWidth:'300px', textAlign:'center', fontSize:'12px'}} color={"green"} key={`test_access_${record._id}`}>
                                Користувач використав тестовий період
                            </Tag>
                        </>
                        :
                        <>
                            <Tag style={{width:'100%',maxWidth:'300px', textAlign:'center', fontSize:'12px'}} color={'red'} key={`test_access_${record._id}`}>
                                Користувач не використав тестовий період
                            </Tag>
                        </>
                    }
                    {!record.user_bot_ban ?
                        <>
                            <Tag style={{width:'100%',maxWidth:'300px', textAlign:'center', fontSize:'12px'}} color={"red"} key={`user_bot_ban_${record._id}`}>
                                Користувач заблокував бота
                            </Tag>
                        </>
                        :
                        <>
                        </>
                    }
                </div>
            ),
        },
        {
            title: '',
            align:"center",
            key: '_id',
            sorter: (a, b) => a.ban - b.ban,
            render: (_, { ban,chat_id}) => (
                <>
                    <BanUser ban={ban} chat_id={chat_id}/>
                </>
            ),
        },
    ];

    return (
        <>
            <Table columns={columns} dataSource={isUser} rowKey="_id" style={{ width: '100%' }} />
        </>
    );
};

export default Users;