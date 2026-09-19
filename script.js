/* =====================================================
   SPORTCASH - DIGITAL CASHIER
===================================================== */


/* ================= DATA ================= */

const defaultProducts = [
    {
        id: 1,
        name: "Bola Futsal Pro",
        category: "Bola",
        price: 285000,
        stock: 18,
        icon: "⚽"
    },
    {
        id: 2,
        name: "Bola Basket Premium",
        category: "Bola",
        price: 350000,
        stock: 12,
        icon: "🏀"
    },
    {
        id: 3,
        name: "Jersey Football",
        category: "Jersey",
        price: 275000,
        stock: 25,
        icon: "👕"
    },
    {
        id: 4,
        name: "Jersey Basketball",
        category: "Jersey",
        price: 295000,
        stock: 16,
        icon: "🏀"
    },
    {
        id: 5,
        name: "Sepatu Running",
        category: "Sepatu",
        price: 650000,
        stock: 8,
        icon: "👟"
    },
    {
        id: 6,
        name: "Sepatu Futsal",
        category: "Sepatu",
        price: 720000,
        stock: 6,
        icon: "👟"
    },
    {
        id: 7,
        name: "Raket Badminton",
        category: "Raket",
        price: 450000,
        stock: 10,
        icon: "🏸"
    },
    {
        id: 8,
        name: "Sarung Tangan Kiper",
        category: "Aksesori",
        price: 175000,
        stock: 14,
        icon: "🧤"
    }
];


let products =
    JSON.parse(localStorage.getItem("sportcash_products")) ||
    defaultProducts;


let cashTransactions =
    JSON.parse(localStorage.getItem("sportcash_cash")) || [];


let sales =
    JSON.parse(localStorage.getItem("sportcash_sales")) || [];


let cart = [];


/* ================= INIT ================= */

document.addEventListener("DOMContentLoaded", () => {

    updateDate();

    setupNavigation();

    renderDashboard();

    renderStocks();

    renderProducts();

    renderCashTable();

    renderReport();

    setupCursor();

    setupSearch();

    setupForms();

});


/* ================= DATE ================= */

function updateDate() {

    const now = new Date();

    const date = now.toLocaleDateString("id-ID", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric"
    });

    document.getElementById("currentDate").textContent = date;

}


/* ================= NAVIGATION ================= */

function setupNavigation() {

    document.querySelectorAll(".nav-link").forEach(link => {

        link.addEventListener("click", e => {

            e.preventDefault();

            const section = link.dataset.section;

            showSection(section);

        });

    });

}


function showSection(sectionName) {

    document.querySelectorAll(".content-section")
        .forEach(section => section.classList.remove("active-section"));


    const target = document.getElementById(sectionName);

    if (target) {

        target.classList.add("active-section");

    }


    document.querySelectorAll(".nav-link")
        .forEach(link => link.classList.remove("active"));


    const activeLink =
        document.querySelector(`[data-section="${sectionName}"]`);

    if (activeLink) {

        activeLink.classList.add("active");

    }


    const titles = {
        dashboard: "Dashboard",
        stok: "Data Stok",
        transaksi: "Transaksi Penjualan",
        kas: "Kas Masuk & Keluar",
        laporan: "Laporan Keuangan",
        pengaturan: "Pengaturan"
    };

    document.getElementById("pageTitle").textContent =
        titles[sectionName] || "Dashboard";

}


/* ================= FORMAT ================= */

function formatRupiah(value) {

    return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        maximumFractionDigits: 0
    }).format(value);

}


/* ================= STORAGE ================= */

function saveData() {

    localStorage.setItem(
        "sportcash_products",
        JSON.stringify(products)
    );

    localStorage.setItem(
        "sportcash_cash",
        JSON.stringify(cashTransactions)
    );

    localStorage.setItem(
        "sportcash_sales",
        JSON.stringify(sales)
    );

}


/* ================= MONTH DATA ================= */

