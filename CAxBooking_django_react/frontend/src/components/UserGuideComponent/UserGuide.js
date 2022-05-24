import React, { useEffect } from "react"
import Header from "../HeaderComponent/Header"
import './UserGuide.css'
import Axios from 'axios';
import Footer from "../FooterComponent/Footer";

export default function UserGuide() {

    const [currentUser, setCurrentUser] = React.useState(null);

    useEffect(() => {
        fetchCurrentUser();
    }, []);



    const fetchCurrentUser = () => {
        Axios.get("http://127.0.0.1:8000/api/users/getCurrent").then(res => {
            setCurrentUser(res.data[0]);
        }
        );
    }

    return (
        <div id="UserGuide">
            <Header currentUser={currentUser} />
            <div id="userGuideContent" className="background">
                <h1>User Guide :</h1>
                <h2>Student</h2>
                <p>
                    If you are logged in as a student, you can start booking some computers !

                    To book a computer you have to select a date and two hours, one for the start and one the end of your computer booking.
                </p>
                <p>
                    Once you have selected the time range you want to book a computer, you can now checkout one of the rooms with some available computers.
                </p>
                <p>
                    You now should be on the room display page, there you can still change the booking time that you selected previously.
                </p>
                <p>
                    Once you are sure of your selection you can select a computer and book it !
                </p>
                <p>
                    Once a computer booked you can go back to the main page by clicking on the logo, there you should be able to see all of your ongoing bookings !
                </p>
                <p>
                    If you made a mistake while booking a computer, no proble you can cancel your bookings at anytime just click on the booking you want to cancel, there you will have a list of informations on the booking ant a cancel button.
                </p>
                <h2>Admin</h2>
                <p>
                    If you are logged in as an Admin (staff or super_user), you sould be able to do all of the things that a normal student can do, and you have access to the admin button that redirects to the admin page.

                </p>
                <p>
                    On this page you can view select between different options, Statistics, Rooms, Equipment, Computers, and Users.
                </p>
                <p>
                    The Statistics page is the first page displayed by default, there you can find different statistics about the registered bookings. You can also download a zip file containing the main tables of the data
                </p>
                <p>
                    The Rooms, Equipement, and Computers page allows you to manage the rooms accessible to the students, you can create, modify and delete any of the three components individualy.
                </p>
                <p>
                    The Users page, gives you general informations about the users of the app, if you are logged in as a super_user you can chose to toggle the super_user and staf fields of every users.

                    You can also delete users if necessary
                </p>
                <p className="warn">
                    /!\ all of the statistics regarding deleted users will be lost /!\
                </p>
            </div>
            <Footer />
        </div>
    );
}