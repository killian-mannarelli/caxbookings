import React from "react";
import Grid from '@mui/material/Grid';
import ComputerIcon from '@mui/icons-material/Computer';

export default function PcComponent(props) {



    const pc = props.pc;
    return (
        //make a grid with the pc name and the image
        <Grid item xs={4} sm={4} md={4} lg={2} className="pc" >
            <Grid container direction="column" alignItems="center"  wrap="wrap" justifyContent="center"  onClick={() => {props.onClick(pc)}}>
                <Grid item xs={12} justifyContent="center" >

                    <ComputerIcon sx={{ fontSize: 120 }} style={{ color: "black" }} />

                </Grid>
                <Grid item xs={12} justifyContent="center">
                    <p style={{wrap : "wrap"}}>{pc.name}</p>
                </Grid>


            </Grid>
        </Grid>
    );




}