function getCurrentMonthData() {

    const now = new Date();

    const month = now.getMonth();
    const year = now.getFullYear();


    const monthlyCash =
        cashTransactions.filter(item => {

            const date = new Date(item.date);

            return (
                date.getMonth() === month &&
                date.getFullYear() === year
            );

        });


    const monthlySales =
        sales.filter(item => {

            const date = new Date(item.date);

            return (
                date.getMonth() === month &&
                date.getFullYear() === year
            );

        });


    return {
        cash: monthlyCash,
        sales: monthlySales
    };

}


/* ================= DASHBOARD ================= */

function renderDashboard() {

    const data = getCurrentMonthData();


    const income =
        data.cash
            .filter(x => x.type === "masuk")
            .reduce((sum, x) => sum + Number(x.amount), 0);


    const expense =
        data.cash
            .filter(x => x.type === "keluar")
            .reduce((sum, x) => sum + Number(x.amount), 0);


    const profit = income - expense;


    const totalStock =
        products.reduce((sum, p) => sum + Number(p.stock), 0);


    document.getElementById("incomeValue").textContent =
        formatRupiah(income);


    document.getElementById("expenseValue").textContent =
        formatRupiah(expense);


    document.getElementById("profitValue").textContent =
        formatRupiah(profit);


    document.getElementById("stockValue").textContent =
        totalStock;


    renderCategories();

    renderRecentTransactions();

    renderChart();

    renderCashSummary();

    renderReport();

}


/* ================= CATEGORY ================= */

function renderCategories() {

    const container =
        document.getElementById("categoryList");

    const categories = {};

    products.forEach(product => {

        if (!categories[product.category]) {

            categories[product.category] = 0;

        }

        categories[product.category] +=
            Number(product.stock);

    });


    const total =
        Object.values(categories)
            .reduce((a,b) => a+b, 0);


    container.innerHTML = "";


    Object.entries(categories).forEach(([name, amount]) => {

        const percent =
            total === 0
                ? 0
                : Math.round((amount / total) * 100);


        const icons = {
            Bola: "⚽",
            Jersey: "👕",
            Sepatu: "👟",
            Raket: "🏸",
            Aksesori: "🧤"
        };


        container.innerHTML += `

            <div class="category-row">

                <div class="category-icon">
                    ${icons[name] || "📦"}
                </div>

                <div class="category-info">

                    <strong>${name}</strong>

                    <small>
                        ${amount} unit
                    </small>

                </div>

                <div class="category-percent">
                    ${percent}%
                </div>

            </div>

        `;

    });

}


/* ================= CHART ================= */

let cashChart;


function renderChart() {

    const canvas =
        document.getElementById("cashChart");

    if (!canvas) return;


    const labels = [];

    const incomeData = [];

    const expenseData = [];


    for (let i = 6; i >= 0; i--) {

        const date = new Date();

        date.setDate(date.getDate() - i);


        const key =
            date.toISOString().split("T")[0];


        labels.push(
            date.toLocaleDateString("id-ID", {
                day: "numeric",
                month: "short"
            })
        );


        const income =
            cashTransactions
                .filter(x =>
                    x.date === key &&
                    x.type === "masuk"
                )
                .reduce((sum,x) =>
                    sum + Number(x.amount),0
                );


        const expense =
            cashTransactions
                .filter(x =>
                    x.date === key &&
                    x.type === "keluar"
                )
                .reduce((sum,x) =>
                    sum + Number(x.amount),0
                );


        incomeData.push(income);

        expenseData.push(expense);

    }


    if (cashChart) {

        cashChart.destroy();

    }


    cashChart =
        new Chart(canvas, {

            type: "line",

            data: {

                labels,

                datasets: [

                    {
                        label: "Kas Masuk",
                        data: incomeData,
                        borderWidth: 2,
                        tension: .4,
                        fill: true
                    },

                    {
                        label: "Kas Keluar",
                        data: expenseData,
                        borderWidth: 2,
                        tension: .4,
                        fill: true
                    }

                ]

            },

            options: {

                responsive: true,

                maintainAspectRatio: false,

                plugins: {

                    legend: {
                        labels: {
                            color: "#8993a6",
                            font: {
                                size: 10
                            }
                        }
                    }

                },

                scales: {

                    x: {
                        grid: {
                            display: false
                        },
                        ticks: {
                            color: "#687286",
                            font: {
                                size: 9
                            }
                        }
                    },

                    y: {
                        grid: {
                            color: "rgba(255,255,255,.05)"
                        },
                        ticks: {
                            color: "#687286",
                            font: {
                                size: 9
                            }
                        }
                    }

                }

            }

        });

}


