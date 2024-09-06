package com.iitJava.financialTracker.service;

import com.iitJava.financialTracker.dtos.TransactionRequestDTO;
import com.iitJava.financialTracker.dtos.TransactionResponseDTO;
import com.iitJava.financialTracker.enums.TransactionType;
import com.iitJava.financialTracker.model.Transaction;

import java.time.LocalDateTime;
import java.util.List;

public interface TransactionService {

    public List<TransactionResponseDTO> getAllTransactions();

    public void saveTransaction(TransactionRequestDTO transaction);

    public Transaction updateTransaction(Long id, TransactionRequestDTO transactionRequestDTO);

    public void deleteTransaction(Long id);

    List<TransactionResponseDTO> getTransactionHistory(LocalDateTime startDate, LocalDateTime endDate, TransactionType type, String category);

    public TransactionResponseDTO getTransactionById(Long id);

}
