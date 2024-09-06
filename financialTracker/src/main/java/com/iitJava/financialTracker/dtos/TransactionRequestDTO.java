package com.iitJava.financialTracker.dtos;

import com.fasterxml.jackson.annotation.JsonAnyGetter;
import com.iitJava.financialTracker.enums.TransactionType;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@Setter
public class TransactionRequestDTO {

    private BigDecimal amount;
    private String description;
    private LocalDateTime transactionDate;
    private TransactionType type;
    private String categoryName;
    private LocalDateTime startDate;
    private LocalDateTime endDate;
}
