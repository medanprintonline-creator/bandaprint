/* ============================================================
   BandaAcehPrint - app.js
   ============================================================ */
'use strict';

// STATE
let currentTab = 'dokumen';
let deferredPwaPrompt = null;

const VALID_TABS = ['dokumen', 'spanduk', 'stiker', 'kartu'];

// PRICING
const PRICING = {
    dokumen: {
        A4: { bw: 350, 'full-color': 1000, mixed: 600 },
        F4: { bw: 400, 'full-color': 1200, mixed: 700 },
        A3: { bw: 1000, 'full-color': 3000, mixed: 2000 },
        binding: { none: 0, hardcover: 35000, softcover: 15000, spiral: 12000, lakban: 5000 }
    },
    spanduk: {
        flexi280: 25000, flexi340: 35000, korchin: 50000,
        finishing: { 'mata-ayam': 0, selongsong: 2000, polos: 0 }
    },
    stiker: {
        chromo: 12000, vinyl: 20000, transparan: 22000,
        cut: { 'kiss-cut': 3000, 'die-cut': 5000 }
    },
    kartu: {
        ac260: 35000, 'bw-local': 50000,
        lamination: { none: 0, doff: 10000, glossy: 10000 }
    }
};

const LABELS = {
    paper: { A4: 'A4', F4: 'F4 / Folio', A3: 'A3' },
    color: { bw: 'Hitam Putih', 'full-color': 'Full Color', mixed: 'Campuran' },
    binding: { none: 'Tanpa Jilid', hardcover: 'Hardcover + Pita Emas', softcover: 'Softcover', spiral: 'Jilid Spiral', lakban: 'Jilid Lakban' },
    bannerMaterial: { flexi280: 'Flexi Standard 280g', flexi340: 'Flexi High-Res 340g', korchin: 'Flexi Korchin 440g' },
    bannerFinishing: { 'mata-ayam': 'Mata Ayam', selongsong: 'Selongsong Kayu', polos: 'Polos' },
    stickerMaterial: { chromo: 'Chromo', vinyl: 'Vinyl Anti Air', transparan: 'Transparan' },
    stickerCut: { 'kiss-cut': 'Kiss Cut', 'die-cut': 'Die Cut' },
    kartuPaper: { ac260: 'Art Carton 260gr', 'bw-local': 'BW Local Paper' },
    lamination: { none: 'Tanpa Laminasi', doff: 'Doff Mat', glossy: 'Glossy' }
};

// HELPERS
const rupiah = n => `Rp ${Math.round(Number(n) || 0).toLocaleString('id-ID')}`;
const num = (id, fallback = 1, min = 1) => {
    const el = document.getElementById(id);
    const v = el ? Number(el.value) : NaN;
    return Number.isFinite(v) ? Math.max(min, v) : fallback;
};
const integer = (id, fallback = 1, min = 1) =>
    Math.max(min, Math.floor(num(id, fallback, min)));

// TAB MANAGEMENT
function switchTab(tabKey, updateHash = true) {
    if (!VALID_TABS.includes(tabKey)) return;
    currentTab = tabKey;

    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('bg-cmyk-cyan', 'text-navy-950');
        btn.classList.add('bg-slate-800/60', 'text-slate-400');
        btn.setAttribute('aria-selected', 'false');
    });

    const activeBtn = document.getElementById(`tab-${tabKey}`);
    if (activeBtn) {
        activeBtn.classList.add('bg-cmyk-cyan', 'text-navy-950');
        activeBtn.classList.remove('bg-slate-800/60', 'text-slate-400');
        activeBtn.setAttribute('aria-selected', 'true');
    }

    document.querySelectorAll('.tab-content').forEach(c => c.classList.add('hidden'));
    const form = document.getElementById(`form-${tabKey}`);
    if (form) form.classList.remove('hidden');

    calculatePrice();

    if (updateHash && typeof history.replaceState === 'function') {
        history.replaceState(null, '', `#kalkulator-${tabKey}`);
    }
}

function initTabFromHash() {
    const hash = window.location.hash.replace('#', '');
    const match = hash.match(/^(?:kalkulator-)?(dokumen|spanduk|stiker|kartu)$/);
    if (match) switchTab(match[1], false);
}

// QUICK SET
function quickSetCalc(type) {
    if (type === 'skripsi') {
        switchTab('dokumen');
        const bind = document.getElementById('doc-binding');
        if (bind) bind.value = 'hardcover';
    }
    if (type === 'banner') switchTab('spanduk');
    calculatePrice();
    document.getElementById('kalkulator')?.scrollIntoView({ behavior: 'smooth' });
}

