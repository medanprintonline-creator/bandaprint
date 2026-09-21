/* BandaAcehPrint.com - Calculator */
(function () {
    'use strict';

    window.currentTab = 'dokumen';
    window.uploadedFileName = '';

    const PRICING = window.PRICING = {
        dokumen: {
            A4: { bw: 350, 'full-color': 1000, mixed: 600 },
            F4: { bw: 400, 'full-color': 1200, mixed: 700 },
            A3: { bw: 1000, 'full-color': 3000, mixed: 2000 },
            binding: { none: 0, hardcover: 35000, softcover: 15000, spiral: 12000, lakban: 5000 }
        },
        spanduk: {
            flexi280: 25000,
            flexi340: 35000,
            korchin: 50000,
            finishing: { 'mata-ayam': 0, selongsong: 2000, polos: 0 }
        },
        stiker: {
            chromo: 12000,
            vinyl: 20000,
            transparan: 22000,
            cut: { 'kiss-cut': 3000, 'die-cut': 5000 }
        },
        kartu: {
            ac260: 35000,
            'bw-local': 50000,
            lamination: { none: 0, doff: 10000, glossy: 10000 }
        }
    };

    const LABELS = {
        paper: { A4: 'A4', F4: 'F4 / Folio', A3: 'A3' },
        color: { bw: 'Hitam Putih', 'full-color': 'Full Color', mixed: 'Campuran B&W + Warna' },
        binding: { none: 'Tanpa Jilid', hardcover: 'Hardcover Skripsi', softcover: 'Softcover', spiral: 'Jilid Spiral', lakban: 'Jilid Lakban + Cover Mika' },
        bannerMaterial: { flexi280: 'Flexi Standard 280g', flexi340: 'Flexi High-Res 340g', korchin: 'Flexi Korchin 440g' },
        bannerFinishing: { 'mata-ayam': 'Mata Ayam 4 Sudut', selongsong: 'Selongsong Kayu / Bambu', polos: 'Polos' },
        stickerMaterial: { chromo: 'Chromo', vinyl: 'Vinyl Anti Air', transparan: 'Transparan Clear' },
        stickerCut: { 'kiss-cut': 'Kiss Cut', 'die-cut': 'Die Cut' },
        kartuPaper: { ac260: 'Art Carton 260gr', 'bw-local': 'BW Local Textured Paper' },
        lamination: { none: 'Tanpa Laminasi', doff: 'Laminasi Doff', glossy: 'Laminasi Glossy' }
    };

    function rupiah(value) {
        return `Rp ${Math.round(Number(value) || 0).toLocaleString('id-ID')}`;
    }

    function numberValue(id, fallback, min) {
        const el = document.getElementById(id);
        if (!el) return fallback;
        const n = Number(el.value);
        return Number.isFinite(n) ? Math.max(min, n) : fallback;
    }

    function integerValue(id, fallback, min) {
        return Math.floor(numberValue(id, fallback, min));
    }

    function setSummary(html, total) {
        const summary = document.getElementById('summary-details');
        const display = document.getElementById('total-price-display');
        if (summary) summary.innerHTML = html;
        if (display) display.textContent = rupiah(total);
    }

    window.switchTab = function (tabKey) {
        const validTabs = ['dokumen', 'spanduk', 'stiker', 'kartu'];
        if (!validTabs.includes(tabKey)) return;

        window.currentTab = tabKey;

        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.remove('bg-cmyk-cyan', 'text-navy-950');
            btn.classList.add('bg-slate-800/60', 'text-slate-400');
        });

        const activeBtn = document.getElementById(`tab-${tabKey}`);
        if (activeBtn) {
            activeBtn.classList.add('bg-cmyk-cyan', 'text-navy-950');
            activeBtn.classList.remove('bg-slate-800/60', 'text-slate-400');
        }

        document.querySelectorAll('.tab-content').forEach(content => content.classList.add('hidden'));
        const activeContent = document.getElementById(`form-${tabKey}`);
        if (activeContent) activeContent.classList.remove('hidden');

        window.calculatePrice();
    };

    window.quickSetCalc = function (type) {
        if (type === 'skripsi') {
            window.switchTab('dokumen');
            const binding = document.getElementById('doc-binding');
            if (binding) binding.value = 'hardcover';
        } else if (type === 'banner') {
            window.switchTab('spanduk');
        } else {
            return;
        }

        window.calculatePrice();
        document.getElementById('kalkulator')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };

    window.calculatePrice = function () {
        let total = 0;
        let summary = '';
        const tab = window.currentTab;

        if (tab === 'dokumen') {
            const paper = document.getElementById('doc-paper')?.value || 'A4';
            const color = document.getElementById('doc-color')?.value || 'bw';
            const pages = integerValue('doc-pages', 1, 1);
            const copies = integerValue('doc-copies', 1, 1);
            const binding = document.getElementById('doc-binding')?.value || 'none';
            const pagePrice = PRICING.dokumen[paper]?.[color] ?? 0;
            const bindingPrice = PRICING.dokumen.binding[binding] ?? 0;
            const printCost = pagePrice * pages * copies;
            const bindingCost = bindingPrice * copies;
            total = printCost + bindingCost;
            summary = `
                <div class="flex justify-between gap-4"><span>Kategori:</span><strong class="text-white">Dokumen ${LABELS.paper[paper] || paper}</strong></div>
                <div class="flex justify-between gap-4"><span>Cetak:</span><strong class="text-white">${rupiah(printCost)}</strong></div>
                <div class="flex justify-between gap-4"><span>${pages} halaman × ${copies} rangkap</span><strong class="text-white">${rupiah(printCost)}</strong></div>
                <div class="flex justify-between gap-4"><span>Jilid:</span><strong class="text-white">${LABELS.binding[binding] || binding}</strong></div>
                <div class="flex justify-between gap-4"><span>Biaya Jilid:</span><strong class="text-white">${rupiah(bindingCost)}</strong></div>`;
        } else if (tab === 'spanduk') {
            const length = numberValue('banner-length', 1, 0.1);
            const width = numberValue('banner-width', 1, 0.1);
            const material = document.getElementById('banner-material')?.value || 'flexi280';
            const finishing = document.getElementById('banner-finishing')?.value || 'mata-ayam';
            const qty = integerValue('banner-qty', 1, 1);
            const area = length * width;
            const unitPrice = PRICING.spanduk[material] ?? 0;
            const finishingPrice = PRICING.spanduk.finishing[finishing] ?? 0;
            const perPiece = Math.ceil(area * unitPrice + finishingPrice);
            total = perPiece * qty;
            summary = `
                <div class="flex justify-between gap-4"><span>Kategori:</span><strong class="text-white">Spanduk Flexi</strong></div>
                <div class="flex justify-between gap-4"><span>Ukuran:</span><strong class="text-white">${length}m × ${width}m (${area.toFixed(2)} m²)</strong></div>
                <div class="flex justify-between gap-4"><span>Bahan:</span><strong class="text-white">${LABELS.bannerMaterial[material] || material}</strong></div>
                <div class="flex justify-between gap-4"><span>Finishing:</span><strong class="text-white">${LABELS.bannerFinishing[finishing] || finishing}</strong></div>
                <div class="flex justify-between gap-4"><span>Jumlah:</span><strong class="text-white">${qty} lembar</strong></div>`;
        } else if (tab === 'stiker') {
            const material = document.getElementById('stiker-material')?.value || 'chromo';
            const cut = document.getElementById('stiker-cut')?.value || 'kiss-cut';
            const qty = integerValue('stiker-qty', 1, 1);
            const basePrice = PRICING.stiker[material] ?? 0;
            const cutPrice = PRICING.stiker.cut[cut] ?? 0;
            total = (basePrice + cutPrice) * qty;
            summary = `
                <div class="flex justify-between gap-4"><span>Kategori:</span><strong class="text-white">Stiker Label A3+</strong></div>
                <div class="flex justify-between gap-4"><span>Bahan:</span><strong class="text-white">${LABELS.stickerMaterial[material] || material}</strong></div>
                <div class="flex justify-between gap-4"><span>Cutting:</span><strong class="text-white">${LABELS.stickerCut[cut] || cut}</strong></div>
                <div class="flex justify-between gap-4"><span>Jumlah:</span><strong class="text-white">${qty} lembar A3+</strong></div>`;
        } else if (tab === 'kartu') {
            const paper = document.getElementById('kartu-paper')?.value || 'ac260';
            const lamination = document.getElementById('kartu-lamination')?.value || 'none';
            const qty = integerValue('kartu-qty', 1, 1);
            const basePrice = PRICING.kartu[paper] ?? 0;
            const lamPrice = PRICING.kartu.lamination[lamination] ?? 0;
            total = (basePrice + lamPrice) * qty;
            summary = `
                <div class="flex justify-between gap-4"><span>Kategori:</span><strong class="text-white">Kartu Nama</strong></div>
                <div class="flex justify-between gap-4"><span>Kertas:</span><strong class="text-white">${LABELS.kartuPaper[paper] || paper}</strong></div>
                <div class="flex justify-between gap-4"><span>Laminasi:</span><strong class="text-white">${LABELS.lamination[lamination] || lamination}</strong></div>
                <div class="flex justify-between gap-4"><span>Jumlah:</span><strong class="text-white">${qty} box</strong></div>
                <div class="text-[10px] text-slate-500 pt-1">1 box = 100 lembar</div>`;
        }

        setSummary(summary, total);
    };

    window.handleFileUpload = function (files) {
        const file = files?.[0];
        if (!file) return;
        const maxSize = 50 * 1024 * 1024;
        const allowed = /\.(pdf|cdr|psd|zip|jpg|jpeg)$/i;
        if (file.size > maxSize) {
            alert('Ukuran file maksimal 50MB.');
            document.getElementById('file-input').value = '';
            return;
        }
        if (!allowed.test(file.name)) {
            alert('Format file yang didukung: PDF, CDR, PSD, ZIP, JPG/JPEG.');
            document.getElementById('file-input').value = '';
            return;
        }
        window.uploadedFileName = file.name;
        document.getElementById('file-name').textContent = file.name;
        document.getElementById('file-info').classList.remove('hidden');
    };

    window.removeFile = function () {
        window.uploadedFileName = '';
        const input = document.getElementById('file-input');
        if (input) input.value = '';
        document.getElementById('file-info')?.classList.add('hidden');
    };

    document.addEventListener('DOMContentLoaded', () => {
        window.switchTab('dokumen');
        const dropZone = document.getElementById('drop-zone');
        const fileInput = document.getElementById('file-input');
        if (dropZone && fileInput) {
            ['dragenter', 'dragover'].forEach(eventName => dropZone.addEventListener(eventName, e => {
                e.preventDefault(); dropZone.classList.add('border-cmyk-cyan');
            }));
            ['dragleave', 'drop'].forEach(eventName => dropZone.addEventListener(eventName, e => {
                e.preventDefault(); dropZone.classList.remove('border-cmyk-cyan');
            }));
            dropZone.addEventListener('drop', e => window.handleFileUpload(e.dataTransfer.files));
        }
    });
})();
