import './Bookings.css'
import React from 'react';

const data = [
    { room_name: "PC1 - H133 - 14H - 12/02" },
    { room_name: "PC3 - H134 - 7H - 13/02" },
    { room_name: "PC5 - H135 - 1H - 14/02" },
    { room_name: "PC6 - H133 - 18H - 15/02" },
    { room_name: "PC7 - H132 - 16H - 17/02" },
    { room_name: "PC1 - H135 - 14H - 15/02" },
    { room_name: "PC1 - H133 - 14H - 15/02" },
    { room_name: "PC1 - H133 - 14H - 15/02" },
    { room_name: "PC1 - H133 - 14H - 15/02" },
    { room_name: "PC1 - H133 - 14H - 15/02" },
    { room_name: "PC1 - H133 - 14H - 15/02" },
    { room_name: "PC1 - H133 - 14H - 15/02" },
    { room_name: "PC1 - H133 - 14H - 15/02" },
    { room_name: "PC1 - H133 - 14H - 15/02" },
    { room_name: "PC1 - H133 - 14H - 15/02" },
    { room_name: "PC1 - H133 - 14H - 15/02" },
    { room_name: "PC1 - H133 - 14H - 15/02" },
    { room_name: "PC1 - H133 - 14H - 15/02" },
    { room_name: "PC1 - H133 - 14H - 15/02" },
    { room_name: "PC1 - H133 - 14H - 15/02" },
    { room_name: "PC1 - H133 - 14H - 15/02" },
    { room_name: "PC1 - H133 - 14H - 15/02" },
    { room_name: "PC1 - H133 - 14H - 15/02" },
    { room_name: "PC1 - H133 - 14H - 15/02" },
    { room_name: "PC1 - H133 - 14H - 15/02" },
    { room_name: "PC1 - H133 - 14H - 15/02" },
    { room_name: "PC1 - H133 - 14H - 15/02" },
    { room_name: "PC1 - H133 - 14H - 15/02" },
    { room_name: "PC1 - H133 - 14H - 15/02" },
    { room_name: "PC1 - H133 - 14H - 15/02" },
    { room_name: "PC1 - H133 - 14H - 15/02" },
    { room_name: "PC1 - H133 - 14H - 15/02" },
    { room_name: "PC1 - H133 - 14H - 15/02" },
    { room_name: "PC1 - H133 - 14H - 15/02" },
    { room_name: "PC1 - H133 - 14H - 15/02" },
    { room_name: "PC1 - H133 - 14H - 15/02" },
    { room_name: "PC1 - H133 - 14H - 15/02" },
    { room_name: "PC1 - H133 - 14H - 15/02" },
    { room_name: "PC1 - H133 - 14H - 15/02" },
    { room_name: "PC1 - H133 - 14H - 15/02" },
    { room_name: "PC1 - H133 - 14H - 15/02" },
    { room_name: "PC1 - H133 - 14H - 15/02" },
    { room_name: "PC1 - H133 - 14H - 15/02" },
    { room_name: "PC1 - H133 - 14H - 15/02" },
    { room_name: "PC1 - H133 - 14H - 15/02" },
    { room_name: "PC1 - H133 - 14H - 15/02" },
    { room_name: "PC1 - H133 - 14H - 15/02" },
    { room_name: "PC1 - H133 - 14H - 15/02" },
    { room_name: "PC1 - H133 - 14H - 15/02" },
    { room_name: "PC1 - H133 - 14H - 15/02" },
    { room_name: "PC1 - H133 - 14H - 15/02" },
    { room_name: "PC1 - H133 - 14H - 15/02" },
    { room_name: "PC1 - H133 - 14H - 15/02" },
    { room_name: "PC1 - H133 - 14H - 15/02" },
    { room_name: "PC1 - H133 - 14H - 15/02" },
    { room_name: "PC1 - H133 - 14H - 15/02" },
    { room_name: "PC1 - H133 - 14H - 15/02" },
    { room_name: "PC1 - H133 - 14H - 15/02" },
    { room_name: "PC1 - H133 - 14H - 15/02" },
    { room_name: "PC1 - H133 - 14H - 15/02" },
    { room_name: "PC1 - H133 - 14H - 15/02" },
]

export default function Bookings() {

    
    function fetchApi2() {

        fetch("http://127.0.0.1:8000/api/bookings/search?user_id=1", {
            method: "GET"
        }).then(function (response) {
            return response.text();
        }).then(function (data) {
            var books = JSON.parse(data);

            console.log(books)
            books = books.map((val, key) => {
                return <tr key={key}>
                    <td>{val.id}</td>
                </tr>
            })
            console.log(books)
        }.bind(this));
    };

    let books = fetchApi2()
    console.log(books)

    return (
        <div className="Bookings">
            <p>Ongoing Bookings : </p>
            <table className="content-table">

                <tbody>
                    {data.map((val, key) => {
                        return (
                            <tr key={key}>
                                <td>{val.room_name}</td>
                            </tr>
                        )
                    })}
                </tbody>
            </table>
        </div >
    );


};

