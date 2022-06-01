import React, { useEffect, useMemo } from "react"
import Axios from "axios";
import { DataGrid } from '@mui/x-data-grid';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import PcComponent from "./PcComponent";
import Container from '@mui/material/Container';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import { TextField } from "@mui/material";
import './ComputerManagement.css'


/**
 * It fetches the rooms from the database, displays them in a table, and when a room is selected, it
 * fetches the computers in that room and displays them in a grid
 * @returns A component that displays a list of rooms and computers.
 */
export default function ComputerManagement() {
    const [rooms, setRooms] = React.useState([]);
    const [computers, setComputers] = React.useState([]);
    const [selectedRoom, setSelectedRoom] = React.useState(null);
    const [open, setOpen] = React.useState(false);
    const [openDelete, setOpenDelete] = React.useState(false);
    const [mode, setMode] = React.useState(true);
    const [selectedComputer, setSelectedComputer] = React.useState(null);
    const dataRooms = null;


    useEffect(() => {
        fetchRooms();
    }, []);

    useEffect(() => {
        if (selectedRoom == null || selectedRoom == undefined) return;
        fetchComputers();
    }, [selectedRoom]);


    const fetchComputers = () => {
        Axios.get("http://127.0.0.1:8000/api/computers/search?room_id=" + selectedRoom).then(res => {
            setComputers(res.data);
        }
        );
    }

    const fetchRooms = () => {
        Axios.get("http://127.0.0.1:8000/api/rooms/search?time_start=2022-05-05T13:19:10.545Z&time_end=2022-05-05T14:19:10.545Z").then(res => {
            setRooms(res.data);
        }
        );
    }

    const deleteComputer = () => {
        if (selectedComputer == null || selectedComputer == undefined) return;
        Axios.post("http://127.0.0.1:8000/api/computers/delete", {
            computer_id: selectedComputer.id
        }).then(res => {
            fetchComputers();
            setOpenDelete(false);
        }
        );
    }

    const columns = [
        {
            field: 'room_name',
            headerName: 'Room name',
            flex: 1,
        },
    ];

    const setData = () => {
        const data = rooms.map(room => {
            return {
                id: room.room_id,
                room_name: room.room_name,
            }
        }
        );
        return data;
    }

    const handleCancel = () => {
        setOpen(false);
    };

    /**
     * It returns the value of the cookie with the name passed in as an argument
     * @param name - The name of the cookie you want to get.
     * @returns The value of the cookie with the name passed in as an argument.
     */
    const getCookie = (name) => {
        var cookieValue = null;
        if (document.cookie && document.cookie !== '') {
            var cookies = document.cookie.split(';');
            for (var i = 0; i < cookies.length; i++) {
                var cookie = cookies[i].trim();
                // Does this cookie string begin with the name we want?
                if (cookie.substring(0, name.length + 1) === (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }


    const handleModify = () => {
        if (selectedComputer == null || selectedComputer == undefined) return;
        const csrftoken = getCookie('csrftoken');
        let newName = document.getElementById("name2").value;
        let newHostName = document.getElementById("host_name2").value;
        if (newHostName == "") newHostName = selectedComputer.host_name;
        if (newName == "") newName = selectedComputer.name;
        Axios.post("http://127.0.0.1:8000/api/computers/modify", {
            computer_id: selectedComputer.id,
            computer_name: newName,
            computer_host_name: newHostName,
        }, {
            headers: {
                'X-CSRFToken': csrftoken
            }
        }).then(res => {
            fetchComputers();
            setOpenDelete(false);
        }
        );
    }



    const handleCreate = () => {
        //first recover the text from the name field
        const name = document.getElementById("name").value;
        const host_name = document.getElementById("host_name").value;

        if (host_name == "" || name == "") return;

        Axios.post("http://127.0.0.1:8000/api/computers/create", {
            room_id: selectedRoom,
            pc_name: name,
            pc_host_name: host_name,

        }).then(res => {
            fetchComputers();
            setOpen(false);
        }
        );
    }


    const handleClickOpenDelete = (data) => {
        setSelectedComputer(data);
        setOpenDelete(true);
    };

    const handleCloseDelete = () => {
        setOpenDelete(false);
    }

    return (
        <div id="ComputerManagement">
            <DataGrid
                columns={columns}
                rows={setData()}
                autoHeight={true}
                //being hable to select only one room
                hideFooter={true}
                columnVisibilityModel={{
                    columns: {
                        room_name: true,
                    }
                }}

                onSelectionModelChange={(newSelection) => {
                    setSelectedRoom(newSelection);
                }}
            />
            <Box sx={{
                border: '1px solid #595850',
                borderRadius: '40px',
            }} className="pcDisplay">

                <Grid container spacing={3} wrap="wrap" direction="row" alignItems="center" >
                    {computers.map((pc) =>
                        <PcComponent pc={pc} onClick={handleClickOpenDelete} />
                    )}
                    <Grid item > {selectedRoom != null && <button className="login-logout CAxButton" onClick={() => {
                        setOpen(true);
                    }}>Add a computer</button>} </Grid>
                </Grid>

            </Box>

            <Dialog
                open={open}
                onClose={() => { setOpen(false) }}
                keepMounted
                aria-describedby="alert-dialog-slide-description"
            >
                <DialogTitle>{"Add a Computer"}</DialogTitle>
                <DialogContent>

                    <DialogContentText id="alert-dialog-slide-description">
                        Please enter the name of the new computer:
                    </DialogContentText>

                    <TextField
                        autoFocus
                        margin="dense"
                        id="name"
                        label="Name"
                        type="text"
                        fullWidth
                        variant="standard"
                    />
                    <TextField
                        margin="dense"
                        id="host_name"
                        label="Host_Name"
                        type="text"
                        fullWidth
                        variant="standard"
                    />

                </DialogContent>

                <DialogActions>
                    <Button onClick={handleCancel}>Cancel</Button>
                    <Button onClick={handleCreate}>Create</Button>
                </DialogActions>

            </Dialog>

            <Dialog
                open={openDelete}
                keepMounted
                onClose={handleCancel}
                aria-describedby="alert-dialog-slide-description"
            >
                <DialogTitle>
                    {mode ? "Delete a Computer" : "Modify a computer"}
                </DialogTitle>

                <DialogContent>
                    {mode &&
                        <DialogContentText id="alert-dialog-slide-description">
                            Are you sure you want to delete this computer ?
                        </DialogContentText>
                    }

                    {!mode &&
                        <DialogContentText id="alert-dialog-slide-description">
                            Please enter the new name of the computer:
                        </DialogContentText>
                    }

                    {mode &&
                        <DialogContentText id="alert-dialog-slide-description">
                            {selectedComputer?.name ?? "placeholder"}
                        </DialogContentText>
                    }

                    {!mode &&
                        <TextField
                            autoFocus
                            margin="dense"
                            id="name2"
                            label="Name"
                            type="text"
                            fullWidth
                            variant="standard"
                            placeholder={selectedComputer?.name ?? "PC name"}
                        />}


                    {!mode &&
                        <TextField
                            autoFocus
                            margin="dense"
                            id="host_name2"
                            label="Host_Name"
                            type="text"
                            fullWidth
                            variant="standard"
                            placeholder={selectedComputer?.host_name ?? "PC host_name"}
                        />}
                </DialogContent>

                <DialogActions>

                    <Button onClick={handleCloseDelete}>Cancel</Button>
                    <Button onClick={() => {
                        if (mode) deleteComputer();
                        else handleModify();
                    }
                    }>{mode ? "Delete" : "Modify"}</Button>

                    <Button onClick={() => {
                        setMode(!mode);
                    }} >
                        Change Mode
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    )
}