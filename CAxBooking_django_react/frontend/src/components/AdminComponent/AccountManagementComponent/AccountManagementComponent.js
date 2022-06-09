import React, { useEffect, useState } from "react"
import { DataGrid, GridActionsCellItem } from '@mui/x-data-grid';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
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


    const [users, setUsers] = useState([]);
    const [open, setOpen] = useState(false);
    const [openOne, setOpenOne] = useState(false);

    const [selectedUsers, setSelectedUsers] = useState();
    const [selectedUser, setSelectedUser] = useState();

    useEffect(() => {
        fetchUsers();
    }, [open]);

    useEffect(() => {
        ;
    }, [users]);

    const fetchUsers = () => {
        Axios.get("http://"+process.env.PRODIP+"/api/users/usersInfos").then(res => {
            setUsers(res.data);
        }
        );
    }

    const deleteUsers = (usersToDelete) => {
        let CSRF_TOKEN = document.getElementsByName("csrfmiddlewaretoken")[0].value;
        if (usersToDelete == null || usersToDelete == undefined) return;
        Axios.post("http://"+process.env.PRODIP+"/api/users/deleteUsers", {
            user_id: usersToDelete
        }, {
            headers: {
                'X-CSRFToken': CSRF_TOKEN
            }

        }).then(res => {
            fetchUsers();
        }
        );
    }

    const deleteUser = (usersToDelete) => {
        let CSRF_TOKEN = document.getElementsByName("csrfmiddlewaretoken")[0].value;
        if (usersToDelete == null || usersToDelete == undefined) return;
        Axios.post("http://"+process.env.PRODIP+"/api/users/deleteUser", {
            user_id: usersToDelete
        }, {
            headers: {
                'X-CSRFToken': CSRF_TOKEN
            }

        }).then(res => {
            fetchUsers();
        }
        );
    }

    const toggleSuperUser = (id) => {
        let CSRF_TOKEN = document.getElementsByName("csrfmiddlewaretoken")[0].value;
        Axios.post("http://"+process.env.PRODIP+"/api/users/modifyUser", {
            user_id: id,
            is_staff: false,
            is_super: true,
        }, {
            headers: {
                'X-CSRFToken': CSRF_TOKEN
            }

        }).then(res => {
            fetchUsers();
        }
        );
    }

    const toggleStaff = (id) => {
        let CSRF_TOKEN = document.getElementsByName("csrfmiddlewaretoken")[0].value;
        Axios.post("http://"+process.env.PRODIP+"/api/users/modifyUser", {
            user_id: id,
            is_staff: true,
            is_super: false,
        }, {
            headers: {
                'X-CSRFToken': CSRF_TOKEN
            }

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
                            setOpenOne(true)
                            setSelectedUser(params.id)
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
                    setSelectedUsers(newSelection);
                }}
            />}
            <button className="CAxButton" onClick={() => {
                setOpen(true);
            }}>Delete</button>


            <Dialog
                open={open}
                onClose={() => { setOpen(false) }}
                keepMounted
                aria-describedby="alert-dialog-slide-description"
            >
                <DialogTitle>{"Delete User(s)"}</DialogTitle>

                <DialogContent>
                    <DialogContentText id="alert-dialog-slide-description">
                        Are you sure you want delete this/these user(s), all related data will also be lost.
                    </DialogContentText>
                </DialogContent>

                <DialogActions>
                    <Button onClick={() => { setOpen(false) }}>No</Button>
                    <Button onClick={() => {
                        setOpen(false);
                        deleteUsers(selectedUsers);
                    }}>Yes</Button>
                </DialogActions>
            </Dialog>

            <Dialog
                open={openOne}
                onClose={() => { setOpenOne(false) }}
                keepMounted
                aria-describedby="alert-dialog-slide-description"
            >
                <DialogTitle>{"Delete User"}</DialogTitle>

                <DialogContent>
                    <DialogContentText id="alert-dialog-slide-description">
                        Are you sure you want delete this user, all related data will also be lost.
                    </DialogContentText>
                </DialogContent>

                <DialogActions>
                    <Button onClick={() => { setOpenOne(false) }}>No</Button>
                    <Button onClick={() => {
                        setOpenOne(false);
                        deleteUser(selectedUser);
                    }}>Yes</Button>
                </DialogActions>
            </Dialog>

            <ModifyMaxBookingTimeComponent />
        </div   >
    );
}