/* ================= RECENT TRANSACTIONS ================= */

function renderRecentTransactions() {

    const table =
        document.getElementById("recentTransactions");

    const all =
        [...cashTransactions]
            .sort((a,b) =>
                new Date(b.date) - new Date(a.date)
            )
            .slice(0,5);


    table.innerHTML = "";


    if (all.length === 0) {

        table.innerHTML = `
            <tr>
                <td colspan="5">
                    Belum ada transaksi.
                </td>
            </tr>
        `;

        return;

    }


    all.forEach(item => {

        table.innerHTML += `

            <tr>

                <td>${formatDate(item.date)}</td>

                <td>
                    <span class="status ${item.type === "masuk" ? "in" : "out"}">
                        ${item.type === "masuk" ? "Kas Masuk" : "Kas Keluar"}
                    </span>
                </td>

                <td>${item.description}</td>

                <td>
                    ${formatRupiah(item.amount)}
                </td>

                <td>
                    <span class="status ready">
                        Selesai
                    </span>
                </td>

            </tr>

        `;

    });

}


/* ================= STOCK ================= */

function renderStocks() {

    const grid =
        document.getElementById("stockGrid");

    if (!grid) return;


    const search =
        document.getElementById("stockSearch")?.value
        .toLowerCase() || "";


    const category =
        document.getElementById("categoryFilter")?.value ||
        "all";


    const filtered =
        products.filter(product => {

            const matchesSearch =
                product.name
                    .toLowerCase()
                    .includes(search);


            const matchesCategory =
                category === "all" ||
                product.category === category;


            return matchesSearch && matchesCategory;

        });


    grid.innerHTML = "";


    filtered.forEach(product => {

        const lowStock = product.stock <= 7;


        grid.innerHTML += `

            <div class="stock-card">

                <div class="product-image">
                    ${product.icon}
                </div>

                <span class="category">
                    ${product.category}
                </span>

                <h3>
                    ${product.name}
                </h3>

                <div class="stock-price">
                    ${formatRupiah(product.price)}
                </div>

                <div class="stock-bottom">

                    <span class="stock-count">
                        Stok: ${product.stock}
                    </span>

                    <span class="status ${lowStock ? "low" : "ready"}">
                        ${lowStock ? "Menipis" : "Tersedia"}
                    </span>

                </div>

            </div>

        `;

    });

}


/* ================= SEARCH ================= */

function setupSearch() {

    document
        .getElementById("stockSearch")
        ?.addEventListener("input", renderStocks);


    document
        .getElementById("categoryFilter")
        ?.addEventListener("change", renderStocks);


    document
        .getElementById("cashFilter")
        ?.addEventListener("change", renderCashTable);

}


/* ================= PRODUCT SELECTION ================= */

function renderProducts() {

    const container =
        document.getElementById("productSelection");

    if (!container) return;


    container.innerHTML = "";


    products.forEach(product => {

        if (product.stock <= 0) return;


        container.innerHTML += `

            <button
                class="select-product"
                onclick="addToCart(${product.id})"
            >

                <div class="emoji">
                    ${product.icon}
                </div>

                <h4>
                    ${product.name}
                </h4>

                <small>
                    ${formatRupiah(product.price)}
                </small>

            </button>

        `;

    });


    const select =
        document.getElementById("transactionProduct");

    if (select) {

        select.innerHTML = "";

        products.forEach(product => {

            select.innerHTML += `
                <option value="${product.id}">
                    ${product.name}
                </option>
            `;

        });

    }

}


