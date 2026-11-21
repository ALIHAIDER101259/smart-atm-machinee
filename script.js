
// =====================================
// ATM BANKING MANAGEMENT SYSTEM
// =====================================


// 1. INITIAL VARIABLES

let initialBalance = 200000;
let remainingBalance = initialBalance;

let isAuthenticated = false;
let transactionCount = 0;


// 2. HTML ELEMENTS

const pinInput = document.getElementById("pin");
const loginBtn = document.getElementById("loginBtn");

const loginSection = document.getElementById("loginSection");
const accountVerification = document.getElementById("accountVerification");
const transactionSection = document.getElementById("transactionSection");

const notification = document.getElementById("notification");

const balanceElement = document.getElementById("balance");
const accountStatus = document.getElementById("accountStatus");

const transactionCountElement =
    document.getElementById("transactionCount");

const withdrawAmount = document.getElementById("withdrawAmount");

const activeAccount = document.getElementById("activeAccount");
const blockedAccount = document.getElementById("blockedAccount");

const withdrawBtn = document.getElementById("withdrawBtn");
const logoutBtn = document.getElementById("logoutBtn");

const verifyBtn = document.getElementById("verifyBtn");

const verifyAccount = document.getElementById("verifyAccount");
const verifyBlocked = document.getElementById("verifyBlocked");

const historyBody = document.getElementById("historyBody");


// 3. LIVE DATE AND TIME

function updateTime() {

    const currentTime = new Date();

    document.getElementById("liveTime").textContent =
        currentTime.toLocaleString("en-US", {
            dateStyle: "medium",
            timeStyle: "medium"
        });

}

updateTime();

setInterval(updateTime, 1000);


// 4. UPDATE BALANCE

function updateBalance() {

    balanceElement.textContent =
        "$" + remainingBalance.toLocaleString("en-US", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });

}


// 5. UPDATE ACCOUNT STATUS

function updateAccountStatus() {

    const isActive = activeAccount.value === "yes";
    const isBlocked = blockedAccount.value === "yes";

    if (isActive && !isBlocked) {

        accountStatus.textContent = "Active";
        accountStatus.className = "status-active";

    }

    else if (isBlocked) {

        accountStatus.textContent = "Blocked";
        accountStatus.className = "status-blocked";

    }

    else {

        accountStatus.textContent = "Inactive";
        accountStatus.className = "status-blocked";

    }

}

activeAccount.addEventListener("change", updateAccountStatus);

blockedAccount.addEventListener("change", updateAccountStatus);


// 6. NOTIFICATION FUNCTION

function showNotification(message, type) {

    notification.innerHTML = message;

    notification.className = "notification " + type;

}


// 7. LOGIN AUTHENTICATION

loginBtn.addEventListener("click", function () {

    const enteredPin = pinInput.value.trim();

    // PIN must contain exactly 6 digits

    if (!/^\d{6}$/.test(enteredPin)) {

        showNotification(
            "Please enter exactly 6 digits PIN.",
            "error"
        );

        return;

    }

    // Any 6-digit PIN accepted

    isAuthenticated = true;

    // Hide Login Section

    loginSection.classList.add("hidden");

    // Show Account Verification

    accountVerification.classList.remove("hidden");

    showNotification(
        "PIN accepted! Please verify your account status.",
        "success"
    );

});


// 8. ENTER KEY LOGIN

pinInput.addEventListener("keydown", function (event) {

    if (event.key === "Enter") {

        loginBtn.click();

    }

});


// 9. ACCOUNT VERIFICATION

verifyBtn.addEventListener("click", function () {

    const active = verifyAccount.value;

    const blocked = verifyBlocked.value;

    // Check Empty Fields

    if (active === "" || blocked === "") {

        showNotification(
            "Please select both account status options.",
            "error"
        );

        return;

    }

    // Check Account Requirements

    if (active === "yes" && blocked === "no") {

        // Account Verified

        isAuthenticated = true;

        accountVerification.classList.add("hidden");

        transactionSection.classList.remove("hidden");

        activeAccount.value = "yes";
        blockedAccount.value = "no";

        updateAccountStatus();

        showNotification(
            "Account Verified Successfully! You can perform transactions.",
            "success"
        );

    }

    else {

        // Account Access Denied

        isAuthenticated = false;

        showNotification(
            "Access Denied! Your account is inactive or blocked.",
            "error"
        );

    }

});


