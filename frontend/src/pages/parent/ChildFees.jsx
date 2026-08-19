import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import parentService from '../../services/parentService'
import Loading from '../../components/Loading'
import ErrorMessage from '../../components/ErrorMessage'
import FeeTable from '../../components/FeeTable'

export default function ChildFees() {
  const { studentId } = useParams()
  const navigate = useNavigate()
  const [fees, setFees] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await parentService.getChildFees(studentId)
        setFees(res.data)
      } catch (err) {
        setError('Failed to load fees')
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [studentId])

  if (loading) return <Loading />
  if (error) return <ErrorMessage message={error} />

  const totalOutstanding = (fees || []).reduce((sum, f) => {
    const paid = f.amountPaid ?? f.paidAmount ?? 0
    const out = f.outstandingAmount ?? (f.totalAmount - paid)
    return sum + (out > 0 ? out : 0)
  }, 0)

  return (
    <div>
      <div className="page-header">
        <h1>Fee Details</h1>
        <button className="btn btn-secondary" onClick={() => navigate(`/parent/child/${studentId}`)}>← Back to Profile</button>
      </div>

      <div className="card" style={{ marginBottom: '24px' }}>
        <h3>Total Outstanding Balance</h3>
        <div style={{ fontSize: '32px', fontWeight: 'bold', color: totalOutstanding > 0 ? 'var(--danger)' : 'var(--success)', marginTop: '8px' }}>
          ₹{totalOutstanding.toLocaleString('en-IN')}
        </div>
      </div>

      <FeeTable fees={fees} />
    </div>
  )
}
