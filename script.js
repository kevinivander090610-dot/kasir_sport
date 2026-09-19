// ==========================
// DATA BARANG
// ==========================

let barang = [

    {
        id: 1,
        nama: "Bola Basket",
        jenis: "Bola",
        harga: 350000,
        stok: 10
    },

    {
        id: 2,
        nama: "Bola Futsal",
        jenis: "Bola",
        harga: 250000,
        stok: 8
    },

    {
        id: 3,
        nama: "Raket Badminton",
        jenis: "Raket",
        harga: 400000,
        stok: 5
    }

];


// ==========================
// DATA KAS
// ==========================

let kas = [];


// ==========================
// FORMAT RUPIAH
// ==========================

function rupiah(angka) {

    return "Rp " + angka.toLocaleString("id-ID");

}


// ==========================
// PINDAH HALAMAN
// ==========================

function showPage(nama) {

    let pages = document.querySelectorAll(".page");

    pages.forEach(function(page) {

        page.classList.remove("active");

    });


    document
        .getElementById(nama)
        .classList.add("active");


    if (nama === "dashboard") {

        tampilkanDashboard();

    }


    if (nama === "stok") {

        tampilkanStok();

    }


    if (nama === "kasir") {

        tampilkanPilihanBarang();

    }


    if (nama === "kas") {

        tampilkanKas();

    }

}


// ==========================
// MENAMPILKAN DATA STOK
// ==========================

function tampilkanStok() {

    let tabel =
        document.getElementById("tabelStok");

    tabel.innerHTML = "";


    barang.forEach(function(item) {

        tabel.innerHTML += `

            <tr>

                <td>
                    ${item.nama}
                </td>

                <td>
                    ${item.jenis}
                </td>

                <td>
                    ${rupiah(item.harga)}
                </td>

                <td>
                    ${item.stok}
                </td>

                <td>

                    <button
                        class="delete"
                        onclick="hapusBarang(${item.id})">

                        Hapus

                    </button>

                </td>

            </tr>

        `;

    });

}


// ==========================
// TAMBAH BARANG
// ==========================

function tambahBarang() {

    let nama =
        document.getElementById("namaBarang").value;

    let jenis =
        document.getElementById("jenisBarang").value;

    let harga =
        Number(
            document.getElementById("hargaBarang").value
        );

    let stok =
        Number(
            document.getElementById("stokBarang").value
        );


    if (
        nama === "" ||
        jenis === "" ||
        harga <= 0 ||
        stok < 0
    ) {

        alert("Lengkapi data barang!");

        return;

    }


    barang.push({

        id: Date.now(),

        nama: nama,

        jenis: jenis,

        harga: harga,

        stok: stok

    });


    document.getElementById("namaBarang").value = "";

    document.getElementById("jenisBarang").value = "";

    document.getElementById("hargaBarang").value = "";

    document.getElementById("stokBarang").value = "";


    tampilkanStok();

    tampilkanDashboard();

}


// ==========================
// HAPUS BARANG
// ==========================

function hapusBarang(id) {

    barang = barang.filter(function(item) {

        return item.id !== id;

    });


    tampilkanStok();

    tampilkanDashboard();

}


// ==========================
// PILIH BARANG DI KASIR
// ==========================

function tampilkanPilihanBarang() {

    let select =
        document.getElementById("pilihBarang");

    select.innerHTML = "";


    barang.forEach(function(item) {

        select.innerHTML += `

            <option value="${item.id}">

                ${item.nama} -
                ${rupiah(item.harga)}

            </option>

        `;

    });


    tampilkanHarga();

}


// ==========================
// MENAMPILKAN HARGA
// ==========================

function tampilkanHarga() {

    let id =
        Number(
            document.getElementById("pilihBarang").value
        );


    let item =
        barang.find(function(data) {

            return data.id === id;

        });


    if (item) {

        document.getElementById(
            "hargaKasir"
        ).textContent =
            rupiah(item.harga);

    }

}


// ==========================
// HITUNG TOTAL
// ==========================

function hitungTotal() {

    let id =
        Number(
            document.getElementById("pilihBarang").value
        );


    let jumlah =
        Number(
            document.getElementById("jumlahBeli").value
        );


    let item =
        barang.find(function(data) {

            return data.id === id;

        });


    if (!item || jumlah <= 0) {

        alert("Masukkan jumlah barang!");

        return;

    }


    if (jumlah > item.stok) {

        alert("Stok tidak mencukupi!");

        return;

    }


    let total =
        item.harga * jumlah;


    document.getElementById(
        "totalKasir"
    ).textContent =
        rupiah(total);

}


// ==========================
// SIMPAN PENJUALAN
// ==========================

