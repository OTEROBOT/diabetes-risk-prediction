// frontend/src/components/SummaryCards.jsx

import CountUp from "react-countup";
import * as FaIcons from "react-icons/fa";

// ฟังก์ชันช่วย Render Icon อย่างปลอดภัย (ถ้า Icon พังจะไม่ทำให้เว็บดับ)
const SafeIcon = ({ icon: IconComponent, size = 24, className = "" }) => {
  if (!IconComponent) return null;
  return <IconComponent size={size} className={className} />;
};

// ฟังก์ชันช่วย Render CountUp อย่างปลอดภัย
const SafeCountUp = (props) => {
  const Component = CountUp?.default || CountUp;
  if (typeof Component !== "function" && typeof Component !== "object") {
    return <span>{props.end ?? 0}</span>;
  }
  return <Component {...props} />;
};

function SummaryCards({ data }) {
  const {
    FaRobot,
    FaHeartbeat,
    FaTrophy,
    FaClock,
    FaExclamationTriangle,
    FaCheckCircle,
    FaChartLine,
    FaArrowUp,
    FaArrowDown,
  } = FaIcons;

  return (
    <div className="space-y-6 mb-8">
      {/* แถวที่ 1 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
        {/* Total Models */}
        <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-500 text-sm font-medium">Total Models</p>
              <h2 className="text-4xl font-bold mt-2 text-purple-600">
                <SafeCountUp end={data?.models ?? 0} duration={1.5} />
              </h2>
            </div>
            <div className="bg-purple-100 p-3 rounded-xl">
              <SafeIcon icon={FaRobot} size={28} className="text-purple-600" />
            </div>
          </div>
        </div>

        {/* Prediction Today */}
        <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-500 text-sm font-medium">
                Prediction Today
              </p>
              <h2 className="text-4xl font-bold mt-2 text-blue-600">
                <SafeCountUp end={data?.prediction_today ?? 0} duration={1.5} />
              </h2>
            </div>
            <div className="bg-blue-100 p-3 rounded-xl">
              <SafeIcon icon={FaClock} size={28} className="text-blue-600" />
            </div>
          </div>
        </div>

        {/* Prediction All Time */}
        <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-500 text-sm font-medium">
                Prediction All Time
              </p>
              <h2 className="text-4xl font-bold mt-2 text-indigo-600">
                <SafeCountUp end={data?.predictions ?? 0} duration={1.5} />
              </h2>
            </div>
            <div className="bg-indigo-100 p-3 rounded-xl">
              <SafeIcon icon={FaHeartbeat} size={28} className="text-indigo-600" />
            </div>
          </div>
        </div>

        {/* Best Model */}
        <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-500 text-sm font-medium">Best Model</p>
              <h2 className="text-xl font-bold mt-2 text-green-600 leading-tight">
                {data?.best_model || data?.active_model || "-"}
              </h2>
            </div>
            <div className="bg-green-100 p-3 rounded-xl">
              <SafeIcon icon={FaTrophy} size={28} className="text-green-600" />
            </div>
          </div>
        </div>
      </div>

      {/* แถวที่ 2 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-6">
        {/* High Risk */}
        <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-500 text-sm font-medium">High Risk</p>
              <h2 className="text-4xl font-bold mt-2 text-red-600">
                <SafeCountUp end={data?.high_risk ?? 0} duration={1.5} />
              </h2>
            </div>
            <div className="bg-red-100 p-3 rounded-xl">
              <SafeIcon icon={FaExclamationTriangle} size={24} className="text-red-600" />
            </div>
          </div>
        </div>

        {/* Low Risk */}
        <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-500 text-sm font-medium">Low Risk</p>
              <h2 className="text-4xl font-bold mt-2 text-green-600">
                <SafeCountUp end={data?.low_risk ?? 0} duration={1.5} />
              </h2>
            </div>
            <div className="bg-green-100 p-3 rounded-xl">
              <SafeIcon icon={FaCheckCircle} size={24} className="text-green-600" />
            </div>
          </div>
        </div>

        {/* Average Risk */}
        <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-500 text-sm font-medium">Average Risk</p>
              <h2 className="text-3xl font-bold mt-2 text-orange-500">
                <SafeCountUp
                  end={Number(data?.avg_risk ?? 0)}
                  duration={1.5}
                  decimals={2}
                  suffix="%"
                />
              </h2>
            </div>
            <div className="bg-orange-100 p-3 rounded-xl">
              <SafeIcon icon={FaChartLine} size={24} className="text-orange-500" />
            </div>
          </div>
        </div>

        {/* Highest Risk */}
        <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-500 text-sm font-medium">Highest Risk</p>
              <h2 className="text-3xl font-bold mt-2 text-red-700">
                <SafeCountUp
                  end={Number(data?.max_risk ?? 0)}
                  duration={1.5}
                  decimals={2}
                  suffix="%"
                />
              </h2>
            </div>
            <div className="bg-red-100 p-3 rounded-xl">
              <SafeIcon icon={FaArrowUp} size={24} className="text-red-700" />
            </div>
          </div>
        </div>

        {/* Lowest Risk */}
        <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-500 text-sm font-medium">Lowest Risk</p>
              <h2 className="text-3xl font-bold mt-2 text-emerald-600">
                <SafeCountUp
                  end={Number(data?.min_risk ?? 0)}
                  duration={1.5}
                  decimals={2}
                  suffix="%"
                />
              </h2>
            </div>
            <div className="bg-emerald-100 p-3 rounded-xl">
              <SafeIcon icon={FaArrowDown} size={24} className="text-emerald-600" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SummaryCards;