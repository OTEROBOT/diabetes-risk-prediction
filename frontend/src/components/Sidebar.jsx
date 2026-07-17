import { Link } from "react-router-dom";

function Sidebar() {
    return (
        <div className="w-64 h-screen bg-slate-900 text-white p-5">

            <h1 className="text-2xl font-bold mb-8">
                Diabetes System
            </h1>

            <nav className="space-y-3">

                <Link to="/" className="block hover:text-cyan-400">
                    Dashboard
                </Link>

                <Link to="/predict" className="block hover:text-cyan-400">
                    Predict
                </Link>

                <Link to="/train" className="block hover:text-cyan-400">
                    Train Model
                </Link>

                <Link to="/models" className="block hover:text-cyan-400">
                    Models
                </Link>

                <Link to="/training-history" className="block hover:text-cyan-400">
                    Training History
                </Link>

                <Link to="/history" className="block hover:text-cyan-400">
                    Prediction History
                </Link>

            </nav>

        </div>
    );
}

export default Sidebar;