/* ================= CART ================= */

function addToCart(id) {

    const product =
        products.find(p => p.id === id);


    if (!product || product.stock <= 0) {

        showToast("Stok produk habis.");

        return;

    }


    const existing =
        cart.find(item => item.id === id);


    if (existing) {

        if (existing.quantity >= product.stock) {

            showToast("Jumlah melebihi stok.");

            return;

        }

        existing.quantity++;

    } else {

        cart.push({
            id,
            quantity: 1
        });

    }


    renderCart();

}


function renderCart() {

    const container =
        document.getElementById("cartItems");


    const count =
        cart.reduce((sum,item) =>
            sum + item.quantity,0
        );


    document.getElementById("cartCount").textContent =
        `${count} item`;


    if (cart.length === 0) {

        container.innerHTML = `
            <div class="empty-cart">
                🛒
                <p>Belum ada produk</p>
            </div>
        `;

        document.getElementById("cartTotal").textContent =
            "Rp 0";

        return;

    }


    let total = 0;

    container.innerHTML = "";


    cart.forEach(item => {

        const product =
            products.find(p => p.id === item.id);


        const subtotal =
            product.price * item.quantity;


        total += subtotal;


        container.innerHTML += `

            <div class="cart-item">

                <div>

                    <strong>
                        ${product.name}
                    </strong>

                    <small>
                        ${item.quantity} ×
                        ${formatRupiah(product.price)}
                    </small>

                </div>

                <button
                    class="remove-cart"
                    onclick="removeFromCart(${product.id})"
                >
                    ×
                </button>

            </div>

        `;

    });


    document.getElementById("cartTotal").textContent =
        formatRupiah(total);

}


function removeFromCart(id) {

    cart =
        cart.filter(item => item.id !== id);

    renderCart();

}


function clearCart() {

    cart = [];

    renderCart();

}


/* ================= CHECKOUT ================= */

function checkout() {

    if (cart.length === 0) {

        showToast("Keranjang masih kosong.");

        return;

    }


    let total = 0;


    cart.forEach(item => {

        const product =
            products.find(p => p.id === item.id);


        total +=
            product.price * item.quantity;


        product.stock -= item.quantity;

    });


    const transaction = {

        id: Date.now(),

        date: getToday(),

        type: "masuk",

        amount: total,

        description: "Penjualan produk olahraga"

    };


    cashTransactions.push(transaction);

    sales.push(transaction);


    saveData();


    cart = [];


    renderCart();

    renderDashboard();

    renderStocks();

    renderProducts();

    renderCashTable();


    showToast(
        `Penjualan ${formatRupiah(total)} berhasil.`
    );

}


/* ================= CASH MODAL ================= */

function openCashModal(type) {

    document.getElementById("cashType").value =
        type;


    document.getElementById("cashModalTitle").textContent =
        type === "masuk"
            ? "Kas Masuk"
            : "Kas Keluar";


    document.getElementById("cashDate").value =
        getToday();


    document.getElementById("cashModal").classList.add("show");

}


