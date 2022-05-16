import React, { useEffect, useMemo } from "react";
import Axios from "axios";
import { DataGrid } from '@mui/x-data-grid';
import Container from '@mui/material/Container';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import { TextField } from "@mui/material";

export default function RoomDisplayComponent(props) {

    const [rooms, setRooms] = React.useState([]);
    const [open, setOpen] = React.useState(false);
    const dataRooms = null;
    let selectedRoom = null;
    const [modifyRoom, setModifyRoom] = React.useState(null);

    useEffect(() => {
        fetchRooms();
    }, []);

    useEffect(() => {
        ;
    }, [rooms]);

    useEffect(() => {
        if (modifyRoom == null || modifyRoom == undefined) return;
        setOpen(true);
    }, [modifyRoom]);

    const dialogContentText = useMemo(() => {
        if (modifyRoom == null || modifyRoom == undefined) return "";

    
        if (modifyRoom.length === 0) return 'Pas de rooms';
        return modifyRoom[0].name ?? "placeholder";
    }, [modifyRoom]);

    const fetchRooms = () => {
        Axios.get("http://127.0.0.1:8000/api/rooms/search?time_start=2022-05-05T13:19:10.545Z&time_end=2022-05-05T14:19:10.545Z").then(res => {
            setRooms(res.data);
        }
        );
    }

    //make a function to get the csrf token from the cookie
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


    const modifRoom = () => {
        var CSRF_TOKEN=getCookie('csrftoken');
        let newName = document.getElementById("name").value;
        Axios.post("http://127.0.0.1:8000/api/rooms/modify", {
            room_id: modifyRoom[0].id,
            room_name: newName,
    }, {
        headers: {
            'X-CSRFToken': CSRF_TOKEN
        }

    }).then(res => {
        fetchRooms();
        setOpen(false);
    });
    }



    const deleteRoom = () => {
        if (selectedRoom == null || selectedRoom == undefined) return;
        Axios.post("http://127.0.0.1:8000/api/rooms/delete", {

            room_id: selectedRoom
        }).then(res => {
            fetchRooms();
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

    const handleClose = () => {
        setOpen(false);
    }

    const fetchSpecificRoom = (roomID) => {
        Axios.get("http://127.0.0.1:8000/api/rooms/search/specific?room_id=" + roomID).then(res => {
            setModifyRoom(res.data);

        }
        );
    }


    return (
        <Container className="RoomDisplayComponent" >

            <DataGrid
                columns={columns}
                rows={setData()}
                autoHeight={true}
                checkboxSelection={true}
                hideFooter={true}
                columnVisibilityModel={{
                    columns: {
                        room_name: true,
                    }
                }}

                onSelectionModelChange={(newSelection) => {
                    console.log(newSelection);
                    selectedRoom = newSelection;
                }}
            />
            <button className="login-logout CAxButton" onClick={deleteRoom}>Delete</button>
            <button className="login-logout CAxButton" onClick={fetchRooms}>Refresh</button>
            {<button className="login-logout CAxButton" onClick={() => {
                fetchSpecificRoom(selectedRoom[0] ?? 1);
            }}>Modify</button>}
            <Dialog
                open={open}
                keepMounted
                onClose={handleClose}
                aria-describedby="alert-dialog-slide-description"
            >
                <DialogTitle>{"Modify a room"}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-slide-description">
                        Previous name :


                    </DialogContentText>

                    <DialogContentText id="alert-dialog-slide-description">
                        {dialogContentText}
                    </DialogContentText>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="name"
                        placeholder={dialogContentText}
                        label=""
                        type="text"
                        fullWidth
                        variant="standard"
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Close</Button>
                    <Button onClick={modifRoom}>Modify</Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
}