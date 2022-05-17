import React, { useEffect } from "react"
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


export default function ComputerManagement(){
    const [rooms, setRooms] = React.useState([]);
    const [computers, setComputers] = React.useState([]);
    const [selectedRoom, setSelectedRoom] = React.useState(null);
    const [open, setOpen] = React.useState(false);
    const [openDelete, setOpenDelete] = React.useState(false);
    const [selectedComputer, setSelectedComputer] = React.useState(null);
    const dataRooms = null;


    useEffect(() => {
        fetchRooms();
    }, []);

    useEffect(() => {
        ;
    }, [rooms,computers]);

    useEffect(() => {
        if (selectedRoom == null || selectedRoom == undefined) return;
        fetchComputers();
    }, [selectedRoom]);


    const fetchComputers = () => {
        Axios.get("http://127.0.0.1:8000/api/computers/search?room_id="+selectedRoom).then(res => {
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
        if(selectedComputer == null || selectedComputer == undefined) return;
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
            flex : 1,
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
        return data;
    }

    const handleCancel = () => {
        setOpen(false);
    };

    const handleCreate = () => {
        //first recover the text from the name field
        const name = document.getElementById("name").value;
        Axios.post("http://127.0.0.1:8000/api/computers/create", {
            room_id: selectedRoom,
            pc_name: name,

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
                    console.log(newSelection);
                    setSelectedRoom(newSelection);
                 }  }  
            />
            <Box sx={{
            border: '1px solid #595850',
            borderRadius: '40px',
          }} className="pcDisplay">

            <Grid container spacing={3} wrap="wrap" direction="row" alignItems="center" >
              {computers.map((pc) =>
                <PcComponent pc={pc} onClick = {handleClickOpenDelete}/>
              )}
            <Grid item > {selectedRoom != null && <button className="login-logout CAxButton" onClick={() => {
                setOpen(true);
            }}>Add a computer</button>} </Grid>
            </Grid>
            
          </Box>
          <Dialog
            open={open}
            keepMounted
            onClose={handleCloseDelete}
            aria-describedby="alert-dialog-slide-description"
          >
            <DialogTitle>{"Add a Computer"}</DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-slide-description">
                
                
              </DialogContentText>
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
            <DialogTitle>{"Delete a Computer"}</DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-slide-description">
                    Are you sure you want to delete this computer ?
                    
                    
                   </DialogContentText> 

                   <DialogContentText id="alert-dialog-slide-description">
                   {selectedComputer?.name ?? "placeholder"}
                     </DialogContentText>
                  
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseDelete}>Cancel</Button>
              <Button onClick={deleteComputer}>Delete</Button>
            </DialogActions>
          </Dialog>
        </div>
    )
}