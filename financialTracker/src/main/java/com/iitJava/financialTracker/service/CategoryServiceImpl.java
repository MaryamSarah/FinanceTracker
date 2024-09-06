package com.iitJava.financialTracker.service;

import com.iitJava.financialTracker.exceptions.ResourceNotFoundException;
import com.iitJava.financialTracker.model.Category;
import com.iitJava.financialTracker.repository.CategoryRepository;
import com.iitJava.financialTracker.repository.TransactionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CategoryServiceImpl implements CategoryService {

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private TransactionRepository transactionRepository;

    @Override
    public List<Category> getAllCategories() {
        return categoryRepository.findAll();
    }

    public Category saveCategory(Category category) {
        try {
            return categoryRepository.save(category);
        } catch (DataIntegrityViolationException e) {
            // Handle the exception, such as logging or returning an error response
            throw new RuntimeException("Category name must be unique", e);
        }
    }

    @Override
    public Category updateCategory(Category category) {
        return categoryRepository.save(category);
    }

    @Override
    public void deleteCategory(Long id) {
        if (categoryRepository.existsById(id)) {
            categoryRepository.deleteById(id);
        } else {
            throw new ResourceNotFoundException("Category not found with id " + id);
        }
    }

    @Override
    public Category getCategoryById(Long id) {
        // Assuming you have a method in the repository to find by ID
        Category category = categoryRepository.findById(id).orElse(null);

        if (category == null) {
            return null; // Handle the case where transaction is not found
        }

        // Convert the Transaction entity to TransactionResponseDTO
        return new Category(
                category.getId(),
                category.getName(),
                category.getType()
        );
    }

    @Override
    public boolean isCategoryUsedInTransactions(Long categoryId) {
        return transactionRepository.existsByCategoryId(categoryId);
    }

}
