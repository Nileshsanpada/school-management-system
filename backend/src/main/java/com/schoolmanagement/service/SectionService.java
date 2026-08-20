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
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional(readOnly = true)
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

    @Transactional
    public Section createSection(Section section, Long classId, Long academicYearId) {
        SchoolClass schoolClass = classRepository.findById(classId)
                .orElseThrow(() -> new RuntimeException("Class not found for ID: " + classId));
        
        AcademicYear academicYear;
        if (academicYearId != null) {
            academicYear = academicYearRepository.findById(academicYearId)
                    .orElseThrow(() -> new RuntimeException("Academic Year not found for ID: " + academicYearId));
        } else {
            academicYear = academicYearRepository.findByActiveTrue()
                    .orElseGet(() -> academicYearRepository.findAll().stream().findFirst()
                            .orElseThrow(() -> new RuntimeException("No academic year found. Please create one first.")));
        }
        
        section.setSchoolClass(schoolClass);
        section.setAcademicYear(academicYear);
        return sectionRepository.save(section);
    }

    @Transactional
    public void deleteSection(Long id) {
        Section existing = getSectionById(id);
        sectionRepository.delete(existing);
    }
}
