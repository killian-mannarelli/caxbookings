import React, { useEffect } from "react";
import Axios from "axios";
import { DataGrid } from '@mui/x-data-grid';
import Container from '@mui/material/Container';

export default function RoomDisplayComponent(props) {

    const [rooms, setRooms] = React.useState([]);
    const dataRooms = null;
    let selectedRoom = null;

    useEffect(() => {
        fetchRooms();
    }, []);

    useEffect(() => {
        ;
    }, [rooms]);

    const fetchRooms = () => {
        Axios.get("http://127.0.0.1:8000/api/rooms/search?time_start=2022-05-05T13:19:10.545Z&time_end=2022-05-05T14:19:10.545Z").then(res => {
            setRooms(res.data);
        }
        );
    }

    const deleteRoom = () => {
        if(selectedRoom == null || selectedRoom == undefined) return;
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
            width: '150',
        },
    ];
    const setData = () => {
        const data = rooms.map(room => {
            return {
                id : room.room_id,
                room_name: room.room_name,
            }
        }
        );
        console.log(data);
        return data;
    }



    return (
        <div className="RoomDisplayComponent" style={{height:300, width:'100%'}}>

            <DataGrid
                columns={columns}
                rows={setData()}
                checkboxSelection={true}
                onSelectionModelChange={(newSelection) => {
                    console.log(newSelection);
                    selectedRoom = newSelection;
                 }  }  
            />
            <button className="login-logout CAxButton" onClick={deleteRoom}>Delete</button>
        </div>
    );
}