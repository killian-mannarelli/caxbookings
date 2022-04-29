import './TimeSpan.css';
import * as React from 'react';
import TextField from '@mui/material/TextField';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DesktopTimePicker } from '@mui/x-date-pickers/DesktopTimePicker';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import moment from 'moment';

export default function TimePickers() {
    const MINIMUM_BOOKING_TIME = 30;
    let [valueDay, setValueDay] = React.useState(moment(new Date()));
    let [valueTimeStart, setValueStart] = React.useState(moment(new Date()));
    let [valueTimeEnd, setValueEnd] = React.useState(moment(new Date()).add(30,"minute"));

    return (
        <div className='TimeSpan'>
            <p>Select a day and a time span : </p>
            <div className='pickers'>
                <LocalizationProvider dateAdapter={AdapterMoment}>

                    <div className='picker'>
                        <DesktopDatePicker
                            label="For desktop"
                            value={valueDay}
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
                            value={valueTimeStart}
                            onChange={(newValue) => {
                                setValueStart(newValue);
                            }}

                            shouldDisableTime={(timeValue, clockType) => {
                                let sameHour = valueTimeStart.hour() === moment().hour();

                                return (valueDay.dayOfYear() === moment().dayOfYear()) &&
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
                            value={valueTimeEnd}
                            onChange={(newValue) => {
                                setValueEnd(newValue);
                            }}
                            shouldDisableTime={(timeValue, clockType) => {

                                const minTime = valueTimeStart.minutes() + MINIMUM_BOOKING_TIME;
                                const sameHour = valueTimeStart.hour() + Math.floor(minTime / 60) === moment().hour()

                                return ((clockType === "hours" && (timeValue < valueTimeStart.hour() + Math.floor(minTime / 60))) ||
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