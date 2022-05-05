import './TimeSpan.css';
import React, { Component, useEffect } from "react";
import TextField from '@mui/material/TextField';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import moment, { min } from 'moment';
import { areDayPropsEqual } from '@mui/x-date-pickers/PickersDay/PickersDay';

export default function TimePickers(props) {
    const MINIMUM_BOOKING_TIME = 30;
    const MAXIMUM_BOOKING_TIME = 3;

    let [valueDay, setValueDay] = React.useState(moment());
    let [valueTimeStart, setValueStart] = React.useState(moment());
    let [valueTimeEnd, setValueEnd] = React.useState(moment());
    let [valueRoom, setValueRoom] = React.useState(moment());

    useEffect(() => {

       
        setValueDay(moment());
        setValueStart(moment());
        setValueEnd(moment());
        setValueRoom(0);
    }, []);

    useEffect(() => {
        if (valueDay == null || valueTimeStart == null || valueTimeEnd == null) return;
        let momentstart = moment(props.start)
        let momentend = moment(props.end)
        if(props.start != undefined){
        momentstart.hours(momentstart.hours() -2)
        momentend.hours(momentend.hours() -2)
        
    }
    else {
        let roundstartHour = new Date();
        let roundendHour = new Date();
        roundstartHour.setHours(roundstartHour.getHours()+1);
        roundstartHour.setMinutes(0);
        roundstartHour.setSeconds(0);
        roundstartHour.setMilliseconds(0);
        roundendHour.setHours(roundendHour.getHours()+1);
         roundendHour.setMinutes(30);
         roundendHour.setSeconds(0);
         roundendHour.setMilliseconds(0);
         momentstart = moment(roundstartHour);
            momentend = moment(roundendHour);
    }
        setValueDay(momentstart);
        setValueStart(momentstart);
        setValueEnd(momentend);
    }, [valueRoom]);

    useEffect(() => {

        if (valueRoom == null) return;
        if (valueDay.isSame(moment(), 'day') && valueDay.isSame(moment(), 'hour') && valueDay.isSame(moment(), 'minute')) return;
        if (props.callback != undefined) {

            //convert valueDay to Date
            let date = valueDay.toDate();
            //convert valueTimeStart to Date
            let start = valueTimeStart.toDate();
            //convert valueTimeEnd to Date
            let end = valueTimeEnd.toDate();
            if (valueDay.isSame(moment(props.start), 'day') && valueTimeStart.isSame(moment(props.start), 'hour') && valueTimeStart.isSame(moment(props.start), 'minute')) return;
            props.callback(date, start, end);
        }

    }, [valueDay, valueTimeStart, valueTimeEnd]);

    function isTimeStartOK(timeValue, clockType) {
        if (clockType == 'minutes') {
            if (moment().dayOfYear() == valueDay.dayOfYear()) {
                if (timeValue % 15 != 0) {
                    return true;
                } else if (valueTimeStart.hours() == moment().hours()) {
                    if (timeValue < moment().minutes()) {
                        return true;
                    }
                }
            }
        } else if (clockType == 'hours') {
            if (moment().dayOfYear() == valueDay.dayOfYear() && timeValue < moment().hours()) {
                return true;
            }
        }
        return false;
    }

    function isTimeEndOK(timeValue, clockType) {
        if (clockType == 'minutes') {
            if (timeValue % 15 != 0) {
                return true;
            } else if (valueTimeStart.minutes() + MINIMUM_BOOKING_TIME < 60) {
                if (valueTimeEnd.hours() == valueTimeStart.hours() && timeValue < valueTimeStart.minutes() + MINIMUM_BOOKING_TIME) {
                    return true;
                } else if (valueTimeEnd.hours() == valueTimeStart.hours() + MAXIMUM_BOOKING_TIME && timeValue > valueTimeStart.minutes()) {
                    return true;
                }
            } else {
                if (valueTimeEnd.hours() == valueTimeStart.hours() + 1 && timeValue < (valueTimeStart.minutes() + MINIMUM_BOOKING_TIME) % 60) {
                    return true;
                } else if (valueTimeEnd.hours() == valueTimeStart.hours() + MAXIMUM_BOOKING_TIME && timeValue > valueTimeStart.minutes()) {
                    return true;
                }
            }
        } else if (clockType == 'hours') {
            if (valueTimeStart.minutes() + MINIMUM_BOOKING_TIME < 60) {
                if (timeValue < valueTimeStart.hours() || timeValue > valueTimeStart.hours() + MAXIMUM_BOOKING_TIME) {
                    return true;
                }
            } else {
                if (timeValue <= valueTimeStart.hours() || timeValue > valueTimeStart.hours() + MAXIMUM_BOOKING_TIME) {
                    return true;
                }
            }
        }
        return false;
    }

    return (
        <div className='TimeSpan'>
            <p>Select a day and a time span : </p>
            <div className='pickers'>
                <LocalizationProvider dateAdapter={AdapterMoment}>
                    <div className='picker'>
                        <DatePicker
                            label="Select a date"
                            views={['day', 'month', 'year']}
                            value={valueDay ?? moment()}
                            minDate={moment()}
                            onChange={(newValue) => {
                                setValueDay(newValue);

                            }}
                            renderInput={(params) => <TextField {...params} />}
                            disableOpenPicker={false}
                        />
                    </div>

                    <div className='picker'>
                        <TimePicker
                            label="Start"
                            value={valueTimeStart ?? moment()}
                            onChange={(newValue) => {
                                setValueStart(newValue);
                            }}

                            shouldDisableTime={(timeValue, clockType) => {
                                return isTimeStartOK(timeValue, clockType);
                            }}

                            minTime={moment(new Date(0, 0, 0, 7))}
                            maxTime={moment(new Date(0, 0, 0, 20, 30))}
                            renderInput={(params) => <TextField {...params} />}
                        />
                    </div>

                    <div className='picker'>
                        <TimePicker
                            label="End"
                            value={valueTimeEnd ?? moment().setMinutes(new Date().getMinutes() + MINIMUM_BOOKING_TIME)}
                            onChange={(newValue) => {
                                setValueEnd(newValue);
                            }}
                            shouldDisableTime={(timeValue, clockType) => {

                                return isTimeEndOK(timeValue, clockType);

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