export default function StudentTable({ students, onView }) {
  if (!students || students.length === 0) {
    return <div className="empty-state">No students found</div>
  }
  
  return (
    <div className="card" style={{ overflowX: 'auto' }}>
      <table>
        <thead>
          <tr>
            <th>Student ID</th>
            <th>Name</th>
            <th>Class</th>
            <th>Section</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {students.map(student => (
            <tr key={student.id}>
              <td>{student.studentId}</td>
              <td>{student.firstName} {student.lastName}</td>
              <td>{student.className || '-'}</td>
              <td>{student.sectionName || '-'}</td>
              <td>
                <span className={`status-badge ${student.status === 'ACTIVE' ? 'active' : ''}`}>
                  {student.status}
                </span>
              </td>
              <td>
                <button className="btn btn-primary" onClick={() => onView(student.id)}>View</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
