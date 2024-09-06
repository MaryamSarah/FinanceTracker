package com.iitJava.financialTracker.controller;

import com.iitJava.financialTracker.dtos.TransactionResponseDTO;
import com.iitJava.financialTracker.exceptions.ResourceNotFoundException;
import com.iitJava.financialTracker.model.Category;
import com.iitJava.financialTracker.service.CategoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/category")
@Validated
@CrossOrigin
public class CategoryController {

    @Autowired
    private CategoryService categoryService;

    @GetMapping("/getAll")
    public List<Category> getAllCategories() {
        return categoryService.getAllCategories();
    }

    @PostMapping("/add")
    public ResponseEntity<Object> addCategory(@Validated @RequestBody Category category) {
        categoryService.saveCategory(category);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<?> updateCategory(@PathVariable Long id, @RequestBody Category category) {
        // Check if the category is used in any transaction
        if (categoryService.isCategoryUsedInTransactions(id)) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Cannot edit category as it is used in one or more transactions.");
        }

        category.setId(id);
        Category updatedCategory = categoryService.updateCategory(category);
        return ResponseEntity.ok(updatedCategory);
    }


    @DeleteMapping("/delete/{id}")
    public ResponseEntity<String> deleteCategory(@PathVariable Long id) {
        try {
            categoryService.deleteCategory(id);
            return new ResponseEntity<>("Category deleted", HttpStatus.OK);
        } catch (DataIntegrityViolationException e) {
            return new ResponseEntity<>("Cannot delete category because it has associated transactions", HttpStatus.CONFLICT);
        } catch (ResourceNotFoundException e) {
            return new ResponseEntity<>("Category not found", HttpStatus.NOT_FOUND);
        }
    }

    @GetMapping("/get/{id}")
    public ResponseEntity<Category> getCategoryById(@PathVariable Long id) {
        Category category=categoryService.getCategoryById(id);

        if(category!=null) {
            return ResponseEntity.ok().body(category);
        }else{
            return ResponseEntity.notFound().build();
        }
    }

}
