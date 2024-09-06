package com.iitJava.financialTracker.repository;

import com.iitJava.financialTracker.enums.TransactionType;
import com.iitJava.financialTracker.model.Transaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface TransactionRepository extends JpaRepository<Transaction, Long> {
    boolean existsByCategoryId(Long categoryId);


}
