// frontend/src/components/ConfusionMatrix.jsx

function ConfusionMatrix({ matrix }) {
  // matrix รูปแบบ: [[TN, FP], [FN, TP]] หรือ [[TP, FP], [FN, TN]]
  // ใช้แบบ [[TN, FP], [FN, TP]] เป็นค่าเริ่มต้น

  if (!matrix || matrix.length !== 2) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h3 className="text-xl font-bold text-slate-800 mb-4">
          Confusion Matrix
        </h3>
        <div className="h-64 flex flex-col items-center justify-center text-gray-400">
          <span className="text-5xl mb-3">🧮</span>
          <p className="font-medium text-gray-500">No Confusion Matrix</p>
          <p className="text-sm mt-1">
            Train model with confusion matrix saved to see this section.
          </p>
        </div>
      </div>
    );
  }

  const tn = matrix[0][0];
  const fp = matrix[0][1];
  const fn = matrix[1][0];
  const tp = matrix[1][1];

  const total = tn + fp + fn + tp;

  const cell = (value, label, color) => (
    <div
      className={`rounded-xl p-6 text-center text-white shadow ${color}`}
    >
      <p className="text-sm opacity-90 mb-1">{label}</p>
      <p className="text-3xl font-bold">{value}</p>
      <p className="text-xs mt-1 opacity-80">
        {total > 0 ? ((value / total) * 100).toFixed(1) : 0}%
      </p>
    </div>
  );

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <h3 className="text-xl font-bold text-slate-800 mb-6">
        Confusion Matrix
      </h3>

      <div className="grid grid-cols-2 gap-4 max-w-xl mx-auto">
        {cell(tn, "True Negative (TN)", "bg-green-500")}
        {cell(fp, "False Positive (FP)", "bg-orange-500")}
        {cell(fn, "False Negative (FN)", "bg-red-500")}
        {cell(tp, "True Positive (TP)", "bg-blue-500")}
      </div>

      <div className="mt-6 grid grid-cols-2 gap-4 text-center text-sm text-gray-600">
        <div className="bg-gray-50 rounded-xl p-3">
          <p>Actual Negative</p>
        </div>
        <div className="bg-gray-50 rounded-xl p-3">
          <p>Actual Positive</p>
        </div>
      </div>
    </div>
  );
}

export default ConfusionMatrix;