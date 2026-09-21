// Calculator logic


const PRICING = {
            dokumen: {
                A4: { bw: 350, 'full-color': 1000, mixed: 600 },
                F4: { bw: 400, 'full-color': 1200, mixed: 700 },
                A3: { bw: 1000, 'full-color': 3000, mixed: 2000 },
                binding: {
                    none: 0,
                    hardcover: 35000,
                    softcover: 15000,
                    spiral: 12000,
                    lakban: 5000
                }
            },
            spanduk: {
                flexi280: 25000, // per sqm
                flexi340: 35000,
                korchin: 50000,
                finishing: {
                    'mata-ayam': 0,
                    'selongsong': 2000,
                    'polos': 0
                }
            },
            stiker: {
                chromo: 12000, // per A3+
                vinyl: 20000,
                transparan: 22000,
                cut: {
                    'kiss-cut': 3000,
                    'die-cut': 5000
                }
            },
            kartu: {
                ac260: 35000, // per box
                'bw-local': 50000,
                lamination: {
                    none: 0,
                    doff: 10000,
                    glossy: 10000
                }
            }
        };

function switchTab(tabKey) {
            currentTab = tabKey;
            
            // Update Tab Buttons UI
            document.querySelectorAll('.tab-btn').forEach(btn => {
                btn.classList.remove('bg-cmyk-cyan', 'text-navy-950');
                btn.classList.add('bg-slate-800/60', 'text-slate-400');
            });
            const activeBtn = document.getElementById(`tab-${tabKey}`);
            if(activeBtn) {
                activeBtn.classList.add('bg-cmyk-cyan', 'text-navy-950');
                activeBtn.classList.remove('bg-slate-800/60', 'text-slate-400');
            }

            // Update Tab Content View
            document.querySelectorAll('.tab-content').forEach(content => {
                content.classList.add('hidden');
            });
            const activeContent = document.getElementById(`form-${tabKey}`);
            if(activeContent) {
                activeContent.classList.remove('hidden');
            }

            calculatePrice();
        }

function quickSetCalc(type) {
            if(type === 'skripsi') {
                switchTab('dokumen');
                document.getElementById('doc-binding').value = 'hardcover';
            } else if(type === 'banner') {
                switchTab('spanduk');
            }
            calculatePrice();
            document.getElementById('kalkulator').scrollIntoView({ behavior: 'smooth' });
        }

function calculatePrice() {
            let total = 0;
            let summaryHTML = '';

            if (currentTab === 'dokumen') {
                const paper = document.getElementById('doc-paper').value;
                const color = document.getElementById('doc-color').value;
                const pages = parseInt(document.getElementById('doc-pages').value) || 1;
                const copies = parseInt(document.getElementById('doc-copies').value) || 1;
                const binding = document.getElementById('doc-binding').value;

                const pageCost = PRICING.dokumen[paper][color] * pages;
                const bindingCost = PRICING.dokumen.binding[binding];
                total = (pageCost + bindingCost) * copies;

                summaryHTML = `
                    <div class="flex justify-between"><span>Kategori:</span> <strong class="text-white">Dokumen (${paper})</strong></div>
                    <div class="flex justify-between"><span>Cetak (${pages} hlm x ${copies} rkp):</span> <strong class="text-white">Rp ${pageCost * copies}</strong></div>
                    <div class="flex justify-between"><span>Jilid (${binding}):</span> <strong class="text-white">Rp ${bindingCost * copies}</strong></div>
                `;
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

            // Display formatted prices
            document.getElementById('total-price-display').innerText = `Rp ${total.toLocaleString('id-ID')}`;
            document.getElementById('summary-details').innerHTML = summaryHTML;
        }
