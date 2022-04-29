import './TimeSpan.css';
import React, { Component, useEffect } from "react";
import TextField from '@mui/material/TextField';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DesktopTimePicker } from '@mui/x-date-pickers/DesktopTimePicker';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import moment, { min } from 'moment';
import { areDayPropsEqual } from '@mui/x-date-pickers/PickersDay/PickersDay';

export default function TimePickers(props) {
    const MINIMUM_BOOKING_TIME = 30;

    let [valueDay, setValueDay] = React.useState(null);
    let [valueTimeStart, setValueStart] = React.useState(null);
    let [valueTimeEnd, setValueEnd] = React.useState(null);
    let [valueRoom, setValueRoom] = React.useState(null);

    useEffect(() => {
        setValueDay(moment(new Date()));
        setValueStart(moment(new Date()));
        setValueEnd(moment(new Date().setMinutes(new Date().getMinutes() + MINIMUM_BOOKING_TIME)));
        setValueRoom(0);
    }, []);

    useEffect(() => {
        if (valueDay == null || valueTimeStart == null || valueTimeEnd == null) return;

        setValueDay(moment(props.start));
        setValueStart(moment(props.start));
        setValueEnd(moment(props.end));
    }, [valueRoom]);

    useEffect(() => {
        if (valueRoom == null) return;
        if (props.callback != undefined) {
                //convert valueDay to Date
                let date = valueDay.toDate();
                //convert valueTimeStart to Date
                let start = valueTimeStart.toDate();
                //convert valueTimeEnd to Date
                let end = valueTimeEnd.toDate();
                props.callback(date, start, end);
            }
            
    }, [valueDay, valueTimeStart, valueTimeEnd]);

    return (
        <div className='TimeSpan'>
            <p>Select a day and a time span : </p>
            <div className='pickers'>
                <LocalizationProvider dateAdapter={AdapterMoment}>

                    <div className='picker'>
                        <DesktopDatePicker
                            label="For desktop"
                            value={valueDay ?? moment(new Date())}
                            minDate={moment(new Date())}
                            onChange={(newValue) => {
                                setValueDay(newValue);
                            }}
                            renderInput={(params) => <TextField {...params} />}
                            disableOpenPicker={false}
                        />
                    </div>

                    <div className='picker'>
                        <DesktopTimePicker
                            label="Start"
                            value={valueTimeStart ?? moment(new Date())}
                            onChange={(newValue) => {
                                setValueStart(newValue);
                            }}

                            shouldDisableTime={(timeValue, clockType) => {
                                //let sameHour = valueTimeStart.hour() === moment().hour();

                                return (valueDay?.dayOfYear() ?? moment(new Date()).dayOfYear() === moment().dayOfYear()) &&
                                    ((clockType === "hours" && timeValue < moment().hour()) ||
                                        (clockType === "minutes" && timeValue < moment().minute()))

                            }}

                            minTime={moment(new Date(0, 0, 0, 7))}
                            maxTime={moment(new Date(0, 0, 0, 20, 30))}
                            renderInput={(params) => <TextField {...params} />}
                        />
                    </div>

                    <div className='picker'>
                        <DesktopTimePicker
                            label="End"
                            value={valueTimeEnd ?? moment(new Date())}
                            onChange={(newValue) => {
                                setValueEnd(newValue);
                            }}
                            shouldDisableTime={(timeValue, clockType) => {

                                const minTime = valueTimeStart?.minutes() ?? moment(new Date()).minutes() + MINIMUM_BOOKING_TIME;
                                const sameHour = valueTimeStart?.hour() ?? moment(new Date()).hour() + Math.floor(minTime / 60) === moment().hour()

                                return ((clockType === "hours" && (timeValue < valueTimeStart?.hour() ?? moment(new Date()).hour() + Math.floor(minTime / 60))) ||
                                    (clockType === "minutes" &&
                                        (sameHour && (minTime < 60 && timeValue < minTime) ||
                                            (minTime > 60 && timeValue < minTime % 60)
                                        )));

                            }}
                            minTime={moment(new Date(0, 0, 0, 7, 30))}
                            maxTime={moment(new Date(0, 0, 0, 21, 0))}
                            renderInput={(params) => <TextField {...params} />}
                        />
                    </div>
                </LocalizationProvider>
            </div>
        </div>
    );
}