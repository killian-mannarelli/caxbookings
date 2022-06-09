import React, { useEffect } from "react"
import { DataGrid, GridActionsCellItem } from '@mui/x-data-grid';
import Axios from "axios";
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import DeleteIcon from '@mui/icons-material/Delete';
import SecurityIcon from '@mui/icons-material/Security';
import './AccountManagement.css'
import ModifyMaxBookingTimeComponent from "./ModifyMaxBookingTimeComponent";

/**
 * It displays the users in a table and allows the admin to modify the users.
 * @param props - the props that are passed to the component
 * @returns A component that displays a table of users and their information.
 */
export default function AccountManagement(props) {


    const [users, setUsers] = React.useState([]);
    let selectedUser = null;

    useEffect(() => {
        fetchUsers();
    }, []);

    useEffect(() => {
        ;
    }, [users]);

    const fetchUsers = () => {
        Axios.get("http://127.0.0.1:8000/api/users/usersInfos").then(res => {
            setUsers(res.data);
        }
        );
    }

    const deleteUsers = (usersToDelete) => {
        if (usersToDelete == null || usersToDelete == undefined) return;
        Axios.post("http://127.0.0.1:8000/api/users/deleteUsers", {
            user_id: usersToDelete
        }).then(res => {
            fetchUsers();
        }
        );
    }

    const deleteUser = (usersToDelete) => {
        if (usersToDelete == null || usersToDelete == undefined) return;
        Axios.post("http://127.0.0.1:8000/api/users/deleteUser", {
            user_id: usersToDelete
        }).then(res => {
            fetchUsers();
        }
        );
    }

    const toggleSuperUser = (id) => {
        Axios.post("http://127.0.0.1:8000/api/users/modifyUser", {
            user_id: id,
            is_staff: false,
            is_super: true,
        }).then(res => {
            fetchUsers();
        }
        );
    }

    const toggleStaff = (id) => {
        Axios.post("http://127.0.0.1:8000/api/users/modifyUser", {
            user_id: id,
            is_staff: true,
            is_super: false,
        }).then(res => {
            fetchUsers();
        }
        );

    }

    const columns = React.useMemo(
        () => [
            { field: 'id', headerName: 'id', flex: 1 },
            { field: 'username', headerName: 'username', flex: 1 },
            { field: 'superuser', headerName: 'is_superuser', type: 'boolean', flex: 1 },
            { field: 'staff', headerName: 'is_staff', type: 'boolean', flex: 1 },
            { field: 'bookings_count', headerName: 'total_bookings', flex: 1 },
            { field: 'bookings_in_process', headerName: 'in_process', flex: 1 },
            { field: 'bookings_passed', headerName: 'passed', flex: 1 },
            { field: 'bookings_canceld', headerName: 'canceled', flex: 1 },
            { field: 'avg_booking_time', headerName: 'avg_time', flex: 1 },
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
                            toggleSuperUser(params.id)
                        }}
                        showInMenu
                    />,
                    <GridActionsCellItem
                        icon={<GroupAddIcon />}
                        label="Toggle Staff"
                        onClick={() => {
                            toggleStaff(params.id)
                        }}
                        showInMenu
                    />,
                ],
            },
        ],
        [deleteUser, toggleSuperUser, toggleStaff],
    );

    const setData = () => {
        const data = users.map(users => {


            return {

                id: users.user_id,
                username: users.username,
                superuser: users.is_superuser,
                staff: users.is_staff,
                bookings_count: users.nb_total_bookings,
                bookings_in_process: users.nb_in_process_bookings,
                bookings_passed: users.nb_passed_bookings,
                bookings_canceld: users.nb_canceled_bookings,
                avg_booking_time: users.avg_booking_time,
            }
        });
        return data;
    }

    return (
        <div className="AccountDisplayComponent" >

            {props.currentUser && <DataGrid
                columns={columns}
                rows={setData()}
                autoHeight={true}
                checkboxSelection={true}
                hideFooter={true}
                columnVisibilityModel={{
                    id: true,
                    username: true,
                    superuser: true,
                    staff: true,
                    bookings_count: true,
                    bookings_in_process: true,
                    bookings_passed: true,
                    bookings_canceld: true,
                    avg_booking_time: true,
                    actions: props.currentUser.is_superuser,
                }}

                onSelectionModelChange={(newSelection) => {
                    selectedUser = newSelection;
                }}
            />}
            <button className="CAxButton" onClick={() => { deleteUsers(selectedUser) }}>Delete</button>
            <ModifyMaxBookingTimeComponent />
        </div   >
    );
}