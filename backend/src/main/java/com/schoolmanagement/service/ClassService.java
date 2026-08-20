package com.schoolmanagement.service;

import com.schoolmanagement.entity.SchoolClass;
import com.schoolmanagement.repository.ClassRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class ClassService {

    private static final Logger logger = LoggerFactory.getLogger(ClassService.class);

    private final ClassRepository classRepository;

    public ClassService(ClassRepository classRepository) {
        this.classRepository = classRepository;
    }

    public List<SchoolClass> getAllClasses() {
        List<SchoolClass> list = new ArrayList<>(classRepository.findAll());
        list.sort((a, b) -> {
            int numA = extractClassNumber(a.getName());
            int numB = extractClassNumber(b.getName());
            if (numA != numB) {
                return Integer.compare(numA, numB);
            }
            return a.getName().compareToIgnoreCase(b.getName());
        });
        return list;
    }

    private int extractClassNumber(String name) {
        if (name == null) return 999;
        String digits = name.replaceAll("\\D+", "");
        try {
            return digits.isEmpty() ? 999 : Integer.parseInt(digits);
        } catch (NumberFormatException e) {
            return 999;
        }
    }

    public SchoolClass getClassById(Long id) {
        return classRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Class not found with id: " + id));
    }

    public SchoolClass createClass(SchoolClass schoolClass) {
        return classRepository.save(schoolClass);
    }

    public SchoolClass updateClass(Long id, SchoolClass updated) {
        SchoolClass existing = getClassById(id);
        existing.setName(updated.getName());
        return classRepository.save(existing);
    }

    public void deleteClass(Long id) {
        SchoolClass existing = getClassById(id);
        classRepository.delete(existing);
    }
}
