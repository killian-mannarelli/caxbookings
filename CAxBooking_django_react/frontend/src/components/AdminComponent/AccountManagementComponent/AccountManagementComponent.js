import React, { useEffect } from "react"
import { DataGrid } from '@mui/x-data-grid';
import Axios from "axios";
import Container from '@mui/material/Container';

export default function AccountManagement() {
    
    
    const [users, setUsers] = React.useState([]);
    const dataUsers = null;
    let selectedUser = null;

    useEffect(() => {
        fetchUsers();
    }, []);

    useEffect(() => {
        ;
    }, [users]);

    const fetchUsers = () => {
        Axios.get("http://127.0.0.1:8000/api/users/getUsers").then(res => {
            setUsers(res.data);
        }
        );
    }

    const deleteUser = () => {
        if(selectedUser == null || selectedUser == undefined) return;
        Axios.post("http://127.0.0.1:8000/api/users/deleteUser", {
            
                user_id: selectedUser
            }).then(res => {
                fetchUsers();
            }
        );

    }

    const columns = [
        {
            field: 'username',
            headerName: 'Username',
            flex : 1,
        },
        {
            field: 'admin_level',
            headerName: 'Admin Level',
            flex : 1,
        },
        {
            field: 'bookings_count',
            headerName: 'Bookings Count',
            flex : 1,
        },
        {
            field: 'avg_booking_time',
            headerName: 'avg bookings time',
            flex : 1,
        },
    ];
    const setData = () => {
        const data = users.map(users => {
            return {
                id: users.id,
                username : users.username,
                admin_level: users.admin_level,
                bookings_count: 888,
                avg_booking_time: '3h',
            }
        }
        );
        return data;
    }



    return (
        <Container className="AccountDisplayComponent" >

            <DataGrid
                columns={columns}
                rows={setData()}
                autoHeight={true}
                checkboxSelection={true}
                hideFooter={true}
                columnVisibilityModel={{
                    columns: {
                        id: true,
                        username : true,
                        admin_level: true,
                        bookings_count: true,
                        avg_booking_time: true,
                    }
                }}

                onSelectionModelChange={(newSelection) => {
                    console.log(newSelection);
                    selectedUser = newSelection;
                 }  }  
            />
            <button className="login-logout CAxButton" onClick={deleteUser}>Delete</button>
        </Container>
    );
}