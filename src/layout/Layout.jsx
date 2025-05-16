import { Outlet } from "react-router-dom";
import {Nav} from '../components/Nav'

// import Footer from "../components/Footer";
// import Sidebar from "../components/Sidebar";
import { Toaster } from "react-hot-toast";

export default function Layout() {
    return (
        <>
            <div className="overflow-x-hidden max-w-screen">

                <Toaster position='top-center'reverseOrder={true} />
                <div className = "flex min-h-full ">
                    {/* <aside className="min-h-full ">
                        <Sidebar />
                    </aside> */}

                    <div className="flex-1 flex flex-col">
                        < Nav />
                        <main className="flex-1 p-6">
                            <Outlet />
                        </main>
                        {/* <Footer /> */}
                    </div>
                </div>
            </div>
        </>
    );
};