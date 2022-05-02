'use strict';

const tableBodyElement = document.querySelector('.financial-table-body');

const incomeInputContainer = document.querySelector("#income-input-container");
const expenseInputContainer = document.querySelector("#expense-input-container");

const totalIncomeHeader = document.querySelector('#total-income');
const totalExpenseHeader = document.querySelector('#total-expense');
const totalBalanceHeader = document.querySelector('#total-balance');

reloadHtmlTable();

class Income
{
    constructor (name, amount, date, category)
    {
        this.name = name,
        this.amount = Number(amount),
        this.date = date,
        this.category = category
    }
}

class Expense
{
    constructor (name, amount, date, category) 
    {
        this.name = name,
        this.amount = Number(-amount),
        this.date = date,
        this.category = category
    }
}

incomeInputContainer.querySelector(".submit-button").addEventListener('click', () => {

    const incomeName = incomeInputContainer.querySelector('#income-name');
    const incomeAmount = incomeInputContainer.querySelector('#income-amount');
    const incomeDate = incomeInputContainer.querySelector('#income-date');
    const incomeCategory = incomeInputContainer.querySelector('#income-category');

    if (validateInput(incomeName) === false) return;
    if (validateInput(incomeAmount) === false) return;
    if (validateInput(incomeDate) === false) return;

    const income = new Income(incomeName.value, incomeAmount.value, incomeDate.value, incomeCategory.value);
    saveIncomeToLocalStorage(income);

    reloadHtmlTable();
    updateChart(incomeChart);
})

expenseInputContainer.querySelector(".submit-button").addEventListener('click', () => {

    const expenseName = expenseInputContainer.querySelector('#expense-name');
    const expenseAmount = expenseInputContainer.querySelector('#expense-amount');
    const expenseDate = expenseInputContainer.querySelector('#expense-date');
    const expenseCategory = expenseInputContainer.querySelector('#expense-category');

    if (validateInput(expenseName) === false) return;
    if (validateInput(expenseAmount) === false) return;
    if (validateInput(expenseDate) === false) return;

    const expense = new Expense(expenseName.value, expenseAmount.value, expenseDate.value, expenseCategory.value);
    saveExpenseToLocalStorage(expense);

    reloadHtmlTable();
    updateChart(expenseChart);
})

function validateInput (inputElement) 
{
    if  (inputElement.value == '') 
    {
        alert('Please fill out every input');
        return false;
    }
}

function saveIncomeToLocalStorage(income)
{   
    if (localStorage.getItem('Income Reports') === null)
    {
        const incomeReports = [];
        incomeReports.push(income);
        
        const jsonArray = JSON.stringify(incomeReports);
        localStorage.setItem('Income Reports', jsonArray);
    }
    else 
    {
        const incomeReports = getIncomeReports();

        incomeReports.push(income);

        const jsonArrayUpdated = JSON.stringify(incomeReports);
        localStorage.setItem('Income Reports', jsonArrayUpdated);
    }
}

function saveExpenseToLocalStorage(expense)
{   
    if (localStorage.getItem('Expense Reports') === null)
    {
        const expenseReports = [];
        expenseReports.push(expense);
        
        const jsonArray = JSON.stringify(expenseReports);
        localStorage.setItem('Expense Reports', jsonArray);
    }
    else 
    {
        const expenseReports = getExpenseReports();
        expenseReports.push(expense);

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
        const expenseReports = getExpenseReports();
        
        expenseReports.forEach((expenseReport) => {
            totalExpense += expenseReport.amount;
            addTableData(expenseReport);
        })

        totalExpenseHeader.textContent = "Expense: " + totalExpense;
    }

    if (localStorage.getItem('Income Reports'))
    {
        const incomeReports = getIncomeReports();
        
        incomeReports.forEach((incomeReport) => {
            totalIncome += incomeReport.amount;
            addTableData(incomeReport);
        })

        totalIncomeHeader.textContent = "Income: " + totalIncome;
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


const expenseCanvas = document.querySelector('#expense-chart');
const expenseChart = new Chart(expenseCanvas, {
    type: 'doughnut',
    data: {
        datasets: [{
            data: [],
            backgroundColor: ["#a3a3a2", "#a61616", "#4aa616", "#a6a616", "#8416a6", "#3516a6"],
        }],
        labels: ["Not categorized", "Clothing", "Medical", "Hobbies", "Travel", "Bills"]
    }
});

const incomeCanvas = document.querySelector('#income-chart');
const incomeChart = new Chart(incomeCanvas, {
    type: 'doughnut',
    data: {
        datasets: [{
            data: [],
            backgroundColor: ["#a3a3a2", "#509c21", "#9c2194", "#21569c"],
        }],
        labels: ["Not categorized", "Job", "Business", "Investments"]
    }
});

updateChart(incomeChart);
updateChart(expenseChart);

function updateChart (chart)
{

    if (chart === incomeChart)
    {
        let incomeReports = getIncomeReports();

        if (incomeReports === null )
        {
            return false;
        }

        let notCategorizedIncome = 0;
        let jobIncome = 0;
        let businessIncome = 0;
        let investmentsIncome = 0;

        incomeReports.forEach((incomeReport) => {

            switch (incomeReport.category)
            {
                case "Not categorized":
                    notCategorizedIncome += incomeReport.amount;
                    break; 
                case "Job":
                    jobIncome += incomeReport.amount;
                    break;
                case "Business":
                    businessIncome += incomeReport.amount;
                    break;
                case "Investments":
                    investmentsIncome += incomeReport.amount;
                    break;
            }

        })

        chart.data.datasets[0].data = [notCategorizedIncome, jobIncome, businessIncome, investmentsIncome];
        chart.update();
    }
    else if (chart === expenseChart)
    {
        let expenseReports = getExpenseReports();

        if (expenseReports === null )
        {
            return false;
        }

        let notCategorizedExpense = 0;
        let clothingExpense = 0;
        let medicalExpense = 0;
        let hobbiesExpense = 0;
        let travelExpense = 0;
        let billsExpense = 0;

        expenseReports.forEach((expenseReport) => {

            switch (expenseReport.category)
            {
                case "Not categorized":
                    notCategorizedExpense += expenseReport.amount;
                    break; 
                case "Clothing":
                    clothingExpense += expenseReport.amount; 
                    break; 
                case "Medical":
                    medicalExpense += expenseReport.amount;
                    break;
                case "Hobbies":
                    hobbiesExpense += expenseReport.amount; 
                    break; 
                case "Travel":
                    travelExpense += expenseReport.amount;
                    break; 
                case "Bills":
                    billsExpense += expenseReport.amount; 
                    break;
            }

        })

        console.log(notCategorizedExpense, medicalExpense, clothingExpense)

        chart.data.datasets[0].data = [notCategorizedExpense, clothingExpense, medicalExpense, hobbiesExpense, travelExpense, billsExpense];
        chart.update();
    }
    else 
    {
        console.log('wrong report object');
    }
}


