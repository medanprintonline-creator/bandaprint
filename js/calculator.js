// ==========================================================
// BANDAACEHPRINT.COM
// calculator.js — Kalkulator Harga Final
// ==========================================================

const PRICING = {
    dokumen: {
        A4: { bw: 350, "full-color": 1000, mixed: 600 },
        F4: { bw: 400, "full-color": 1200, mixed: 700 },
        A3: { bw: 1000, "full-color": 3000, mixed: 2000 },
        binding: {
            none: 0,
            hardcover: 35000,
            softcover: 15000,
            spiral: 12000,
            lakban: 5000
        }
    },

    spanduk: {
        flexi280: 25000,
        flexi340: 35000,
        korchin: 50000,
        finishing: {
            "mata-ayam": 0,
            selongsong: 2000,
            polos: 0
        }
    },

    stiker: {
        chromo: 12000,
        vinyl: 20000,
        transparan: 22000,
        cut: {
            "kiss-cut": 3000,
            "die-cut": 5000
        }
    },

    kartu: {
        ac260: 35000,
        "bw-local": 50000,
        lamination: {
            none: 0,
            doff: 10000,
            glossy: 10000
        }
    }
};

// ----------------------------------------------------------
// Label yang ditampilkan ke pelanggan
// ----------------------------------------------------------

const CALCULATOR_LABELS = {
    paper: {
        A4: "A4",
        F4: "F4 / Folio",
        A3: "A3"
    },

    color: {
        bw: "Hitam Putih",
        "full-color": "Full Color",
        mixed: "Campuran B&W + Warna"
    },

    binding: {
        none: "Tanpa Jilid",
        hardcover: "Hardcover Skripsi",
        softcover: "Softcover",
        spiral: "Jilid Spiral",
        lakban: "Jilid Lakban + Cover Mika"
    },

    bannerMaterial: {
        flexi280: "Flexi Standard 280g",
        flexi340: "Flexi High-Res 340g",
        korchin: "Flexi Korchin 440g"
    },

    bannerFinishing: {
        "mata-ayam": "Mata Ayam 4 Sudut",
        selongsong: "Selongsong Kayu / Bambu",
        polos: "Polos"
    },

    stickerMaterial: {
        chromo: "Chromo",
        vinyl: "Vinyl Anti Air",
        transparan: "Transparan Clear"
    },

    stickerCut: {
        "kiss-cut": "Kiss Cut",
        "die-cut": "Die Cut"
    },

    kartuPaper: {
        ac260: "Art Carton 260gr",
        "bw-local": "BW Local Textured Paper"
    },

    lamination: {
        none: "Tanpa Laminasi",
        doff: "Laminasi Doff",
        glossy: "Laminasi Glossy"
    }
};

// ----------------------------------------------------------
// Helper
// ----------------------------------------------------------

function formatRupiah(value) {
    const amount = Number.isFinite(Number(value)) ? Math.max(0, Number(value)) : 0;
    return `Rp ${Math.round(amount).toLocaleString("id-ID")}`;
}

function getNumber(id, fallback = 1, min = 1) {
    const element = document.getElementById(id);
    if (!element) return fallback;

    const value = Number(element.value);
    if (!Number.isFinite(value)) return fallback;

    return Math.max(min, value);
}

function getInteger(id, fallback = 1, min = 1) {
    return Math.max(min, Math.floor(getNumber(id, fallback, min)));
}

function setSummary(html, total) {
    const summary = document.getElementById("summary-details");
    const display = document.getElementById("total-price-display");

    if (summary) summary.innerHTML = html;
    if (display) display.innerText = formatRupiah(total);
}

// ----------------------------------------------------------
// Tab
// ----------------------------------------------------------

function switchTab(tabKey) {
    currentTab = tabKey;

    document.querySelectorAll(".tab-btn").forEach(btn => {
        btn.classList.remove("bg-cmyk-cyan", "text-navy-950");
        btn.classList.add("bg-slate-800/60", "text-slate-400");
    });

    const activeBtn = document.getElementById(`tab-${tabKey}`);

    if (activeBtn) {
        activeBtn.classList.add("bg-cmyk-cyan", "text-navy-950");
        activeBtn.classList.remove("bg-slate-800/60", "text-slate-400");
    }

    document.querySelectorAll(".tab-content").forEach(content => {
        content.classList.add("hidden");
    });

    const activeContent = document.getElementById(`form-${tabKey}`);

    if (activeContent) {
        activeContent.classList.remove("hidden");
    }

    calculatePrice();
}

