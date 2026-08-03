// frontend/src/components/SummaryCards.jsx

import CountUpImport from "react-countup";
import {
  FaRobot,
  FaHeartbeat,
  FaTrophy,
  FaClock,
  FaExclamationTriangle,
  FaCheckCircle,
  FaChartLine,
  FaArrowUp,
  FaArrowDown,
  FaUsers,
  FaDatabase,
} from "react-icons/fa";

// แก้ปัญหา import แบบ object
const CountUp = CountUpImport.default || CountUpImport;

function SummaryCards({ data = {} }) {
  const num = (value) => {
    const n = Number(value);
    return Number.isFinite(n) ? n : 0;
  };

  return (
    <div className="space-y-6 mb-8">
      {/* แถวที่ 1 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
        <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-500 text-sm font-medium">Total Users</p>
              <h2 className="text-4xl font-bold mt-2 text-sky-600">
                <CountUp end={num(data.users)} duration={1.2} />
              </h2>
            </div>
            <div className="bg-sky-100 p-3 rounded-xl">
              <FaUsers size={28} className="text-sky-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-500 text-sm font-medium">Total Datasets</p>
              <h2 className="text-4xl font-bold mt-2 text-amber-600">
                <CountUp end={num(data.datasets)} duration={1.2} />
              </h2>
            </div>
            <div className="bg-amber-100 p-3 rounded-xl">
              <FaDatabase size={28} className="text-amber-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-500 text-sm font-medium">Total Models</p>
              <h2 className="text-4xl font-bold mt-2 text-purple-600">
                <CountUp end={num(data.models)} duration={1.2} />
              </h2>
            </div>
            <div className="bg-purple-100 p-3 rounded-xl">
              <FaRobot size={28} className="text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-500 text-sm font-medium">Prediction Today</p>
              <h2 className="text-4xl font-bold mt-2 text-blue-600">
                <CountUp end={num(data.prediction_today)} duration={1.2} />
              </h2>
            </div>
            <div className="bg-blue-100 p-3 rounded-xl">
              <FaClock size={28} className="text-blue-600" />
            </div>
          </div>
        </div>
      </div>

      {/* แถวที่ 2 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
        <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-500 text-sm font-medium">
                Prediction All Time
              </p>
              <h2 className="text-4xl font-bold mt-2 text-indigo-600">
                <CountUp end={num(data.predictions)} duration={1.2} />
              </h2>
            </div>
            <div className="bg-indigo-100 p-3 rounded-xl">
              <FaHeartbeat size={28} className="text-indigo-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-500 text-sm font-medium">Best Model</p>
              <h2 className="text-xl font-bold mt-2 text-green-600 leading-tight">
                {data.best_model || data.active_model || "-"}
              </h2>
            </div>
            <div className="bg-green-100 p-3 rounded-xl">
              <FaTrophy size={28} className="text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-500 text-sm font-medium">High Risk</p>
              <h2 className="text-4xl font-bold mt-2 text-red-600">
                <CountUp end={num(data.high_risk)} duration={1.2} />
              </h2>
            </div>
            <div className="bg-red-100 p-3 rounded-xl">
              <FaExclamationTriangle size={24} className="text-red-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-500 text-sm font-medium">Low Risk</p>
              <h2 className="text-4xl font-bold mt-2 text-green-600">
                <CountUp end={num(data.low_risk)} duration={1.2} />
              </h2>
            </div>
            <div className="bg-green-100 p-3 rounded-xl">
              <FaCheckCircle size={24} className="text-green-600" />
            </div>
          </div>
        </div>
      </div>

      {/* แถวที่ 3 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-500 text-sm font-medium">Average Risk</p>
              <h2 className="text-3xl font-bold mt-2 text-orange-500">
                <CountUp
                  end={num(data.avg_risk)}
                  duration={1.2}
                  decimals={2}
                  suffix="%"
                />
              </h2>
            </div>
            <div className="bg-orange-100 p-3 rounded-xl">
              <FaChartLine size={24} className="text-orange-500" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-500 text-sm font-medium">Highest Risk</p>
              <h2 className="text-3xl font-bold mt-2 text-red-700">
                <CountUp
                  end={num(data.max_risk)}
                  duration={1.2}
                  decimals={2}
                  suffix="%"
                />
              </h2>
            </div>
            <div className="bg-red-100 p-3 rounded-xl">
              <FaArrowUp size={24} className="text-red-700" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-500 text-sm font-medium">Lowest Risk</p>
              <h2 className="text-3xl font-bold mt-2 text-emerald-600">
                <CountUp
                  end={num(data.min_risk)}
                  duration={1.2}
                  decimals={2}
                  suffix="%"
                />
              </h2>
            </div>
            <div className="bg-emerald-100 p-3 rounded-xl">
              <FaArrowDown size={24} className="text-emerald-600" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SummaryCards;