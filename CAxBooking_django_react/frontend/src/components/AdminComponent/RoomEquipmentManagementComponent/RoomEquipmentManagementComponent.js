import React, { useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import Axios from 'axios';
import './RoomEquipment.css';

export default function RoomEquipmentManagementComponent() {

    const [equipments, setEquipments] = React.useState([]);
    const [selectedEquipment, setSelectedEquipment] = React.useState(null);


    useEffect(() => {
        fetchEquipments();
    }, []);


    const fetchEquipments = () => {
        Axios.get("http://"+process.env.PRODIP+"/api/rooms/equipments/all").then(res => {
            setEquipments(res.data);
        }
        );
    }

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

    const createEquipment = () => {
        let token = getCookie('csrftoken');
        //get the name from the input
        let name = document.getElementById('equipmentName').value;
        Axios.post("http://"+process.env.PRODIP+"/api/rooms/equipment/add", {
            equipment_name: name,
        }, {
            headers: {
                'X-CSRFToken': token
            }
        }).then(res => {
            fetchEquipments();
        }
        );
    }

    const deleteEquipment = () => {
        let token = getCookie('csrftoken');
        if (selectedEquipment == null || selectedEquipment == undefined) return;
        Axios.post("http://"+process.env.PRODIP+"/api/rooms/equipments/delete", {
            equipment_id: selectedEquipment
        }, {
            headers: {
                'X-CSRFToken': token
            }

        }).then(res => {
            fetchEquipments();
        }
        );
    }

    //make the datagrid columns for the equipment, equipment is a json object with the following properties:
    // id and  equipment_name
    const columns = [
        { field: 'id', headerName: 'ID' },
        { field: 'equipment_name', headerName: 'Equipment Name' },
    ];

    //make the rows for the datagrid
    const rows = equipments.map((val, key) => {
        return {
            id: val.id,
            equipment_name: val.equipment_name,
        };
    });


    return (
        <div id='roomEquipment'>
            <form id='equipmentCreation'>
                <label id='nameLabel'>Room Equipment name</label>
                <input type="text" id="equipmentName" />
            </form>
                <button className="login-logout CAxButton" onClick={createEquipment}>Create</button>
            <DataGrid id='equipmentList'
                columns={columns}
                rows={rows}
                autoHeight={true}
                hideFooter={true}
                onSelectionModelChange={(newSelection) => {
                    setSelectedEquipment(newSelection);
                }}
            />
            <button className="login-logout CAxButton" onClick={deleteEquipment}>Delete</button>

        </div>
    );
}