function simpanPenjualan() {

    let id =
        Number(
            document.getElementById("pilihBarang").value
        );


    let jumlah =
        Number(
            document.getElementById("jumlahBeli").value
        );


    let item =
        barang.find(function(data) {

            return data.id === id;

        });


    if (!item || jumlah <= 0) {

        alert("Masukkan jumlah barang!");

        return;

    }


    if (jumlah > item.stok) {

        alert("Stok tidak mencukupi!");

        return;

    }


    let total =
        item.harga * jumlah;


    // Kurangi stok

    item.stok -= jumlah;


    // Tambahkan kas masuk

    kas.push({

        tanggal: tanggalHariIni(),

        jenis: "masuk",

        jumlah: total,

        keterangan:
            "Penjualan " + item.nama

    });


    document.getElementById(
        "jumlahBeli"
    ).value = "";


    document.getElementById(
        "totalKasir"
    ).textContent = "Rp 0";


    tampilkanPilihanBarang();

    tampilkanDashboard();


    alert("Penjualan berhasil disimpan!");

}


// ==========================
// TAMBAH KAS
// ==========================

function tambahKas() {

    let tanggal =
        document.getElementById("tanggalKas").value;


    let jenis =
        document.getElementById("jenisKas").value;


    let jumlah =
        Number(
            document.getElementById("jumlahKas").value
        );


    let keterangan =
        document.getElementById(
            "keteranganKas"
        ).value;


    if (
        tanggal === "" ||
        jumlah <= 0 ||
        keterangan === ""
    ) {

        alert("Lengkapi data kas!");

        return;

    }


    kas.push({

        tanggal: tanggal,

        jenis: jenis,

        jumlah: jumlah,

        keterangan: keterangan

    });


    document.getElementById(
        "jumlahKas"
    ).value = "";


    document.getElementById(
        "keteranganKas"
    ).value = "";


    tampilkanKas();

    tampilkanDashboard();

}


// ==========================
// TAMPILKAN KAS
// ==========================

function tampilkanKas() {

    let tabel =
        document.getElementById("tabelKas");


    tabel.innerHTML = "";


    kas.forEach(function(item, index) {

        tabel.innerHTML += `

            <tr>

                <td>
                    ${item.tanggal}
                </td>

                <td>
                    ${item.jenis}
                </td>

                <td>
                    ${rupiah(item.jumlah)}
                </td>

                <td>
                    ${item.keterangan}
                </td>

                <td>

                    <button
                        class="delete"
                        onclick="hapusKas(${index})">

                        Hapus

                    </button>

                </td>

            </tr>

        `;

    });

}


// ==========================
// HAPUS KAS
// ==========================

function hapusKas(index) {

    kas.splice(index, 1);

    tampilkanKas();

    tampilkanDashboard();

}


// ==========================
// DASHBOARD
// ==========================

function tampilkanDashboard() {

    let masuk = 0;

    let keluar = 0;


    kas.forEach(function(item) {

        if (item.jenis === "masuk") {

            masuk += item.jumlah;

        } else {

            keluar += item.jumlah;

        }

    });


    let laba =
        masuk - keluar;


    document.getElementById(
        "totalMasuk"
    ).textContent =
        rupiah(masuk);


    document.getElementById(
        "totalKeluar"
    ).textContent =
        rupiah(keluar);


    document.getElementById(
        "laba"
    ).textContent =
        rupiah(laba);


    document.getElementById(
        "jumlahBarang"
    ).textContent =
        barang.length;


    tampilkanArusKas();

}


// ==========================
// ARUS KAS
// ==========================

function tampilkanArusKas() {

    let container =
        document.getElementById("arusKas");


    container.innerHTML = "";


    let data =
        kas.slice(-7);


    if (data.length === 0) {

        container.innerHTML =
            "<p>Belum ada transaksi.</p>";

        return;

    }


    let terbesar =
        Math.max(
            ...data.map(function(item) {

                return item.jumlah;

            })
        );


    data.forEach(function(item) {

        let tinggi =
            (item.jumlah / terbesar) * 130;


        let warna =
            item.jenis === "masuk"
            ? "#2563eb"
            : "#dc2626";


        container.innerHTML += `

            <div
                class="bar"
                style="
                    height:${tinggi}px;
                    background:${warna};
                "
            >

                <span>
                    ${item.jenis}
                </span>

            </div>

        `;

    });

}


// ==========================
// TANGGAL HARI INI
// ==========================

function tanggalHariIni() {

    let tanggal =
        new Date();


    let tahun =
        tanggal.getFullYear();


    let bulan =
        String(
            tanggal.getMonth() + 1
        ).padStart(2, "0");


    let hari =
        String(
            tanggal.getDate()
        ).padStart(2, "0");


    return `${tahun}-${bulan}-${hari}`;

}


// ==========================
// SAAT WEBSITE DIBUKA
// ==========================

document.getElementById(
    "tanggalKas"
).value =
    tanggalHariIni();


showPage("dashboard");