// ----------------------------------------------------------
// Quick calculator
// ----------------------------------------------------------

function quickSetCalc(type) {
    if (type === "skripsi") {
        switchTab("dokumen");

        const binding = document.getElementById("doc-binding");
        if (binding) binding.value = "hardcover";

    } else if (type === "banner") {
        switchTab("spanduk");
    }

    // switchTab() sudah menjalankan calculatePrice()
    const calculator = document.getElementById("kalkulator");

    if (calculator) {
        calculator.scrollIntoView({ behavior: "smooth" });
    }
}

// ----------------------------------------------------------
// Kalkulator utama
// ----------------------------------------------------------

function calculatePrice() {
    let total = 0;
    let summaryHTML = "";

    // ======================================================
    // DOKUMEN
    // ======================================================

    if (currentTab === "dokumen") {
        const paperEl = document.getElementById("doc-paper");
        const colorEl = document.getElementById("doc-color");
        const bindingEl = document.getElementById("doc-binding");

        if (!paperEl || !colorEl || !bindingEl) return;

        const paper = paperEl.value;
        const color = colorEl.value;
        const pages = getInteger("doc-pages", 1, 1);
        const copies = getInteger("doc-copies", 1, 1);
        const binding = bindingEl.value;

        const pricePerPage = PRICING.dokumen[paper]?.[color] ?? 0;
        const bindingPrice = PRICING.dokumen.binding[binding] ?? 0;

        const printCost = pricePerPage * pages * copies;
        const bindingCost = bindingPrice * copies;

        total = printCost + bindingCost;

        summaryHTML = `
            <div class="flex justify-between gap-4">
                <span>Kategori:</span>
                <strong class="text-white">${CALCULATOR_LABELS.paper[paper] || paper}</strong>
            </div>

            <div class="flex justify-between gap-4">
                <span>Cetak:</span>
                <strong class="text-white">${formatRupiah(printCost)}</strong>
            </div>

            <div class="flex justify-between gap-4">
                <span>${pages} halaman × ${copies} rangkap:</span>
                <strong class="text-white">${formatRupiah(printCost)}</strong>
            </div>

            <div class="flex justify-between gap-4">
                <span>Jilid:</span>
                <strong class="text-white">${CALCULATOR_LABELS.binding[binding] || binding}</strong>
            </div>

            <div class="flex justify-between gap-4">
                <span>Biaya Jilid:</span>
                <strong class="text-white">${formatRupiah(bindingCost)}</strong>
            </div>
        `;
    }

    // ======================================================
    // SPANDUK
    // ======================================================

    else if (currentTab === "spanduk") {
        const length = getNumber("banner-length", 1, 0.1);
        const width = getNumber("banner-width", 1, 0.1);
        const materialEl = document.getElementById("banner-material");
        const finishingEl = document.getElementById("banner-finishing");

        if (!materialEl || !finishingEl) return;

        const material = materialEl.value;
        const finishing = finishingEl.value;
        const qty = getInteger("banner-qty", 1, 1);

        const area = length * width;
        const unitPrice = PRICING.spanduk[material] ?? 0;
        const finishingPrice = PRICING.spanduk.finishing[finishing] ?? 0;

        const printPerPiece = area * unitPrice;
        const perPiece = Math.ceil(printPerPiece + finishingPrice);

        total = perPiece * qty;

        summaryHTML = `
            <div class="flex justify-between gap-4">
                <span>Kategori:</span>
                <strong class="text-white">Spanduk Flexi</strong>
            </div>

            <div class="flex justify-between gap-4">
                <span>Ukuran:</span>
                <strong class="text-white">${length} m × ${width} m</strong>
            </div>

            <div class="flex justify-between gap-4">
                <span>Luas:</span>
                <strong class="text-white">${area.toFixed(2)} m²</strong>
            </div>

            <div class="flex justify-between gap-4">
                <span>Bahan:</span>
                <strong class="text-white">${CALCULATOR_LABELS.bannerMaterial[material] || material}</strong>
            </div>

            <div class="flex justify-between gap-4">
                <span>Finishing:</span>
                <strong class="text-white">${CALCULATOR_LABELS.bannerFinishing[finishing] || finishing}</strong>
            </div>

            <div class="flex justify-between gap-4">
                <span>Jumlah:</span>
                <strong class="text-white">${qty} lembar</strong>
            </div>

            <div class="flex justify-between gap-4 pt-2 border-t border-slate-800">
                <span>Harga / lembar:</span>
                <strong class="text-white">${formatRupiah(perPiece)}</strong>
            </div>
        `;
    }

    // ======================================================
    // STIKER
    // ======================================================

    else if (currentTab === "stiker") {
        const materialEl = document.getElementById("stiker-material");
        const cutEl = document.getElementById("stiker-cut");

        if (!materialEl || !cutEl) return;

        const material = materialEl.value;
        const cut = cutEl.value;
        const qty = getInteger("stiker-qty", 1, 1);

        const materialPrice = PRICING.stiker[material] ?? 0;
        const cutPrice = PRICING.stiker.cut[cut] ?? 0;

        const pricePerSheet = materialPrice + cutPrice;

        total = pricePerSheet * qty;

        summaryHTML = `
            <div class="flex justify-between gap-4">
                <span>Kategori:</span>
                <strong class="text-white">Stiker Label A3+</strong>
            </div>

            <div class="flex justify-between gap-4">
                <span>Bahan:</span>
                <strong class="text-white">${CALCULATOR_LABELS.stickerMaterial[material] || material}</strong>
            </div>

            <div class="flex justify-between gap-4">
                <span>Potong:</span>
                <strong class="text-white">${CALCULATOR_LABELS.stickerCut[cut] || cut}</strong>
            </div>

            <div class="flex justify-between gap-4">
                <span>Jumlah:</span>
                <strong class="text-white">${qty} lembar A3+</strong>
            </div>

            <div class="flex justify-between gap-4 pt-2 border-t border-slate-800">
                <span>Harga / lembar:</span>
                <strong class="text-white">${formatRupiah(pricePerSheet)}</strong>
            </div>
        `;
    }

    // ======================================================
    // KARTU NAMA
    // ======================================================

    else if (currentTab === "kartu") {
        const paperEl = document.getElementById("kartu-paper");
        const laminationEl = document.getElementById("kartu-lamination");

        if (!paperEl || !laminationEl) return;

        const paper = paperEl.value;
        const lamination = laminationEl.value;
        const qty = getInteger("kartu-qty", 1, 1);

        const paperPrice = PRICING.kartu[paper] ?? 0;
        const laminationPrice = PRICING.kartu.lamination[lamination] ?? 0;

        const pricePerBox = paperPrice + laminationPrice;

        total = pricePerBox * qty;

        summaryHTML = `
            <div class="flex justify-between gap-4">
                <span>Kategori:</span>
                <strong class="text-white">Kartu Nama</strong>
            </div>

            <div class="flex justify-between gap-4">
                <span>Bahan:</span>
                <strong class="text-white">${CALCULATOR_LABELS.kartuPaper[paper] || paper}</strong>
            </div>

            <div class="flex justify-between gap-4">
                <span>Laminasi:</span>
                <strong class="text-white">${CALCULATOR_LABELS.lamination[lamination] || lamination}</strong>
            </div>

            <div class="flex justify-between gap-4">
                <span>Jumlah:</span>
                <strong class="text-white">${qty} box</strong>
            </div>

            <div class="flex justify-between gap-4 pt-2 border-t border-slate-800">
                <span>Harga / box:</span>
                <strong class="text-white">${formatRupiah(pricePerBox)}</strong>
            </div>

            <div class="text-[10px] text-slate-500 pt-1">
                1 box = 100 lembar
            </div>
        `;
    }

    setSummary(summaryHTML, total);
}
