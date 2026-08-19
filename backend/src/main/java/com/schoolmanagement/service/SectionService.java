package com.schoolmanagement.service;

import com.schoolmanagement.entity.AcademicYear;
import com.schoolmanagement.entity.SchoolClass;
import com.schoolmanagement.entity.Section;
import com.schoolmanagement.repository.AcademicYearRepository;
import com.schoolmanagement.repository.ClassRepository;
import com.schoolmanagement.repository.SectionRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SectionService {

    private static final Logger logger = LoggerFactory.getLogger(SectionService.class);

    private final SectionRepository sectionRepository;
    private final ClassRepository classRepository;
    private final AcademicYearRepository academicYearRepository;

    public SectionService(SectionRepository sectionRepository, ClassRepository classRepository, AcademicYearRepository academicYearRepository) {
        this.sectionRepository = sectionRepository;
        this.classRepository = classRepository;
        this.academicYearRepository = academicYearRepository;
    }

    public List<Section> getAllSections() {
        return sectionRepository.findAll();
    }

    public Section getSectionById(Long id) {
        return sectionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Section not found with id: " + id));
    }

    public List<Section> getSectionsByClassId(Long classId) {
        return sectionRepository.findBySchoolClassId(classId);
    }

    public Section createSection(Section section, Long classId, Long academicYearId) {
        SchoolClass schoolClass = classRepository.findById(classId)
                .orElseThrow(() -> new RuntimeException("Class not found"));
        AcademicYear academicYear = academicYearRepository.findById(academicYearId)
                .orElseThrow(() -> new RuntimeException("Academic Year not found"));
        
        section.setSchoolClass(schoolClass);
        section.setAcademicYear(academicYear);
        return sectionRepository.save(section);
    }

    public void deleteSection(Long id) {
        Section existing = getSectionById(id);
        sectionRepository.delete(existing);
    }
}
