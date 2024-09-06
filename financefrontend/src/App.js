import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import Signup from "./components/Signup";
import Login from './components/Login';
import LandingPage from './components/LandingPage';
import Dashboard from "./components/Dashboard";
import Transactions from "./components/Transactions";
import Categories from "./components/Categories";
import { CustomThemeProvider } from './components/ThemeContext'; // Import CustomThemeProvider
import EditTransaction from './components/EditTransaction';
import AddTransaction from './components/AddTransaction';
import TransactionHistory from './components/TransactionHistory';
import AddCategory from './components/AddCategory';
import EditCategory from './components/EditCategory';

function App() {
  return (
    <Router>
      <CustomThemeProvider> {/* Wrap the entire app with CustomThemeProvider */}
        <div className="App">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/transactions" element={<Transactions />} />
            <Route path="/categories" element={<Categories />} />
            <Route path="/transaction/history" element={<TransactionHistory />} />
            <Route path="/transaction/update/:id" element={<EditTransaction />} />
            <Route path="/transaction/add" element={<AddTransaction />} />
            <Route path="/category/add" element={<AddCategory />} />
            <Route path="/category/update/:id" element={<EditCategory />} />
          </Routes>
        </div>
      </CustomThemeProvider>
    </Router>
  );
}

export default App;
