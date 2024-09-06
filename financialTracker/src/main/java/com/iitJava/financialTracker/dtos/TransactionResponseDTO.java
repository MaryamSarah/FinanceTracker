package com.iitJava.financialTracker.dtos;

import com.iitJava.financialTracker.enums.TransactionType;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@Getter
@Setter
public class TransactionResponseDTO {

    private Long id;
    private BigDecimal amount;
    private String description;
    private String transactionDate;
    private TransactionType type;
    private String categoryName;

    // Constructors
    public TransactionResponseDTO() {}

    public TransactionResponseDTO(Long id, BigDecimal amount, String description, LocalDateTime transactionDate, TransactionType type, String categoryName) {
        this.id = id;
        this.amount = amount;
        this.description = description;
        this.transactionDate = transactionDate.format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"));
        this.type = type;
        this.categoryName = categoryName;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public BigDecimal getAmount() {
        return amount;
    }

    public void setAmount(BigDecimal amount) {
        this.amount = amount;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getTransactionDate() {
        return transactionDate;
    }

    public void setTransactionDate(String transactionDate) {
        this.transactionDate = transactionDate;
    }

    public TransactionType getType() {
        return type;
    }

    public void setType(TransactionType type) {
        this.type = type;
    }

    public String getCategoryName() {
        return categoryName;
    }

    public void setCategoryName(String categoryName) {
        this.categoryName = categoryName;
    }
}