// CALCULATE
function calculatePrice() {
    let total = 0;
    let summary = '';

    if (currentTab === 'dokumen') {
        const p = document.getElementById('doc-paper').value;
        const c = document.getElementById('doc-color').value;
        const b = document.getElementById('doc-binding').value;
        const pages = integer('doc-pages');
        const copies = integer('doc-copies');

        const unitPrint = PRICING.dokumen[p]?.[c] || 0;
        const print = unitPrint * pages * copies;
        const bind = (PRICING.dokumen.binding[b] || 0) * copies;
        total = print + bind;

        summary = `
            <div class="flex justify-between"><span>Kertas:</span><strong class="text-white">${LABELS.paper[p]}</strong></div>
            <div class="flex justify-between"><span>Warna:</span><strong class="text-white">${LABELS.color[c]}</strong></div>
            <div class="flex justify-between"><span>Harga/halaman:</span><strong class="text-white">${rupiah(unitPrint)}</strong></div>
            <div class="flex justify-between"><span>${pages} hal × ${copies} rangkap:</span><strong class="text-white">${rupiah(print)}</strong></div>
            <div class="flex justify-between"><span>Jilid:</span><strong class="text-white">${LABELS.binding[b]}</strong></div>
            <div class="flex justify-between"><span>Biaya Jilid:</span><strong class="text-white">${rupiah(bind)}</strong></div>`;
    } else if (currentTab === 'spanduk') {
        const l = num('banner-length', 1, 0.1);
        const w = num('banner-width', 1, 0.1);
        const m = document.getElementById('banner-material').value;
        const f = document.getElementById('banner-finishing').value;
        const q = integer('banner-qty');

        const area = l * w;
        const per = Math.ceil(area * (PRICING.spanduk[m] || 0) + (PRICING.spanduk.finishing[f] || 0));
        total = per * q;

        summary = `
            <div class="flex justify-between"><span>Ukuran:</span><strong class="text-white">${l} m × ${w} m</strong></div>
            <div class="flex justify-between"><span>Luas:</span><strong class="text-white">${area.toFixed(2)} m²</strong></div>
            <div class="flex justify-between"><span>Bahan:</span><strong class="text-white">${LABELS.bannerMaterial[m]}</strong></div>
            <div class="flex justify-between"><span>Finishing:</span><strong class="text-white">${LABELS.bannerFinishing[f]}</strong></div>
            <div class="flex justify-between"><span>Jumlah:</span><strong class="text-white">${q} lembar</strong></div>
            <div class="flex justify-between pt-2 border-t border-slate-800"><span>Harga/lembar:</span><strong class="text-white">${rupiah(per)}</strong></div>`;
    } else if (currentTab === 'stiker') {
        const m = document.getElementById('stiker-material').value;
        const c = document.getElementById('stiker-cut').value;
        const q = integer('stiker-qty');

        const per = (PRICING.stiker[m] || 0) + (PRICING.stiker.cut[c] || 0);
        total = per * q;

        summary = `
            <div class="flex justify-between"><span>Bahan:</span><strong class="text-white">${LABELS.stickerMaterial[m]}</strong></div>
            <div class="flex justify-between"><span>Potong:</span><strong class="text-white">${LABELS.stickerCut[c]}</strong></div>
            <div class="flex justify-between"><span>Jumlah:</span><strong class="text-white">${q} lembar A3+</strong></div>
            <div class="flex justify-between pt-2 border-t border-slate-800"><span>Harga/lembar:</span><strong class="text-white">${rupiah(per)}</strong></div>`;
    } else {
        const p = document.getElementById('kartu-paper').value;
        const l = document.getElementById('kartu-lamination').value;
        const q = integer('kartu-qty');

        const per = (PRICING.kartu[p] || 0) + (PRICING.kartu.lamination[l] || 0);
        total = per * q;

        summary = `
            <div class="flex justify-between"><span>Bahan:</span><strong class="text-white">${LABELS.kartuPaper[p]}</strong></div>
            <div class="flex justify-between"><span>Laminasi:</span><strong class="text-white">${LABELS.lamination[l]}</strong></div>
            <div class="flex justify-between"><span>Jumlah:</span><strong class="text-white">${q} box</strong></div>
            <div class="flex justify-between pt-2 border-t border-slate-800"><span>Harga/box:</span><strong class="text-white">${rupiah(per)}</strong></div>
            <div class="text-[10px] text-slate-500">1 box = 100 lembar</div>`;
    }

    const priceEl = document.getElementById('total-price-display');
    if (priceEl) priceEl.innerText = rupiah(total);

    const sumEl = document.getElementById('summary-details');
    if (sumEl) sumEl.innerHTML = summary;
}

