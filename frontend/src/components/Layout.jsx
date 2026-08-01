import Sidebar from "./Sidebar";
//D:\IT29401 โครงงานทางเทคโนโลยีสารสนเทศ\ปี4เทอม1\diabetes-risk-prediction\frontend\src\components\Layout.jsx
function Layout({ children }) {
  return (
    <div className="bg-gray-100 min-h-screen">

      <Sidebar />

      <main className="ml-64 p-8 min-h-screen">

        {children}

      </main>

    </div>
  );
}

export default Layout;