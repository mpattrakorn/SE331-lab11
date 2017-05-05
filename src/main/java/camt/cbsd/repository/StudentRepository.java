package camt.cbsd.repository;

import camt.cbsd.entity.Student;
import org.springframework.data.repository.CrudRepository;

/**
 * Created by Dto on 07-Apr-17.
 */
public interface StudentRepository extends CrudRepository <Student,Long> {
    Student findById(Long id);
    Student findByUserUsername(String username);
}