function setupForms() {

    document
        .getElementById("cashForm")
        .addEventListener("submit", e => {

            e.preventDefault();


            const transaction = {

                id: Date.now(),

                date:
                    document.getElementById("cashDate").value,

                type:
                    document.getElementById("cashType").value,

                amount:
                    Number(
                        document.getElementById("cashAmount").value
                    ),

                description:
                    document.getElementById("cashDescription").value

            };


            cashTransactions.push(transaction);

            saveData();

            closeModal("cashModal");

            e.target.reset();

            renderDashboard();

            renderCashTable();

            showToast("Transaksi kas berhasil ditambahkan.");

        });


    document
        .getElementById("stockForm")
        .addEventListener("submit", e => {

            e.preventDefault();


            const product = {

                id: Date.now(),

                name:
                    document.getElementById("stockName").value,

                category:
                    document.getElementById("stockCategory").value,

                price:
                    Number(
                        document.getElementById("stockPrice").value
                    ),

                stock:
                    Number(
                        document.getElementById("stockQuantity").value
                    ),

                icon:
                    getCategoryIcon(
                        document.getElementById("stockCategory").value
                    )

            };


            products.push(product);

            saveData();

            closeModal("stockModal");

            e.target.reset();

            renderStocks();

            renderProducts();

            renderDashboard();

            showToast("Barang berhasil ditambahkan.");

        });


    document
        .getElementById("transactionForm")
        .addEventListener("submit", e => {

            e.preventDefault();


            const id =
                Number(
                    document.getElementById("transactionProduct").value
                );


            const quantity =
                Number(
                    document.getElementById("transactionQuantity").value
                );


            const product =
                products.find(p => p.id === id);


            if (!product || quantity > product.stock) {

                showToast("Stok tidak mencukupi.");

                return;

            }


            const total =
                product.price * quantity;


            product.stock -= quantity;


            cashTransactions.push({

                id: Date.now(),

                date: getToday(),

                type: "masuk",

                amount: total,

                description:
                    `Penjualan ${product.name} (${quantity}x)`

            });


            sales.push({

                id: Date.now(),

                date: getToday(),

                type: "masuk",

                amount: total,

                description:
                    `Penjualan ${product.name}`

            });


            saveData();


            closeModal("transactionModal");

            e.target.reset();


            renderDashboard();

            renderStocks();

            renderProducts();

            renderCashTable();


            showToast(
                `Penjualan ${formatRupiah(total)} berhasil.`
            );

        });

}


/* ================= CASH TABLE ================= */

function renderCashTable() {

    const table =
        document.getElementById("cashTable");


    if (!table) return;


    const filter =
        document.getElementById("cashFilter")?.value ||
        "all";


    let data = [...cashTransactions];


    if (filter !== "all") {

        data =
            data.filter(item =>
                item.type === filter
            );

    }


    data.sort(
        (a,b) =>
            new Date(b.date) -
            new Date(a.date)
    );


    table.innerHTML = "";


    if (data.length === 0) {

        table.innerHTML = `
            <tr>
                <td colspan="5">
                    Belum ada data kas.
                </td>
            </tr>
        `;

        return;

    }


    data.forEach(item => {

        table.innerHTML += `

            <tr>

                <td>
                    ${formatDate(item.date)}
                </td>

                <td>

                    <span class="status ${item.type === "masuk" ? "in" : "out"}">

                        ${item.type === "masuk"
                            ? "Kas Masuk"
                            : "Kas Keluar"}

                    </span>

                </td>

                <td>
                    ${item.description}
                </td>

                <td>
                    ${formatRupiah(item.amount)}
                </td>

                <td>

                    <button
                        class="remove-cart"
                        onclick="deleteCash(${item.id})"
                    >
                        Hapus
                    </button>

                </td>

            </tr>

        `;

    });

}


/* ================= DELETE CASH ================= */

function deleteCash(id) {

    if (!confirm("Hapus transaksi ini?")) return;


    cashTransactions =
        cashTransactions.filter(
            item => item.id !== id
        );


    saveData();

    renderDashboard();

    renderCashTable();

    showToast("Transaksi berhasil dihapus.");

}


/* ================= CASH SUMMARY ================= */

function renderCashSummary() {

    const income =
        cashTransactions
            .filter(x => x.type === "masuk")
            .reduce(
                (sum,x) => sum + Number(x.amount),
                0
            );


    const expense =
        cashTransactions
            .filter(x => x.type === "keluar")
            .reduce(
                (sum,x) => sum + Number(x.amount),
                0
            );


    document.getElementById("cashInTotal").textContent =
        formatRupiah(income);


    document.getElementById("cashOutTotal").textContent =
        formatRupiah(expense);


    document.getElementById("cashBalance").textContent =
        formatRupiah(income - expense);

}


/* ================= REPORT ================= */

