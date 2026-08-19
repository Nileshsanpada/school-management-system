import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useFetch } from '../../hooks/useFetch'
import studentService from '../../services/studentService'
import Loading from '../../components/Loading'
import ErrorMessage from '../../components/ErrorMessage'
import StudentTable from '../../components/StudentTable'

export default function StudentList() {
  const [search, setSearch] = useState('')
  const { data: students, loading, error } = useFetch(studentService.getAll)
  const navigate = useNavigate()

  if (loading) return <Loading />
  if (error) return <ErrorMessage message={error} />

  const filteredStudents = students?.filter(s => 
    s.firstName.toLowerCase().includes(search.toLowerCase()) || 
    s.lastName.toLowerCase().includes(search.toLowerCase()) ||
    s.studentId?.toLowerCase().includes(search.toLowerCase())
  ) || []

  return (
    <div>
      <div className="page-header">
        <h1>Students</h1>
        <div>
          <input 
            type="text" 
            placeholder="Search students..." 
            className="search-bar" 
            value={search} 
            onChange={e => setSearch(e.target.value)} 
          />
        </div>
      </div>

      <StudentTable students={filteredStudents} onView={(id) => navigate(`/students/${id}`)} />
    </div>
  )
}