// ORDER DETAILS
function orderDetails() {
    if (currentTab === 'dokumen') {
        const p = document.getElementById('doc-paper').value;
        const c = document.getElementById('doc-color').value;
        const b = document.getElementById('doc-binding').value;
        return [
            `Kategori: Dokumen / Skripsi`,
            `Kertas: ${LABELS.paper[p]}`,
            `Warna: ${LABELS.color[c]}`,
            `Halaman: ${integer('doc-pages')}`,
            `Rangkap: ${integer('doc-copies')}`,
            `Jilid: ${LABELS.binding[b]}`
        ];
    }
    if (currentTab === 'spanduk') {
        const l = num('banner-length', 1, 0.1);
        const w = num('banner-width', 1, 0.1);
        const m = document.getElementById('banner-material').value;
        const f = document.getElementById('banner-finishing').value;
        return [
            `Kategori: Spanduk / Flexi`,
            `Ukuran: ${l} m × ${w} m`,
            `Bahan: ${LABELS.bannerMaterial[m]}`,
            `Finishing: ${LABELS.bannerFinishing[f]}`,
            `Jumlah: ${integer('banner-qty')} lembar`
        ];
    }
    if (currentTab === 'stiker') {
        const m = document.getElementById('stiker-material').value;
        const c = document.getElementById('stiker-cut').value;
        return [
            `Kategori: Stiker & Label`,
            `Bahan: ${LABELS.stickerMaterial[m]}`,
            `Potong: ${LABELS.stickerCut[c]}`,
            `Jumlah: ${integer('stiker-qty')} lembar A3+`
        ];
    }
    const p = document.getElementById('kartu-paper').value;
    const l = document.getElementById('kartu-lamination').value;
    return [
        `Kategori: Kartu Nama`,
        `Bahan: ${LABELS.kartuPaper[p]}`,
        `Laminasi: ${LABELS.lamination[l]}`,
        `Jumlah: ${integer('kartu-qty')} box (100 lembar/box)`
    ];
}

// WHATSAPP ORDER
function sendOrderToWhatsApp() {
    const price = document.getElementById('total-price-display')?.innerText || 'Rp 0';
    const message = [
        'Halo BandaAcehPrint.com,',
        '',
        'Saya ingin memesan layanan cetak:',
        '',
        ...orderDetails(),
        '',
        `*TOTAL ESTIMASI: ${price}*`,
        '',
        '*FILE DESAIN:*',
        'Setelah pesan ini, saya akan kirim file desain via WhatsApp.',
        'Format: PDF, JPG, PNG, CDR, AI, PSD, DOC/DOCX.',
        '',
        'Mohon konfirmasi pesanan, pembayaran, dan waktu pengerjaan.'
    ].join('\n');

    const url = `https://wa.me/628116826887?text=${encodeURIComponent(message)}`;
    const win = window.open(url, '_blank', 'noopener,noreferrer');
    if (!win) window.location.href = url;
}

// PWA: SERVICE WORKER
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker
            .register('sw.js')
            .catch(err => console.warn('[PWA] SW registration failed:', err));
    });
}

// PWA: INSTALL PROMPT
const PWA_DISMISS_KEY = 'bandaacehprint-pwa-dismissed';

window.addEventListener('beforeinstallprompt', e => {
    e.preventDefault();
    deferredPwaPrompt = e;

    const dismissed = localStorage.getItem(PWA_DISMISS_KEY);
    if (dismissed && Date.now() - Number(dismissed) < 7 * 24 * 60 * 60 * 1000) return;

    document.getElementById('pwa-install-btn')?.classList.remove('hidden');
    document.getElementById('pwa-banner')?.classList.remove('hidden');
});

function triggerPwaInstall() {
    if (!deferredPwaPrompt) return;
    deferredPwaPrompt.prompt();
    deferredPwaPrompt.userChoice.finally(() => {
        deferredPwaPrompt = null;
        dismissPwaBanner();
    });
}

function dismissPwaBanner() {
    document.getElementById('pwa-banner')?.classList.add('hidden');
    try { localStorage.setItem(PWA_DISMISS_KEY, String(Date.now())); } catch (_) {}
}

window.addEventListener('appinstalled', () => {
    document.getElementById('pwa-banner')?.classList.add('hidden');
    document.getElementById('pwa-install-btn')?.classList.add('hidden');
});

// INIT
window.addEventListener('load', () => {
    initTabFromHash();
    calculatePrice();
});

window.addEventListener('hashchange', () => {
    const hash = window.location.hash.replace('#', '');
    const match = hash.match(/^(?:kalkulator-)?(dokumen|spanduk|stiker|kartu)$/);
    if (match && match[1] !== currentTab) switchTab(match[1], false);
});
