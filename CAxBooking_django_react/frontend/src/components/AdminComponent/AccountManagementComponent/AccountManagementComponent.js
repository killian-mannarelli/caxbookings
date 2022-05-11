import React, { useEffect } from "react"
import { DataGrid, GridActionsCellItem } from '@mui/x-data-grid';
import Axios from "axios";
import Container from '@mui/material/Container';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import DeleteIcon from '@mui/icons-material/Delete';
import SecurityIcon from '@mui/icons-material/Security';

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
        if (selectedUser == null || selectedUser == undefined) return;
        Axios.post("http://127.0.0.1:8000/api/users/deleteUser", {

            user_id: selectedUser
        }).then(res => {
            fetchUsers();
        }
        );
    }

    const modifyUser = () => {
        console.log("aaaa")
    }

    const toggleAdmin = () => {
        console.log("Admin")

    }

    const duplicateUser = () => {
        console.log("Staff")

    }

    const columns = [
        { field: 'id', headerName: 'id', flex: 1, editable: false },
        { field: 'username', headerName: 'Username', flex: 1, editable: false },
        { field: 'superuser', headerName: 'is_superuser', type: 'boolean', editable: true, flex: 1 },
        { field: 'bookings_count', headerName: 'Bookings Count', editable: false, flex: 1 },
        { field: 'avg_booking_time', headerName: 'avg bookings time', editable: false, flex: 1 },
    ];

    const columns2 = React.useMemo(
        () => [
            { field: 'id', headerName: 'id', flex: 1, editable: false },
            { field: 'username', headerName: 'Username', flex: 1, editable: false },
            { field: 'superuser', headerName: 'is_superuser', type: 'boolean', editable: true, flex: 1 },
            { field: 'bookings_count', headerName: 'Bookings Count', editable: false, flex: 1 },
            { field: 'avg_booking_time', headerName: 'avg bookings time', editable: false, flex: 1 },
            {
                field: 'actions', type: 'actions',
                getActions: (params) => [
                    <GridActionsCellItem
                        icon={<DeleteIcon />}
                        label="Delete"
                        onClick={() => {
                            deleteUser(params.id)
                        }}
                    />,
                    <GridActionsCellItem
                        icon={<SecurityIcon />}
                        label="Toggle Admin"
                        onClick={() => {
                            toggleAdmin(params.id)
                        }}
                        showInMenu
                    />,
                    <GridActionsCellItem
                        icon={<GroupAddIcon />}
                        label="Toggle Staff"
                        onClick={() => {
                            duplicateUser(params.id)
                        }}
                        showInMenu
                    />,
                ],
            },
        ],
        [deleteUser, toggleAdmin, duplicateUser],
    );

    const setData = () => {
        const data = users.map(users => {

            return {
                id: users.id,
                username: users.username,
                superuser: users.is_superuser,
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
                columns={columns2}
                rows={setData()}
                autoHeight={true}
                checkboxSelection={true}
                hideFooter={true}
                columnVisibilityModel={{
                    columns: {
                        id: true,
                        username: true,
                        superuser: true,
                        bookings_count: true,
                        avg_booking_time: true,
                        actions: true,
                    }
                }}

                onSelectionModelChange={(newSelection) => {
                    console.log(newSelection);
                    changeModification()

                    selectedUser = newSelection;
                }}
            />
            <button className="login-logout CAxButton" onClick={deleteUser}>Delete</button>
            <button id="modifyButton" className="login-logout CAxButton" onClick={modifyUser}>Save Modifications</button>
        </Container>
    );
}