function renderReport() {

    const income =
        cashTransactions
            .filter(x => x.type === "masuk")
            .reduce(
                (sum,x) => sum + Number(x.amount),
                0
            );


    const expense =
        cashTransactions
            .filter(x => x.type === "keluar")
            .reduce(
                (sum,x) => sum + Number(x.amount),
                0
            );


    document.getElementById("reportIncome").textContent =
        formatRupiah(income);


    document.getElementById("reportExpense").textContent =
        formatRupiah(expense);


    document.getElementById("reportProfit").textContent =
        formatRupiah(income - expense);


    const table =
        document.getElementById("reportStock");


    if (!table) return;


    table.innerHTML = "";


    products.forEach(product => {

        const low = product.stock <= 7;


        table.innerHTML += `

            <tr>

                <td>
                    ${product.name}
                </td>

                <td>
                    ${product.category}
                </td>

                <td>
                    ${formatRupiah(product.price)}
                </td>

                <td>
                    ${product.stock}
                </td>

                <td>

                    <span class="status ${low ? "low" : "ready"}">

                        ${low ? "Stok Menipis" : "Aman"}

                    </span>

                </td>

            </tr>

        `;

    });

}


/* ================= MODALS ================= */

function openStockModal() {

    document
        .getElementById("stockModal")
        .classList.add("show");

}


function openTransactionModal() {

    renderProducts();

    document
        .getElementById("transactionModal")
        .classList.add("show");

}


function closeModal(id) {

    document
        .getElementById(id)
        .classList.remove("show");

}


window.addEventListener("click", e => {

    if (e.target.classList.contains("modal-overlay")) {

        e.target.classList.remove("show");

    }

});


/* ================= TOAST ================= */

let toastTimeout;


function showToast(message) {

    const toast =
        document.getElementById("toast");


    document.getElementById("toastMessage")
        .textContent = message;


    toast.classList.add("show");


    clearTimeout(toastTimeout);


    toastTimeout =
        setTimeout(() => {

            toast.classList.remove("show");

        }, 3000);

}


/* ================= CURSOR ================= */

function setupCursor() {

    const dot =
        document.querySelector(".cursor-dot");

    const outline =
        document.querySelector(".cursor-outline");


    document.addEventListener("mousemove", e => {

        dot.style.left = `${e.clientX}px`;

        dot.style.top = `${e.clientY}px`;


        outline.animate(
            {
                left: `${e.clientX}px`,
                top: `${e.clientY}px`
            },
            {
                duration: 350,
                fill: "forwards"
            }
        );

    });


    const interactive =
        document.querySelectorAll(
            "button, a, input, select, .stock-card, .select-product"
        );


    interactive.forEach(element => {

        element.addEventListener("mouseenter", () => {

            document.body.classList.add("cursor-hover");

        });


        element.addEventListener("mouseleave", () => {

            document.body.classList.remove("cursor-hover");

        });

    });

}


/* ================= HELPERS ================= */

function getToday() {

    const now = new Date();

    return now.toISOString().split("T")[0];

}


function formatDate(date) {

    return new Date(date).toLocaleDateString(
        "id-ID",
        {
            day: "2-digit",
            month: "short",
            year: "numeric"
        }
    );

}


function getCategoryIcon(category) {

    const icons = {
        Bola: "⚽",
        Jersey: "👕",
        Sepatu: "👟",
        Raket: "🏸",
        Aksesori: "🧤"
    };

    return icons[category] || "📦";

}


/* ================= RESET ================= */

function resetData() {

    if (!confirm("Reset seluruh data SportCash?")) return;


    localStorage.removeItem("sportcash_products");

    localStorage.removeItem("sportcash_cash");

    localStorage.removeItem("sportcash_sales");


    products = [...defaultProducts];

    cashTransactions = [];

    sales = [];

    cart = [];


    renderDashboard();

    renderStocks();

    renderProducts();

    renderCashTable();

    renderCart();

    showToast("Data berhasil direset.");

}