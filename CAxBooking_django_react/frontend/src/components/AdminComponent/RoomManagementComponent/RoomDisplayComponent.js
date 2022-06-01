import React, { useEffect, useMemo, useState } from "react";
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
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import ListItemText from '@mui/material/ListItemText';
import Select from '@mui/material/Select';
import Checkbox from '@mui/material/Checkbox';
import "./style.css";
/**
 * It fetches the rooms from the database, displays them in a table, and allows the user to modify or
 * delete them
 * @param props - The props that are passed to the component.
 * @returns A component that displays a list of rooms and allows the user to modify or delete them.
 */
export default function RoomDisplayComponent(props) {

    const [rooms, setRooms] = useState([]);
    const [open, setOpen] = useState(false);
    const [openDelete, setOpenDelete] = useState(false);
    const [selectedRoom, setSelectedRoom] = useState();
    const [modifyRoom, setModifyRoom] = useState(null);
    const [roomEquipments, setRoomEquipments] = useState([]);
    const [allRoomsEquipments, setAllRoomsEquipments] = useState([]);
    const [selectedEquipments, setSelectedEquipments] = useState([]);

    const ITEM_HEIGHT = 48;
    const ITEM_PADDING_TOP = 8;

    useEffect(() => {
        fetchRooms();
        fetchEquipments();
        fetchAllRoomsEquipments();
    }, []);

    useEffect(() => {
        ;
    }, [rooms]);

    useEffect(() => {
        if (modifyRoom == null || modifyRoom == undefined) return;
        setOpen(true);
    }, [modifyRoom]);


    const fetchEquipments = () => {
        Axios.get("http://127.0.0.1:8000/api/rooms/equipments/all").then(res => {
            setRoomEquipments(res.data);
        }
        );
    }

    const fetchAllRoomsEquipments = () => {
        Axios.get("http://127.0.0.1:8000/api/rooms/allequipments").then(res => {
            setAllRoomsEquipments(res.data);
        }
        );
    }

    const checkIfRoomHasEquipment = (equipment_name) => {
        //use allroomsequipments
        for (let i = 0; i < allRoomsEquipments.length; i++) {
            if (allRoomsEquipments[i].equipment_name == equipment_name && modifyRoom != null && modifyRoom[0].id == allRoomsEquipments[i].room_id) {
                //add the id to the selectedequipments
                //setSelectedEquipments(selectedEquipments.concat(equipment_id));
                return true;
            }
        }
        return false;
    }

    const getEquipmentString = (room_id) => {
        let equipmentString = "";
        for (let i = 0; i < allRoomsEquipments.length; i++) {
            if (allRoomsEquipments[i].room_id == room_id) {
                equipmentString += allRoomsEquipments[i].equipment_name + "; ";
            }
        }
        return equipmentString;
    }

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

    /**
     * It takes the new name of the room and sends it to the backend to be updated
     */
    const modifRoom = () => {
        var CSRF_TOKEN = getCookie('csrftoken');
        let newName = document.getElementById("name").value;
        if (newName == "") {
            let roomid = modifyRoom[0].id;
            //use the roomid to get the room name
            newName = rooms.filter(room => room.room_id == roomid)[0].room_name;
        }
        Axios.post("http://127.0.0.1:8000/api/rooms/modify", {
            room_id: modifyRoom[0].id,
            room_name: newName,
            equipments: selectedEquipments,
        }, {
            headers: {
                'X-CSRFToken': CSRF_TOKEN
            }

        }).then(res => {
            fetchRooms();
            setOpen(false);
            fetchAllRoomsEquipments();
        });
    }

    const createRoom = () => {
        //recover the room name from the input
        let roomName = document.getElementById("roomNameInput").value;
        //create the room
        Axios.post("http://127.0.0.1:8000/api/rooms/create", {
            room_name: roomName
        }).then(res => {
            fetchRooms();

        });


    }

    function deleteRoom() {
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
        {
            field: 'equipments',
            headerName: 'Equipments',
            flex: 1,
        }
    ];

    const setData = () => {
        const data = rooms.map(room => {
            return {
                id: room.room_id,
                room_name: room.room_name,
                equipments: getEquipmentString(room.room_id)
            }
        }

            //to data add the related room equipments by id

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


    const handleChange = (event) => {
        const {
            target: { value },
        } = event;
        //append the key to the selectedEquipments array
        setSelectedEquipments(value);

    };

    return (

        <div className="RoomManagement">
            <div className="RoomDisplayComponent" >
                <form>
                    <label>Room name</label>
                    <input type="text" id="roomNameInput" />

                </form>
                <button className="login-logout CAxButton" onClick={createRoom}>Create</button>

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
                        setSelectedRoom(newSelection);
                    }}
                />

                <button className="CAxButton" onClick={() => { setOpenDelete(true) }}>Delete</button>
                <Dialog
                    open={openDelete}
                    onClose={() => { setOpenDelete(false) }}
                    keepMounted
                    aria-describedby="alert-dialog-slide-description"
                >
                    <DialogTitle>{"Delete Room(s)"}</DialogTitle>

                    <DialogContent>
                        <DialogContentText id="alert-dialog-slide-description">
                            Are you sure you want to delete this/these room(s) ?
                        </DialogContentText>
                    </DialogContent>

                    <DialogActions>
                        <Button onClick={() => { setOpenDelete(false) }}>No</Button>
                        <Button onClick={() => {
                            setOpenDelete(false);
                            deleteRoom();
                        }}>Yes</Button>
                    </DialogActions>
                </Dialog>


                {<button className="CAxButton" onClick={() => {
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
                    <div>
                        <FormControl sx={{ m: 1, width: 300 }}>
                            <InputLabel id="demo-multiple-checkbox-label">Tag</InputLabel>
                            <Select
                                labelId="demo-multiple-checkbox-label"
                                id="demo-multiple-checkbox"
                                multiple
                                renderValue={(selected) => selected.join(', ')}
                                value={selectedEquipments}
                                onChange={handleChange}
                                input={<OutlinedInput label="Tag" />}
                            >
                                {roomEquipments.map((item) => (
                                    <MenuItem key={item.id} value={item.id}>
                                        <Checkbox checked={(checkIfRoomHasEquipment(item.equipment_name, item.id) && !selectedEquipments.includes(item.id)) || (selectedEquipments.includes(item.id) && !checkIfRoomHasEquipment(item.equipment_name, item.id))} />
                                        <ListItemText primary={item.equipment_name} />
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </div>
                    <DialogActions>
                        <Button onClick={handleClose}>Close</Button>
                        <Button onClick={modifRoom}>Modify</Button>
                    </DialogActions>
                </Dialog>

            </div>
        </div>
    );
}