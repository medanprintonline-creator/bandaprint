/* ==========================================
   BandaAcehPrint.com - Main Application Script
   ========================================== */

// State variables
let currentTab = 'dokumen';
let uploadedFileName = '';
let deferredPwaPrompt = null;

// Price Configuration Matrix
const PRICING = {
    dokumen: {
        A4: { bw: 350, 'full-color': 1000 },
        F4: { bw: 400, 'full-color': 1200 },
        A3: { bw: 1000, 'full-color': 3000 },
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
            'mata-ayam': 0,
            'selongsong': 2000,
            'polos': 0
        }
    },
    stiker: {
        chromo: 12000,
        vinyl: 20000,
        transparan: 22000,
        cut: {
            'kiss-cut': 3000,
            'die-cut': 5000
        }
    },
    kartu: {
        ac260: 35000,
        'bw-local': 50000,
        lamination: {
            none: 0,
            doff: 10000,
            glossy: 10000
        }
    }
};

// Tab Switching Logic
function switchTab(tabKey) {
    currentTab = tabKey;
    
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('bg-cmyk-cyan', 'text-navy-950');
        btn.classList.add('bg-slate-800/60', 'text-slate-400');
    });
    const activeBtn = document.getElementById(`tab-${tabKey}`);
    if (activeBtn) {
        activeBtn.classList.add('bg-cmyk-cyan', 'text-navy-950');
        activeBtn.classList.remove('bg-slate-800/60', 'text-slate-400');
    }

    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.add('hidden');
    });
    const activeContent = document.getElementById(`form-${tabKey}`);
    if (activeContent) {
        activeContent.classList.remove('hidden');
    }

    calculatePrice();
}

// Toggle input halaman khusus tipe Campuran (B&W + Warna)
function toggleMixedPagesInput() {
    const colorType = document.getElementById('doc-color').value;
    const stdContainer = document.getElementById('standard-pages-container');
    const mixedContainer = document.getElementById('mixed-pages-container');

    if (colorType === 'mixed') {
        stdContainer.classList.add('hidden');
        mixedContainer.classList.remove('hidden');
    } else {
        stdContainer.classList.remove('hidden');
        mixedContainer.classList.add('hidden');
    }
}

// Quick set calculator dari Hero Card
function quickSetCalc(type) {
    if (type === 'skripsi') {
        switchTab('dokumen');
        document.getElementById('doc-binding').value = 'hardcover';
    } else if (type === 'banner') {
        switchTab('spanduk');
    }
    calculatePrice();
    document.getElementById('kalkulator').scrollIntoView({ behavior: 'smooth' });
}

// Main Price Calculation Logic
function calculatePrice() {
    let total = 0;
    let summaryHTML = '';

    if (currentTab === 'dokumen') {
        const paper = document.getElementById('doc-paper').value;
        const color = document.getElementById('doc-color').value;
        const binding = document.getElementById('doc-binding').value;
        const bindingCost = PRICING.dokumen.binding[binding];

        if (color === 'mixed') {
            const pagesBW = parseInt(document.getElementById('doc-pages-bw').value) || 0;
            const pagesColor = parseInt(document.getElementById('doc-pages-color').value) || 0;
            const copies = parseInt(document.getElementById('doc-copies-mixed').value) || 1;
            const totalPages = pagesBW + pagesColor;

            const bwUnitPrice = PRICING.dokumen[paper].bw;
            const colorUnitPrice = PRICING.dokumen[paper]['full-color'];

            const bwCost = pagesBW * bwUnitPrice;
            const colorCost = pagesColor * colorUnitPrice;
            const pageCost = bwCost + colorCost;

            total = (pageCost + bindingCost) * copies;

            summaryHTML = `
                <div class="flex justify-between"><span>Kategori:</span> <strong class="text-white">Dokumen (${paper})</strong></div>
                <div class="flex justify-between"><span>Hitam Putih (${pagesBW} hlm x Rp ${bwUnitPrice.toLocaleString('id-ID')}):</span> <strong class="text-white">Rp ${(bwCost * copies).toLocaleString('id-ID')}</strong></div>
                <div class="flex justify-between"><span>Warna (${pagesColor} hlm x Rp ${colorUnitPrice.toLocaleString('id-ID')}):</span> <strong class="text-white">Rp ${(colorCost * copies).toLocaleString('id-ID')}</strong></div>
                <div class="flex justify-between"><span>Total Halaman / Rangkap:</span> <strong class="text-white">${totalPages} hlm (${copies} rkp)</strong></div>
                <div class="flex justify-between"><span>Jilid (${binding}):</span> <strong class="text-white">Rp ${(bindingCost * copies).toLocaleString('id-ID')}</strong></div>
            `;
        } else {
            const pages = parseInt(document.getElementById('doc-pages').value) || 1;
            const copies = parseInt(document.getElementById('doc-copies').value) || 1;

            const unitPrice = PRICING.dokumen[paper][color];
            const pageCost = unitPrice * pages;

            total = (pageCost + bindingCost) * copies;

            summaryHTML = `
                <div class="flex justify-between"><span>Kategori:</span> <strong class="text-white">Dokumen (${paper})</strong></div>
                <div class="flex justify-between"><span>Cetak (${pages} hlm x ${copies} rkp):</span> <strong class="text-white">Rp ${(pageCost * copies).toLocaleString('id-ID')}</strong></div>
                <div class="flex justify-between"><span>Jilid (${binding}):</span> <strong class="text-white">Rp ${(bindingCost * copies).toLocaleString('id-ID')}</strong></div>
            `;
        }
    } 
    else if (currentTab === 'spanduk') {
        const length = parseFloat(document.getElementById('banner-length').value) || 1;
        const width = parseFloat(document.getElementById('banner-width').value) || 1;
        const material = document.getElementById('banner-material').value;
        const finishing = document.getElementById('banner-finishing').value;
        const qty = parseInt(document.getElementById('banner-qty').value) || 1;

        const area = length * width;
        const unitPrice = PRICING.spanduk[material];
        const finishingCost = PRICING.spanduk.finishing[finishing];
        
        total = Math.ceil(area * unitPrice + finishingCost) * qty;

        summaryHTML = `
            <div class="flex justify-between"><span>Kategori:</span> <strong class="text-white">Spanduk Flexi</strong></div>
            <div class="flex justify-between"><span>Ukuran Total:</span> <strong class="text-white">${length}m x ${width}m (${area.toFixed(2)} m²)</strong></div>
            <div class="flex justify-between"><span>Jumlah:</span> <strong class="text-white">${qty} Lembar</strong></div>
        `;
    }
    else if (currentTab === 'stiker') {
        const material = document.getElementById('stiker-material').value;
        const cut = document.getElementById('stiker-cut').value;
        const qty = parseInt(document.getElementById('stiker-qty').value) || 1;

        const basePrice = PRICING.stiker[material];
        const cutPrice = PRICING.stiker.cut[cut];

        total = (basePrice + cutPrice) * qty;

        summaryHTML = `
            <div class="flex justify-between"><span>Kategori:</span> <strong class="text-white">Stiker Label A3+</strong></div>
            <div class="flex justify-between"><span>Bahan & Cut:</span> <strong class="text-white">${material} (${cut})</strong></div>
            <div class="flex justify-between"><span>Jumlah Lembar:</span> <strong class="text-white">${qty} Lembar A3+</strong></div>
        `;
    }
    else if (currentTab === 'kartu') {
        const paper = document.getElementById('kartu-paper').value;
        const lamination = document.getElementById('kartu-lamination').value;
        const qty = parseInt(document.getElementById('kartu-qty').value) || 1;

        const basePrice = PRICING.kartu[paper];
        const lamPrice = PRICING.kartu.lamination[lamination];

        total = (basePrice + lamPrice) * qty;

        summaryHTML = `
            <div class="flex justify-between"><span>Kategori:</span> <strong class="text-white">Kartu Nama</strong></div>
            <div class="flex justify-between"><span>Spesifikasi:</span> <strong class="text-white">${paper} (${lamination})</strong></div>
            <div class="flex justify-between"><span>Jumlah Box:</span> <strong class="text-white">${qty} Box</strong></div>
        `;
    }

    // Display formatted result
    document.getElementById('total-price-display').innerText = `Rp ${total.toLocaleString('id-ID')}`;
    document.getElementById('summary-details').innerHTML = summaryHTML;
}

