package com.iitJava.financialTracker.service;

import com.iitJava.financialTracker.model.Category;
import com.iitJava.financialTracker.repository.CategoryRepository;
import com.iitJava.financialTracker.repository.TransactionRepository;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.List;

public interface CategoryService {

    public List<Category> getAllCategories();

    public Category saveCategory(Category category);

    public Category updateCategory(Category category);

    public void deleteCategory(Long id);

    public Category getCategoryById(Long id);

    public boolean isCategoryUsedInTransactions(Long categoryId);
}
