import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import parentService from '../../services/parentService'
import Loading from '../../components/Loading'
import ErrorMessage from '../../components/ErrorMessage'
import ResultTable from '../../components/ResultTable'

export default function ChildResults() {
  const { studentId } = useParams()
  const navigate = useNavigate()
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await parentService.getChildResults(studentId)
        setResults(res.data)
      } catch (err) {
        setError('Failed to load results')
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [studentId])

  if (loading) return <Loading />
  if (error) return <ErrorMessage message={error} />

  // Calculate overall percentage
  let overallPercentage = null
  if (results.length > 0) {
    const totalObtained = results.reduce((sum, r) => sum + r.marksObtained, 0)
    const totalMax = results.reduce((sum, r) => sum + r.maximumMarks, 0)
    if (totalMax > 0) {
      overallPercentage = ((totalObtained / totalMax) * 100).toFixed(2)
    }
  }

  return (
    <div>
      <div className="page-header">
        <h1>Results</h1>
        <button className="btn" onClick={() => navigate(`/parent/child/${studentId}`)}>Back to Profile</button>
      </div>

      {overallPercentage && (
        <div className="card" style={{ marginBottom: '24px' }}>
          <h3>Overall Academic Performance</h3>
          <div style={{ fontSize: '32px', fontWeight: 'bold', color: 'var(--primary)', marginTop: '8px' }}>
            {overallPercentage}%
          </div>
        </div>
      )}

      <ResultTable results={results} />
    </div>
  )
}