// File Drag & Drop Handlers
function handleFileUpload(files) {
    if (files && files[0]) {
        uploadedFileName = files[0].name;
        document.getElementById('file-name').innerText = uploadedFileName;
        document.getElementById('file-info').classList.remove('hidden');
    }
}

function removeFile() {
    uploadedFileName = '';
    document.getElementById('file-input').value = '';
    document.getElementById('file-info').classList.add('hidden');
}

// Format and send order payload to WhatsApp
function sendOrderToWhatsApp() {
    const price = document.getElementById('total-price-display').innerText;
    let message = `Halo BandaAcehPrint.com,%0ASaya%20ingin%20memesan%20layanan%20cetak:%0A%0A`;
    message += `*Kategori:* ${currentTab.toUpperCase()}%0A`;
    message += `*Total Estimasi:* ${price}%0A`;
    if (uploadedFileName) {
        message += `*File Berkas:* ${uploadedFileName}%0A`;
    }
    message += `%0AMohon%20konfirmasi%20pembayaran%20dan%20waktu%20pengerjaan.`;

    window.open(`https://wa.me/6281269000000?text=${message}`, '_blank');
}

// Order Tracking Simulation
function simulateOrderTrack() {
    const inputVal = document.getElementById('track-id').value.trim();
    if (!inputVal) {
        alert('Silakan masukkan ID Pesanan Anda terlebih dahulu.');
        return;
    }

    document.getElementById('res-id').innerText = inputVal.toUpperCase();
    document.getElementById('res-name').innerText = 'Order Cetak Skripsi & Banner';
    document.getElementById('track-result').classList.remove('hidden');
}

// FAQ Accordion Toggle
function toggleFaq(element) {
    const answer = element.querySelector('p');
    const icon = element.querySelector('i');
    
    if (answer.classList.contains('hidden')) {
        answer.classList.remove('hidden');
        icon.classList.add('rotate-180');
    } else {
        answer.classList.add('hidden');
        icon.classList.remove('rotate-180');
    }
}

// Progressive Web App (PWA) Event Handling
window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPwaPrompt = e;
    
    const pwaBtn = document.getElementById('pwa-install-btn');
    const pwaBanner = document.getElementById('pwa-banner');
    
    if (pwaBtn) pwaBtn.classList.remove('hidden');
    if (pwaBanner) pwaBanner.classList.remove('hidden');
});

function triggerPwaInstall() {
    if (deferredPwaPrompt) {
        deferredPwaPrompt.prompt();
        deferredPwaPrompt.userChoice.then((choiceResult) => {
            if (choiceResult.outcome === 'accepted') {
                console.log('PWA installation accepted by user');
            }
            deferredPwaPrompt = null;
            dismissPwaBanner();
        });
    }
}

function dismissPwaBanner() {
    const pwaBanner = document.getElementById('pwa-banner');
    if (pwaBanner) pwaBanner.classList.add('hidden');
}

// Initial calculation on load
window.onload = function() {
    calculatePrice();
};