// 10. TRANSACTION HISTORY

function addTransaction(amount, status) {

    const emptyRow = document.getElementById("emptyHistory");

    if (emptyRow) {

        emptyRow.remove();

    }

    const currentDate = new Date();

    const formattedDate = currentDate.toLocaleString();

    const row = document.createElement("tr");

    const transactionName = document.createElement("td");

    transactionName.textContent = "Cash Withdrawal";

    const dateCell = document.createElement("td");

    dateCell.textContent = formattedDate;

    const amountCell = document.createElement("td");

    amountCell.textContent =
        "-$" + amount.toLocaleString("en-US");

    const statusCell = document.createElement("td");

    const statusBadge = document.createElement("span");

    statusBadge.className = "status-badge";

    statusBadge.textContent = status;

    if (status === "Failed") {

        statusBadge.style.background = "#fff0f0";

        statusBadge.style.color = "#c03945";

    }

    statusCell.appendChild(statusBadge);

    row.appendChild(transactionName);
    row.appendChild(dateCell);
    row.appendChild(amountCell);
    row.appendChild(statusCell);

    historyBody.prepend(row);

    transactionCount++;

    transactionCountElement.textContent = transactionCount;

}


// 11. WITHDRAWAL FUNCTION

withdrawBtn.addEventListener("click", function () {

    // Authentication Check

    if (!isAuthenticated) {

        showNotification(
            "Please authenticate your account first.",
            "error"
        );

        return;

    }

    // Account Status Check

    const isActive = activeAccount.value === "yes";

    const isBlocked = blockedAccount.value === "yes";

    if (!isActive || isBlocked) {

        showNotification(
            "Transaction Failed! Your account is inactive or blocked.",
            "error"
        );

        updateAccountStatus();

        return;

    }

    // Withdrawal Amount

    const amount = Number(withdrawAmount.value);

    // Empty or Invalid Amount Check

    if (
        withdrawAmount.value.trim() === "" ||
        !Number.isSafeInteger(amount) ||
        amount <= 0
    ) {

        showNotification(
            "Please enter a valid positive whole-number amount.",
            "error"
        );

        return;

    }

    // Withdrawal Limit Check

    if (amount >= 100000) {

        showNotification(
            "Transaction Failed! Maximum withdrawal limit is $99,999.",
            "error"
        );

        addTransaction(amount, "Failed");

        return;

    }

    // Balance Check

    if (amount > remainingBalance) {

        showNotification(
            "Insufficient Balance! Your available balance is $" +
            remainingBalance.toLocaleString("en-US") + ".",
            "error"
        );

        addTransaction(amount, "Failed");

        return;

    }

    // SUCCESSFUL TRANSACTION

    remainingBalance = remainingBalance - amount;

    updateBalance();

    showNotification(

        "<strong>Transaction Successful!</strong><br>" +

        "Amount Withdrawn: $" +
        amount.toLocaleString("en-US") +

        "<br>Remaining Balance: $" +
        remainingBalance.toLocaleString("en-US") +

        "<br>Date & Time: " +
        new Date().toLocaleString(),

        "success"

    );

    // Save Transaction History

    addTransaction(amount, "Success");

    // Clear Input

    withdrawAmount.value = "";

});


// 12. LOGOUT FUNCTION

logoutBtn.addEventListener("click", function () {

    isAuthenticated = false;

    // Hide Transaction Section

    transactionSection.classList.add("hidden");

    // Show Login Section

    loginSection.classList.remove("hidden");

    // Hide Account Verification

    accountVerification.classList.add("hidden");

    // Reset Inputs

    pinInput.value = "";

    withdrawAmount.value = "";

    verifyAccount.value = "";

    verifyBlocked.value = "";

    // Reset Notification

    showNotification(
        "You have successfully logged out.",
        "success"
    );

});


// 13. INITIAL DISPLAY

updateBalance();

updateAccountStatus();
