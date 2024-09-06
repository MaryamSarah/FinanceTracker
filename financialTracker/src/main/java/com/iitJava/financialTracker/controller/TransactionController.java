package com.iitJava.financialTracker.controller;

import com.iitJava.financialTracker.dtos.TransactionRequestDTO;
import com.iitJava.financialTracker.dtos.TransactionResponseDTO;
import com.iitJava.financialTracker.enums.TransactionType;
import com.iitJava.financialTracker.model.Transaction;
import com.iitJava.financialTracker.service.TransactionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.util.List;

@RestController
@RequestMapping("/transaction")
@Validated
@CrossOrigin
public class TransactionController {

    private static final DateTimeFormatter DATE_FORMATTER = DateTimeFormatter.ofPattern("yyyy-MM-dd");
    private static final DateTimeFormatter DATE_TIME_FORMATTER = DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm:ss");

    @Autowired
    private TransactionService transactionService;

    @GetMapping("/getAll")
    public List<TransactionResponseDTO> getAllTransactions() {
        return transactionService.getAllTransactions();
    }

    @PostMapping("/add")
    public ResponseEntity<Object> addTransaction(@Validated @RequestBody TransactionRequestDTO transactionRequestDTO) {
        transactionService.saveTransaction(transactionRequestDTO);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/update/{id}")
    public Transaction updateTransaction(@PathVariable Long id, @RequestBody TransactionRequestDTO transactionRequestDTO) {
        return transactionService.updateTransaction(id, transactionRequestDTO);
    }

    @DeleteMapping("/delete/{id}")
    public String deleteTransaction(@PathVariable Long id) {
        transactionService.deleteTransaction(id);
        return "Transaction deleted";
    }

    @GetMapping("/history")
    public List<TransactionResponseDTO> getTransactionHistory(
            @RequestParam(required = false) String startDate,
            @RequestParam(required = false) String endDate,
            @RequestParam(required = false) String type,
            @RequestParam(required = false) String category) {

        // Convert the string parameters to LocalDateTime and TransactionType
        LocalDateTime startDateTime = parseDateTime(startDate);
        LocalDateTime endDateTime = parseDateTime(endDate);
        TransactionType transactionType = type != null ? TransactionType.valueOf(type) : null;

        // Call the service method with the parameters
        return transactionService.getTransactionHistory(startDateTime, endDateTime, transactionType, category);
    }

    private LocalDateTime parseDateTime(String dateString) {
        if (dateString == null) {
            return null;
        }
        try {
            if (dateString.contains("T")) {
                return LocalDateTime.parse(dateString, DateTimeFormatter.ISO_DATE_TIME);
            } else {
                LocalDate date = LocalDate.parse(dateString, DateTimeFormatter.ISO_DATE);
                return date.atStartOfDay(); // Convert LocalDate to LocalDateTime at start of day
            }
        } catch (DateTimeParseException e) {
            throw new IllegalArgumentException("Invalid date format, please use yyyy-MM-dd or yyyy-MM-dd'T'HH:mm:ss");
        }
    }

    @GetMapping("/get/{id}")
    public ResponseEntity<TransactionResponseDTO> getTransactionById(@PathVariable Long id) {
        TransactionResponseDTO transaction=transactionService.getTransactionById(id);

        if(transaction!=null) {
            return ResponseEntity.ok().body(transaction);
        }else{
            return ResponseEntity.notFound().build();
        }
    }
}

