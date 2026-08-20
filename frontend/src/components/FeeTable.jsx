import { formatDate } from '../utils/formatDate'

export default function FeeTable({ fees }) {
  if (!fees || fees.length === 0) {
    return <div className="empty-state">No fee records found</div>
  }
  
  return (
    <div className="card table-container" style={{ overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th>Student</th>
            <th>Academic Year</th>
            <th>Total Amount</th>
            <th>Paid</th>
            <th>Outstanding</th>
            <th>Status</th>
            <th>Due Date</th>
          </tr>
        </thead>
        <tbody>
          {fees.map(fee => {
            const paid = fee.amountPaid ?? fee.paidAmount ?? 0
            const outstanding = fee.outstandingAmount ?? (fee.totalAmount - paid)
            return (
              <tr key={fee.id}>
                <td>
                  <strong>{fee.studentName || `Student #${fee.studentId || '-'}`}</strong>
                </td>
                <td>{fee.academicYearName || '-'}</td>
                <td>₹{(fee.totalAmount || 0).toLocaleString('en-IN')}</td>
                <td>₹{paid.toLocaleString('en-IN')}</td>
                <td style={{ color: outstanding > 0 ? '#ef4444' : '#10b981', fontWeight: 600 }}>
                  ₹{(outstanding > 0 ? outstanding : 0).toLocaleString('en-IN')}
                </td>
                <td>
                  <span className={`status-badge ${fee.status?.toLowerCase() || 'pending'}`}>
                    {fee.status}
                  </span>
                </td>
                <td>{formatDate(fee.dueDate)}</td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
