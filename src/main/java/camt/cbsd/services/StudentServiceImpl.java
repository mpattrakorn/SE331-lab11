package camt.cbsd.services;

import camt.cbsd.dao.StudentDao;
import camt.cbsd.entity.Student;
import camt.cbsd.repository.StudentRepository;
import org.apache.commons.io.FileUtils;
import org.apache.commons.io.FilenameUtils;
import org.hibernate.Hibernate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Service;

import javax.imageio.ImageIO;
import javax.transaction.Transactional;
import java.awt.*;
import java.awt.image.BufferedImage;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.List;



@Service
@ConfigurationProperties(prefix = "server")
public class StudentServiceImpl implements StudentService {

    @Autowired
    StudentDao studentDao;
    String imageServerDir;
    StudentRepository studentRepository;

    public void setImageServerDir(String imageServerDir) {
        this.imageServerDir = imageServerDir;
    }

    @Transactional
    public List<Student> getStudents(){
        List<Student> students = studentDao.getStudents();
        for(Student student:students){
            Hibernate.initialize(student.getEnrolledCourse());
        }
        return students;
    }

    @Override
    @Transactional
    public Student findById(long id) {
        Student student = studentDao.findById(id);
        Hibernate.initialize(student.getEnrolledCourse());
        return student;
    }

    @Override
    public Student addStudent(Student student) {
        return studentDao.addStudent(student);
    }

    @Override
    public Student addStudent(Student student, String imageFileName, BufferedImage image) throws IOException {
        // save file to the server
        int newId = studentDao.size()+1;
        String newFilename = newId +"."+ imageFileName;
        File targetFile = Files.createFile(Paths.get(imageServerDir+newFilename)).toFile();
        ImageIO.write(image,FilenameUtils.getExtension(imageFileName),targetFile);

        student.setImage(newFilename);
        studentDao.addStudent(student);
        return student;
    }

    @Override
    public Student findByUserUsername(String username) {
        return studentRepository.findByUserUsername(username);
    }

    @Transactional
    @Override
    public Student getStudentForTransfer(String username) {
        Student student = studentDao.findByUserUsername(username);
        Hibernate.initialize(student.getAuthorities());
        return student;
    }
}
