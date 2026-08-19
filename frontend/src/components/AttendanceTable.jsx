import { formatDate } from '../utils/formatDate'

export default function AttendanceTable({ records }) {
  if (!records || records.length === 0) {
    return <div className="empty-state">No attendance records found</div>
  }
  
  return (
    <div className="card" style={{ overflowX: 'auto' }}>
      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Student</th>
            <th>Status</th>
            <th>Remarks</th>
          </tr>
        </thead>
        <tbody>
          {records.map(record => (
            <tr key={record.id}>
              <td>{formatDate(record.attendanceDate || record.date)}</td>
              <td>{record.studentName || '-'}</td>
              <td>
                <span className={`status-badge ${record.status?.toLowerCase() === 'present' ? 'active' : 'inactive'}`}>
                  {record.status}
                </span>
              </td>
              <td>{record.remarks || '-'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
