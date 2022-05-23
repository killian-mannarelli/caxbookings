import React, {useEffect} from 'react';
import { DataGrid } from '@mui/x-data-grid';
import Axios from 'axios';

export default function RoomEquipmentManagementComponent() {

    const [equipments, setEquipments] = React.useState([]);


    useEffect(() => {
        fetchEquipments();
    }, []);


    const fetchEquipments = () => {
        Axios.get("http://127.0.0.1:8000/api/rooms/equipments/all").then(res => {
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
        Axios.post("http://127.0.0.1:8000/api/rooms/equipment/add", {
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

 //make the datagrid columns for the equipment, equipment is a json object with the following properties:
 // id and  equipment_name
    const columns = [
        {
            field: 'id',
            headerName: 'ID',
        },
        {
            field: 'equipment_name',
            headerName: 'Equipment Name',
        },
    ];

    //make the rows for the datagrid
    const rows = equipments.map((val, key) => {
        return {
            id: val.id,
            equipment_name: val.equipment_name,
        };
    });






  return (
    <div>
         <form>
                <label>Room Equipment name</label>
                <input type="text" id = "equipmentName"/>
                
            </form>
            <button className="login-logout CAxButton" onClick={createEquipment}>Create</button>
       <DataGrid
                columns={columns}
                rows={rows}
                autoHeight={true}
                checkboxSelection={true}
                hideFooter={true}


            
            />

    </div>
  );
}

