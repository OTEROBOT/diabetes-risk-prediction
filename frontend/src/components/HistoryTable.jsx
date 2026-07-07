// src/components/HistoryTable.jsx

function HistoryTable({ history, onDelete, onView, onClearAll }) {
  return (
    <div className="history-section">
      <div className="history-header">
        <h3 className="history-title">📜 ประวัติการประเมิน</h3>
        {history.length > 0 && (
          <button className="btn-clear" onClick={onClearAll}>
            ล้างทั้งหมด
          </button>
        )}
      </div>

      {history.length === 0 ? (
        <div className="history-empty">
          <div className="history-empty-icon">📋</div>
          <p>ยังไม่มีประวัติการประเมิน</p>
        </div>
      ) : (
        <div className="history-table-wrap">
          <table className="history-table">
            <thead>
              <tr>
                <th>วันที่</th>
                <th className="text-center">BMI</th>
                <th className="text-center">ความเสี่ยง</th>
                <th className="text-center">ระดับ</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {history.map((item, index) => (
                <tr key={index}>
                  <td>{new Date(item.date).toLocaleString("th-TH", {
                    day: "numeric", month: "short",
                    hour: "2-digit", minute: "2-digit",
                  })}</td>
                  <td className="text-center">{item.bmi}</td>
                  <td className="text-center font-medium">{item.risk}%</td>
                  <td className="text-center">
                    <span className={`risk-chip ${item.isHigh ? "chip-high" : "chip-low"}`}>
                      {item.isHigh ? "สูง" : "ต่ำ"}
                    </span>
                  </td>
                  <td>
                    <div className="row-actions">
                      <button
                        className="btn-row"
                        onClick={() => onView(item)}
                      >
                        ดู
                      </button>
                      <button
                        className="btn-row btn-delete"
                        onClick={() => onDelete(index)}
                      >
                        ลบ
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default HistoryTable;