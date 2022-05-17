import React, {useEffect} from "react";
import Axios from "axios";
import {DataGrid} from "@mui/x-data-grid";


export default function MostBookedRoomComponent(props) {

    const [rooms, setRooms] = React.useState([]);

    useEffect(() => {
        fetchRooms();
    }, []);

    useEffect(() => {
        ;
    }, [rooms]);

    const fetchRooms = () => {
        Axios.get("http://127.0.0.1:8000/api/rooms/mostbooked").then(res => {
            setRooms(res.data);
        }
        );
    }

    const columns = [
        {
            field: 'room_name',
            headerName: 'Room name',
            flex : 1,
        },
        {
            field: 'nb_bookings',
            headerName: 'Number of bookings',
            flex : 1,
        }
    ];
    const setData = () => {
        const data = rooms.map(room => {
            return {
                id : room.room_id,
                room_name: room.room_name,
                nb_bookings: room.room_booking_count,
            }
        }
        );
        return data;
    }

    return (
        <div id="MostBookedRoomComponent" className="background">
            <DataGrid
                columns={columns}
                rows={setData()}
                
                autoHeight={true}
                hideFooter={true}
                />
        </div>
    );
}
