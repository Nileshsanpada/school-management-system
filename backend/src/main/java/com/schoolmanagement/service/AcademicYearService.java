package com.schoolmanagement.service;

import com.schoolmanagement.entity.AcademicYear;
import com.schoolmanagement.repository.AcademicYearRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AcademicYearService {

    private static final Logger logger = LoggerFactory.getLogger(AcademicYearService.class);
    
    private final AcademicYearRepository academicYearRepository;

    public AcademicYearService(AcademicYearRepository academicYearRepository) {
        this.academicYearRepository = academicYearRepository;
    }

    public List<AcademicYear> getAllAcademicYears() {
        return academicYearRepository.findAll();
    }

    public AcademicYear getAcademicYearById(Long id) {
        return academicYearRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("AcademicYear not found with id: " + id));
    }

    public AcademicYear createAcademicYear(AcademicYear academicYear) {
        return academicYearRepository.save(academicYear);
    }

    public AcademicYear updateAcademicYear(Long id, AcademicYear updated) {
        AcademicYear existing = getAcademicYearById(id);
        existing.setName(updated.getName());
        existing.setStartDate(updated.getStartDate());
        existing.setEndDate(updated.getEndDate());
        existing.setActive(updated.getActive());
        return academicYearRepository.save(existing);
    }

    public void deleteAcademicYear(Long id) {
        AcademicYear existing = getAcademicYearById(id);
        academicYearRepository.delete(existing);
    }

    public AcademicYear getActiveAcademicYear() {
        return academicYearRepository.findByActiveTrue()
                .orElseThrow(() -> new RuntimeException("No active academic year found"));
    }
}
