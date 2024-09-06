package com.iitJava.financialTracker.service;

import com.iitJava.financialTracker.dtos.TransactionRequestDTO;
import com.iitJava.financialTracker.dtos.TransactionResponseDTO;
import com.iitJava.financialTracker.enums.TransactionType;
import com.iitJava.financialTracker.exceptions.ResourceNotFoundException;
import com.iitJava.financialTracker.model.Category;
import com.iitJava.financialTracker.model.Transaction;
import com.iitJava.financialTracker.repository.CategoryRepository;
import com.iitJava.financialTracker.repository.TransactionRepository;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.TypedQuery;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class TransactionServiceImpl implements TransactionService {

    @PersistenceContext
    private EntityManager entityManager;

    @Autowired
    private TransactionRepository transactionRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    @Override
    public List<TransactionResponseDTO> getAllTransactions() {
        List<Transaction> transactions = transactionRepository.findAll();
        return transactions.stream()
                .map(transaction -> new TransactionResponseDTO(
                        transaction.getId(),
                        transaction.getAmount(),
                        transaction.getDescription(),
                        transaction.getTransactionDate(),
                        transaction.getType(),
                        transaction.getCategory() != null ? transaction.getCategory().getName() : null
                ))
                .collect(Collectors.toList());
    }

    @Override
    public void saveTransaction(TransactionRequestDTO transactionRequestDTO) {
        Category category = categoryRepository.findByName(transactionRequestDTO.getCategoryName());
        if (category == null) {
            throw new RuntimeException("Category not found: " + transactionRequestDTO.getCategoryName());
        }

        Transaction transaction = new Transaction();
        transaction.setAmount(transactionRequestDTO.getAmount());
        transaction.setDescription(transactionRequestDTO.getDescription());
        transaction.setTransactionDate(transactionRequestDTO.getTransactionDate());
        transaction.setType(transactionRequestDTO.getType());
        transaction.setCategory(category);

        transactionRepository.save(transaction);
    }

    @Override
    public Transaction updateTransaction(Long id, TransactionRequestDTO transactionRequestDTO) {
        // Fetch the existing transaction from the repository
        Transaction existingTransaction = transactionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Transaction not found with id " + id));

        // Fetch the category based on the name provided in the DTO
        Category category = categoryRepository.findByName(transactionRequestDTO.getCategoryName());
        if (category == null) {
            throw new RuntimeException("Category not found: " + transactionRequestDTO.getCategoryName());
        }

        // Update the existing transaction with values from the DTO
        existingTransaction.setAmount(transactionRequestDTO.getAmount());
        existingTransaction.setDescription(transactionRequestDTO.getDescription());
        existingTransaction.setTransactionDate(transactionRequestDTO.getTransactionDate());
        existingTransaction.setType(transactionRequestDTO.getType());
        existingTransaction.setCategory(category);

        // Save the updated transaction
        return transactionRepository.save(existingTransaction);
    }

    @Override
    public void deleteTransaction(Long id) {
        if (transactionRepository.existsById(id)) {
            transactionRepository.deleteById(id);
        } else {
            throw new ResourceNotFoundException("Transaction not found with id " + id);
        }
    }

    public List<TransactionResponseDTO> getTransactionHistory(LocalDateTime startDate, LocalDateTime endDate, TransactionType type, String category) {
        // Build the query
        StringBuilder queryBuilder = new StringBuilder("SELECT t.id, t.amount, t.description, t.transactionDate, t.type, c.name FROM Transaction t JOIN t.category c WHERE 1=1");

        if (startDate != null) {
            queryBuilder.append(" AND t.transactionDate >= :startDate");
        }
        if (endDate != null) {
            queryBuilder.append(" AND t.transactionDate <= :endDate");
        }
        if (type != null) {
            queryBuilder.append(" AND t.type = :type");
        }
        if (category != null) {
            queryBuilder.append(" AND LOWER(c.name) = LOWER(:categoryName)");
        }

        // Create the query
        TypedQuery<Object[]> query = entityManager.createQuery(
                queryBuilder.toString(), Object[].class
        );

        // Set query parameters
        if (startDate != null) {
            query.setParameter("startDate", startDate);
        }
        if (endDate != null) {
            query.setParameter("endDate", endDate);
        }
        if (type != null) {
            query.setParameter("type", type);
        }
        if (category != null) {
            query.setParameter("categoryName", category);
        }

        // Execute the query and process results
        List<Object[]> results = query.getResultList();

        return results.stream()
                .map(result -> new TransactionResponseDTO(
                        (Long) result[0],                        // ID
                        (BigDecimal) result[1],                 // Amount
                        (String) result[2],                      // Description
                        (LocalDateTime) result[3],                // Transaction Date
                        (TransactionType) result[4],             // Type
                        (String) result[5]                       // Category Name
                ))
                .collect(Collectors.toList());
    }

    @Override
    public TransactionResponseDTO getTransactionById(Long id) {
        Transaction transaction=transactionRepository.findById(id).orElse(null);

        if (transaction == null) {
            return null;
        }

        // Convert the Transaction entity to TransactionResponseDTO
        return new TransactionResponseDTO(
                transaction.getId(),
                transaction.getAmount(),
                transaction.getDescription(),
                transaction.getTransactionDate(),
                transaction.getType(),
                transaction.getCategory() != null ? transaction.getCategory().getName() : null
        );

    }

}
