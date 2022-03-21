'use strict';

/*
    1. Be able to record expenses and income
    2. Be able to set the date for an entry
    3. Be able to tag the entries to categorize them
    4. Be able to see a monthly overview of expenses and income
    5. Be able to see net worth
    6. Be able to visualize the expenses and incomes through graphs
    7. Be able to select date ranges, eg.: previous month, or year to date
    8. Use localStorage to save all the data
*/

const tableBodyElement = document.querySelector('.financial-table-body');

const incomeInputContainer = document.querySelector("#income-input-container");
const expenseInputContainer = document.querySelector("#expense-input-container");

const totalIncomeHeader = document.querySelector('#total-income');
const totalExpenseHeader = document.querySelector('#total-expense');
const totalBalanceHeader = document.querySelector('#total-balance');

reloadHtmlTable();

incomeInputContainer.querySelector(".submit-button").addEventListener('click', () => {

    const incomeName = incomeInputContainer.querySelector('#income-name');
    const incomeAmount = incomeInputContainer.querySelector('#income-amount');
    const incomeDate = incomeInputContainer.querySelector('#income-date');
    const incomeCategory = incomeInputContainer.querySelector('#income-category');

    if (validateInput(incomeName) === false) return;
    if (validateInput(incomeAmount) === false) return;
    if (validateInput(incomeDate) === false) return;

    const incomeObj = createIncomeReport(incomeName.value, incomeAmount.value, incomeDate.value, incomeCategory.value);
    saveIncomeToLocalStorage(incomeObj);

    reloadHtmlTable();
})

expenseInputContainer.querySelector(".submit-button").addEventListener('click', () => {

    const expenseName = expenseInputContainer.querySelector('#expense-name');
    const expenseAmount = expenseInputContainer.querySelector('#expense-amount');
    const expenseDate = expenseInputContainer.querySelector('#expense-date');
    const expenseCategory = expenseInputContainer.querySelector('#expense-category');

    if (validateInput(expenseName) === false) return;
    if (validateInput(expenseAmount) === false) return;
    if (validateInput(expenseDate) === false) return;

    const expenseObj = createExpenseReport(expenseName.value, expenseAmount.value, expenseDate.value, expenseCategory.value);
    saveExpenseToLocalStorage(expenseObj);

    reloadHtmlTable();
})

function validateInput (inputElement) 
{
    if  (inputElement.value == '') 
    {
        alert('Please fill out every input');
        return false;
    }
}

function createIncomeReport (name, amount, date, category)
{
    function IncomeReport () 
    {
        this.id = Math.round(Math.random() * 1000000);
        this.name = name,
        this.amount = Number(amount),
        this.date = date,
        this.category = category
    }

    const incomeObj = new IncomeReport();
    return incomeObj;
}

function createExpenseReport (name, amount, date, category)
{
    function ExpenseReport () 
    {
        this.id = Math.round(Math.random() * 1000000);
        this.name = name,
        this.amount = Number(-amount),
        this.date = date,
        this.category = category
    }

    const expenseObj = new ExpenseReport();
    return expenseObj;
}

function saveIncomeToLocalStorage(incomeObj)
{   
    
    // JSON.stringify() to send to localStorage in JSON string format
    // JSON.parse() to retrieve from localStorage in original format

    if (localStorage.getItem('Income Reports') === null)
    {
        const incomeReports = [];
        incomeReports.push(incomeObj);
        
        const jsonArray = JSON.stringify(incomeReports);
        localStorage.setItem('Income Reports', jsonArray);
    }
    else 
    {
        const incomeReports = getIncomeReports();

        incomeReports.push(incomeObj);

        const jsonArrayUpdated = JSON.stringify(incomeReports);
        localStorage.setItem('Income Reports', jsonArrayUpdated);
    }
    
}

function saveExpenseToLocalStorage(expenseObj)
{   
    
    // JSON.stringify() to send to localStorage in JSON string format
    // JSON.parse() to retrieve from localStorage in original format

    if (localStorage.getItem('Expense Reports') === null)
    {
        const expenseReports = [];
        expenseReports.push(expenseObj);
        
        const jsonArray = JSON.stringify(expenseReports);
        localStorage.setItem('Expense Reports', jsonArray);
    }
    else 
    {
        const expenseReports = getExpenseReports();
        expenseReports.push(expenseObj);

        const jsonArrayUpdated = JSON.stringify(expenseReports);
        localStorage.setItem('Expense Reports', jsonArrayUpdated);
    }
    
}

function reloadHtmlTable ()
{
    clearTableBody();
    let totalExpense = 0;
    let totalIncome = 0;
    let totalBalance = 0;

    if (localStorage.getItem('Expense Reports'))
    {

        (function () {

            const expenseReports = getExpenseReports();
        
            expenseReports.forEach((expenseReport) => {

                totalExpense += expenseReport.amount;
               
                addTableData(expenseReport);

            })

            totalExpenseHeader.textContent = "Expense: " + totalExpense;
    
        })();

    }

    if (localStorage.getItem('Income Reports'))
    {

        (function () {

            const incomeReports = getIncomeReports();
        
            incomeReports.forEach((incomeReport) => {
                
                totalIncome += incomeReport.amount;

                addTableData(incomeReport);

            })

            totalIncomeHeader.textContent = "Income: " + totalIncome;
    
        })();

    }

    totalBalance = totalIncome + totalExpense;
    totalBalanceHeader.textContent = "Balance: " + totalBalance;

}

const tableDate = document.querySelector('#table-date');

tableDate.addEventListener('change', filterTableByDate);

function filterTableByDate ()
{
    // If no date value show every report
    // If date value is set show only reports according to the date
    
    if (tableDate.value === '')
    {
        reloadHtmlTable();
    }
    else
    {
        clearTableBody();

        const incomeReports = getIncomeReports();
        const expenseReports = getExpenseReports();

        let totalIncome = 0;
        let totalExpense = 0;
        let totalBalance = 0;

        incomeReports.forEach((incomeReport) => {
            
            if (incomeReport.date === tableDate.value)
            {
                addTableData(incomeReport);
                totalIncome += incomeReport.amount;
            }

        })

        expenseReports.forEach((expenseReport) => {
            
            if (expenseReport.date === tableDate.value)
            {
                addTableData(expenseReport);
                totalExpense += expenseReport.amount;
            }

        })

        totalBalance = totalExpense + totalIncome;

        totalIncomeHeader.textContent = "Income: " + totalIncome;
        totalExpenseHeader.textContent = "Expense: " + totalExpense;
        totalBalanceHeader.textContent = "Balance: " + totalBalance;
    }
    
}

function addTableData (report)
{
    const tableRow = document.createElement('tr');
        
    tableRow.innerHTML = `
    <td>${report.name}</td>
    <td>${report.amount}$</td>
    <td>${report.date}</td>
    <td class="hide-mobile">${report.category}</td>`;

    tableBodyElement.appendChild(tableRow);
}

function clearTableBody () 
{
    tableBodyElement.innerHTML = '';
}

function getExpenseReports ()
{
    const jsonArray = localStorage.getItem('Expense Reports');
    const expenseReports = JSON.parse(jsonArray);

    return expenseReports;
}

function getIncomeReports ()
{
    const jsonArray = localStorage.getItem('Income Reports');
    const incomeReports = JSON.parse(jsonArray);

    return incomeReports;
}
