export default function ResultTable({ results }) {
  if (!results || results.length === 0) {
    return <div className="empty-state">No results found</div>
  }
  
  return (
    <div className="card" style={{ overflowX: 'auto' }}>
      <table>
        <thead>
          <tr>
            <th>Subject</th>
            <th>Marks Obtained</th>
            <th>Max Marks</th>
            <th>Percentage</th>
            <th>Grade</th>
          </tr>
        </thead>
        <tbody>
          {results.map(result => {
            const percentage = ((result.marksObtained / result.maximumMarks) * 100).toFixed(2)
            return (
              <tr key={result.id}>
                <td>{result.subjectName || '-'}</td>
                <td>{result.marksObtained}</td>
                <td>{result.maximumMarks}</td>
                <td>{percentage}%</td>
                <td>
                  <span className={`status-badge active`}>
                    {result.grade || '-'}
                  </span>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
