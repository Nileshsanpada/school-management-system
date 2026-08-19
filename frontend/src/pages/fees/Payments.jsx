import { useState } from 'react'
import { useFetch } from '../../hooks/useFetch'
import academicService from '../../services/academicService'
import studentService from '../../services/studentService'
import feeService from '../../services/feeService'
import paymentService from '../../services/paymentService'
import Loading from '../../components/Loading'
import ErrorMessage from '../../components/ErrorMessage'
import { formatDate } from '../../utils/formatDate'

export default function Payments() {
  const { data: classes } = useFetch(academicService.classes.getAll)
  const [classId, setClassId] = useState('')
  const [students, setStudents] = useState([])
  const [studentId, setStudentId] = useState('')
  const [fees, setFees] = useState([])
  const [feeId, setFeeId] = useState('')
  
  const [amount, setAmount] = useState('')
  const [paymentMethod, setPaymentMethod] = useState('CASH')
  const [transactionReference, setTransactionReference] = useState('')
  
  const [payments, setPayments] = useState([])
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleClassChange = async (e) => {
    const cid = e.target.value
    setClassId(cid)
    if (cid) {
      try {
        const res = await studentService.getByClass(cid)
        setStudents(res.data)
      } catch (err) {
        setStudents([])
      }
    }
  }

  const loadStudentData = async (sid = studentId) => {
    if (!sid) return
    try {
      const [fRes, pRes] = await Promise.all([
        feeService.getByStudent(sid),
        paymentService.getByStudent(sid)
      ])
      setFees(fRes.data.filter(f => f.status !== 'PAID'))
      setPayments(pRes.data)
    } catch (err) {
      console.error(err)
    }
  }

  const handleStudentChange = (e) => {
    setStudentId(e.target.value)
    loadStudentData(e.target.value)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    try {
      await paymentService.create({
        feeId,
        amount: Number(amount),
        paymentMethod,
        transactionReference
      })
      setSuccess('Payment recorded successfully')
      setAmount('')
      setTransactionReference('')
      setFeeId('')
      loadStudentData()
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to record payment')
    }
  }

  return (
    <div>
      <div className="page-header">
        <h1>Record Payment</h1>
      </div>

      <div className="card" style={{ marginBottom: '24px' }}>
        <ErrorMessage message={error} />
        {success && <div className="status-badge active" style={{ padding: '12px', marginBottom: '16px', display: 'block' }}>{success}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label>Class</label>
              <select value={classId} onChange={handleClassChange}>
                <option value="">Select Class</option>
                {classes?.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>Student</label>
              <select value={studentId} onChange={handleStudentChange} required>
                <option value="">Select Student</option>
                {students?.map(s => <option key={s.id} value={s.id}>{s.firstName} {s.lastName}</option>)}
              </select>
            </div>
          </div>
          
          <div className="form-group">
            <label>Select Fee</label>
            <select value={feeId} onChange={e => setFeeId(e.target.value)} required disabled={!studentId}>
              <option value="">Select Unpaid Fee</option>
              {fees?.map(f => (
                <option key={f.id} value={f.id}>
                  {f.academicYearName} - Balance: ${f.totalAmount - f.paidAmount} (Total: ${f.totalAmount})
                </option>
              ))}
            </select>
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label>Amount</label>
              <input type="number" step="0.01" value={amount} onChange={e => setAmount(e.target.value)} required />
            </div>
            <div className="form-group">
              <label>Payment Method</label>
              <select value={paymentMethod} onChange={e => setPaymentMethod(e.target.value)}>
                <option value="CASH">Cash</option>
                <option value="UPI">UPI</option>
                <option value="CARD">Card</option>
                <option value="BANK_TRANSFER">Bank Transfer</option>
              </select>
            </div>
          </div>
          
          <div className="form-group">
            <label>Transaction Reference (Optional)</label>
            <input type="text" value={transactionReference} onChange={e => setTransactionReference(e.target.value)} />
          </div>
          
          <button type="submit" className="btn btn-primary" disabled={!feeId || !amount}>Record Payment</button>
        </form>
      </div>

      {studentId && payments.length > 0 && (
        <div className="card" style={{ overflowX: 'auto' }}>
          <h3 style={{ marginBottom: '16px' }}>Payment History</h3>
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Amount</th>
                <th>Method</th>
                <th>Reference</th>
              </tr>
            </thead>
            <tbody>
              {payments.map(p => (
                <tr key={p.id}>
                  <td>{formatDate(p.paymentDate)}</td>
                  <td>${p.amount}</td>
                  <td>{p.paymentMethod}</td>
                  <td>{p.transactionReference || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
