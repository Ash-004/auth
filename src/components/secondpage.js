import React, { useState, useEffect } from 'react';
import './expense.css';
import Modal from 'react-modal';
import './modal.css';
import { initializeApp } from 'firebase/app';
import {
    getFirestore,
    collection,
    doc,
    getDoc,
    updateDoc,
    setDoc,
} from 'firebase/firestore';

const ExpenseTracker = () => {
    const [transactions, setTransactions] = useState([]);
    const [description, setDescription] = useState('');
    const [amount, setAmount] = useState('');
    const [category, setCategory] = useState('');
    const [totalIncome, setTotalIncome] = useState(0);
    const [totalExpense, setTotalExpense] = useState(0);
    const [totalBalance, setTotalBalance] = useState(0);
    const [errorMessage, setErrorMessage] = useState('');
    const [showPopup, setShowPopup] = useState(false);
    const [currentPage, setCurrentPage] = useState('expense');// 'expense' or 'income'
    const[bload,setbLoad]=useState(0)


    const categories = {
        expense: [
            'Food and Beverages',
            'Transportation',
            'Rent',
            'Bills',
            'Home Maintenance',
            'Vehicle Maintenance',
            'Medical Check Up',
            'Insurances',
            'Education',
            'Houseware',
            'Personal Items',
            'Pets',
            'Home Services',
            'Fitness',
            'Makeup',
            'Gifts and Donations',
            'Streaming Service',
            'Fun Money',
            'Investment',
            'Pay Interest',
            'Outgoing Transfer',
        ],
        income: [
            'Business',
            'Salary',
            'Incoming Transfer',
            'Investment Returns',
            'Other',
        ],
    };

    const firebaseConfig = {
        apiKey: "AIzaSyD6CgIbX4j1eWr5BEO_3Tm3V8LJaDVOH0k",
        authDomain: "savvyexpensetracker-47bf4.firebaseapp.com",
        projectId: "savvyexpensetracker-47bf4",
        storageBucket: "savvyexpensetracker-47bf4.appspot.com",
        messagingSenderId: "1013426303723",
        appId: "1:1013426303723:web:44751608852b062b8204ae",
        measurementId: "G-H2TGEDCHJP"
    };

    initializeApp(firebaseConfig);
    const firestore = getFirestore();

    const addTransaction = async (e) => {
        e.preventDefault();

        if (category === '' || amount.trim() === '') {
            setErrorMessage('Please select a category and enter the amount.');
            return;
        }

        let newAmount = parseFloat(amount);
        if (categories.expense.includes(category)) {
            newAmount *= -1; // Multiply by -1 to subtract
        }

        const newTransaction = {
            description: category,
            amount: newAmount,
        };

        const categoryPath = currentPage === 'expense' ? 'expense' : 'income';
        const categoryRef = doc(firestore, `test/${categoryPath}`);
        const categorySnapshot = await getDoc(categoryRef);

        if (categorySnapshot.exists()) {
            const categoryData = categorySnapshot.data();
            const currentTotal = categoryData.total || 0;
            const newTotal = currentTotal + newAmount;

            await updateDoc(categoryRef, { total: newTotal });
        } else {
            await setDoc(categoryRef, { total: newAmount });
        }

        setTransactions([...transactions, newTransaction]);
        setDescription('');
        setAmount('');
        setCategory('');
        setErrorMessage('');
        setShowPopup(false);
    };

    useEffect(() => {
        calculateTotals();
        getBal();
    }, [transactions]);

    useEffect(() =>{
        setbLoad(1);
        },
        []);

    const calculateTotals = async () => {
        let income = 0;
        let expense = 0;

        for (let i = 0; i < transactions.length; i++) {
            if (transactions[i].amount > 0) {
                income += transactions[i].amount;
            } else {
                expense += transactions[i].amount;
            }
        }

        setTotalIncome(income);
        setTotalExpense(expense);
        // Update total balance in Firestore
        const balanceRef = doc(firestore, 'test/balance');
        const balanceSnapshot = await getDoc(balanceRef);

        if (balanceSnapshot.exists() && bload != 0) {
            await updateDoc(balanceRef, { total: income + expense });
            getBal();




        // } else {
        //     await setDoc(balanceRef, { total: income + expense });
        //     getBal();
        //     console.log("elsegetbal")
        //     console.log(totalBalance)



        }
    };
const getBal = async() =>{
    const balanceRef = doc(firestore, 'test/balance');
    const balanceSnapshot = await getDoc(balanceRef);
    const balanceData = balanceSnapshot.data();
    const currentBalance = balanceData.total || 0;
    setTotalBalance(currentBalance);

    const incRef = doc(firestore, 'test/income');
    const incSnapshot = await getDoc(incRef);
    const incData = incSnapshot.data();
    const incBalance = incData.total || 0;
    setTotalIncome(incBalance)

    const expRef = doc(firestore, 'test/expense');
    const expSnapshot = await getDoc(expRef);
    const expData = expSnapshot.data();
    const expBalance = expData.total || 0;
    setTotalExpense(expBalance);


}
    const renderCategories = () => {
        if (currentPage === 'expense') {
            return (
                <div className="category-group">
                    <h4>Expense</h4>
                    {categories.expense.map((category, index) => (
                        <button
                            key={index}
                            className={`category-item ${
                                category === category ? 'active' : ''
                            }`}
                            onClick={() => {
                                setCategory(category);
                                setShowPopup(false);
                            }}
                        >
                            {category}
                        </button>
                    ))}
                </div>
            );
        } else if (currentPage === 'income') {
            return (
                <div className="category-group">
                    <h4>Income</h4>
                    {categories.income.map((category, index) => (
                        <button
                            key={index}
                            className={`category-item ${
                                category === category ? 'active' : ''
                            }`}
                            onClick={() => {
                                setCategory(category);
                                setShowPopup(false);

                            }}
                        >
                            {category}
                        </button>
                    ))}
                </div>
            );
        }
    };


    return (
        <div className="container">
            <form onSubmit={addTransaction} className="form">
                <div className="form-group">
                    <div className="balance">
                        <h3>Your Balance:</h3>
                        <span>
              {totalBalance < 0 ? '-' : ''}₹{Math.abs(totalBalance)}
            </span>
                    </div>
                    <button
                        type="button"
                        className="category-btn"
                        onClick={() => setShowPopup(true)}
                    >
                        {category ? category : 'Select Category'}
                    </button>
                </div>
                <Modal
                    isOpen={showPopup}
                    onRequestClose={() => setShowPopup(false)}
                    contentLabel="Select a Category"
                    className="popup"
                    overlayClassName="overlay"
                >
                    <div className="category-nav">
                        <button
                            className={`category-nav-item ${
                                currentPage === 'expense' ? 'active' : ''
                            }`}
                            onClick={() => setCurrentPage('expense')}
                        >
                            Expense
                        </button>
                        <button
                            className={`category-nav-item ${
                                currentPage === 'income' ? 'active' : ''
                            }`}
                            onClick={() => setCurrentPage('income')}
                        >
                            Income
                        </button>
                    </div>
                    <div className="popup-content">
                        <div className="category-list">{renderCategories()}</div>
                    </div>
                </Modal>
                <div className="amount-input">
                    <label htmlFor="amount">Amount</label>
                    <input
                        type="number"
                        id="amount"
                        placeholder="Enter amount"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                    />
                </div>
                {errorMessage && <p className="error">{errorMessage}</p>}
                <button type="submit" className="btn">
                    Add Transaction
                </button>
            </form>
            <div className="summary">
                <div className="summary-item">
                    <h3>Income:</h3>
                    <span
                        className={`summary-amount ${totalIncome > 0 ? 'green' : 'black'}`}
                    >
            ₹{totalIncome}
          </span>
                </div>
                <div className="summary-item">
                    <h3>Expense:</h3>
                    <span
                        className={`summary-amount ${
                            totalExpense < 0 ? 'red' : 'black'
                        }`}
                    >
            {totalExpense < 0 && '-'}₹{Math.abs(totalExpense)}
          </span>
                </div>
            </div>
            <div className="summary-item">
                <ul className="transaction-list">
                    <h3>History</h3>
                    {transactions.map((transaction, index) => (
                        <li key={index} className="transaction-item">
                            <div className="transaction-description">
                                {transaction.description}
                            </div>
                            <div className="transaction-amount">
                <span
                    className={`amount-text ${
                        transaction.amount > 0 ? 'income' : 'expense'
                    }`}
                >
                  {transaction.amount >= 0 ? '₹' : '-₹'}
                    {Math.abs(transaction.amount)}
                </span>
                            </div>
                            {index !== transactions.length - 1 && (
                                <hr className="transaction-line" />
                            )}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default ExpenseTracker;