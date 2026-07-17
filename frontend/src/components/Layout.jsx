import Sidebar from "./Sidebar";

function Layout({ children }) {

    return (

        <div className="flex">

            <Sidebar />

            <div className="flex-1 p-8 bg-gray-100 min-h-screen">

                {children}

            </div>

        </div>

    );

}

export default Layout;