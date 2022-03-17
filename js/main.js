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

reloadHtmlTable();

const incomeInputContainer = document.querySelector("#income-input-container");
const expenseInputContainer = document.querySelector("#expense-input-container");

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
    const expenseCategory = incomeInputContainer.querySelector('#expense-category');

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
        this.amount = amount,
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
        this.amount = amount,
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
        const incomeReportsGrouped = [];
        incomeReportsGrouped.push(incomeObj);
        
        const jsonArray = JSON.stringify(incomeReportsGrouped);
        localStorage.setItem('Income Reports', jsonArray);
    }
    else 
    {
        const jsonArray = localStorage.getItem('Income Reports');
        const incomeReportsGrouped = JSON.parse(jsonArray);

        incomeReportsGrouped.push(incomeObj);

        const jsonArrayUpdated = JSON.stringify(incomeReportsGrouped);
        localStorage.setItem('Income Reports', jsonArrayUpdated);
    }
    
}

function saveExpenseToLocalStorage(expenseObj)
{   
    
    // JSON.stringify() to send to localStorage in JSON string format
    // JSON.parse() to retrieve from localStorage in original format

    if (localStorage.getItem('Expense Reports') === null)
    {
        const expenseReportsGrouped = [];
        expenseReportsGrouped.push(expenseObj);
        
        const jsonArray = JSON.stringify(expenseReportsGrouped);
        localStorage.setItem('Expense Reports', jsonArray);
    }
    else 
    {
        const jsonArray = localStorage.getItem('Expense Reports');
        const expenseReportsGrouped = JSON.parse(jsonArray);

        expenseReportsGrouped.push(expenseObj);

        const jsonArrayUpdated = JSON.stringify(expenseReportsGrouped);
        localStorage.setItem('Expense Reports', jsonArrayUpdated);
    }
    
}

function reloadHtmlTable ()
{
    const tableBodyElement = document.querySelector('.financial-table-body');


    if (localStorage.getItem('Expense Reports'))
    {

        (function () {

            const jsonArray = localStorage.getItem('Expense Reports');
            const expenseReportsGrouped = JSON.parse(jsonArray);
        
            expenseReportsGrouped.forEach((expenseReport) => {
                const tableRow = document.createElement('tr');
        
                tableRow.innerHTML = `
                <td>${expenseReport.name}</td>
                <td>${expenseReport.amount}</td>
                <td>${expenseReport.date}</td>
                <td class="hide-mobile">${expenseReport.category}</td>`;
        
                tableBodyElement.appendChild(tableRow);
            })
    
        })();

    }

    if (localStorage.getItem('Income Reports'))
    {

        (function () {

            const jsonArray = localStorage.getItem('Income Reports');
            const incomeReportsGrouped = JSON.parse(jsonArray);
        
            incomeReportsGrouped.forEach((incomeReport) => {
                const tableRow = document.createElement('tr');
        
                tableRow.innerHTML = `
                <td>${incomeReport.name}</td>
                <td>${incomeReport.amount}</td>
                <td>${incomeReport.date}</td>
                <td class="hide-mobile">${incomeReport.category}</td>`;
        
                tableBodyElement.appendChild(tableRow);
            })
    
        })();

    }

}
