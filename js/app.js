/* BandaAcehPrint.com - Site interactions */
(function () {
    'use strict';
    let deferredPwaPrompt = null;

    window.sendOrderToWhatsApp = function () {
        const price = document.getElementById('total-price-display')?.textContent || 'Rp 0';
        const category = String(window.currentTab || 'dokumen').toUpperCase();
        const file = window.uploadedFileName || 'Belum ada file';
        const message = [
            'Halo BandaAcehPrint.com,',
            'Saya ingin memesan layanan cetak:',
            '',
            `Kategori: ${category}`,
            `Total estimasi: ${price}`,
            `File berkas: ${file}`,
            '',
            'Mohon konfirmasi harga final, pembayaran, dan waktu pengerjaan.'
        ].join('\n');
        window.open(`https://wa.me/6281269000000?text=${encodeURIComponent(message)}`, '_blank', 'noopener');
    };

    window.simulateOrderTrack = function () {
        const input = document.getElementById('track-id');
        const id = input?.value.trim();
        if (!id) {
            alert('Silakan masukkan ID Pesanan Anda terlebih dahulu.');
            return;
        }
        document.getElementById('res-id').textContent = id.toUpperCase();
        document.getElementById('res-name').textContent = 'Order Cetak Skripsi & Banner';
        document.getElementById('track-result')?.classList.remove('hidden');
    };

    window.toggleFaq = function (element) {
        const answer = element?.querySelector('p');
        const icon = element?.querySelector('i');
        if (!answer) return;
        const open = !answer.classList.contains('hidden');
        answer.classList.toggle('hidden', open);
        icon?.classList.toggle('rotate-180', !open);
    };

    window.triggerPwaInstall = async function () {
        if (!deferredPwaPrompt) return;
        deferredPwaPrompt.prompt();
        try { await deferredPwaPrompt.userChoice; } finally {
            deferredPwaPrompt = null;
            window.dismissPwaBanner();
        }
    };

    window.dismissPwaBanner = function () {
        document.getElementById('pwa-banner')?.classList.add('hidden');
    };

    window.addEventListener('beforeinstallprompt', event => {
        event.preventDefault();
        deferredPwaPrompt = event;
        document.getElementById('pwa-install-btn')?.classList.remove('hidden');
        document.getElementById('pwa-banner')?.classList.remove('hidden');
    });

    document.addEventListener('DOMContentLoaded', () => {
        const installButton = document.getElementById('pwa-install-btn');
        installButton?.addEventListener('click', window.triggerPwaInstall);

        if ('serviceWorker' in navigator && (location.protocol === 'https:' || location.hostname === 'localhost')) {
            navigator.serviceWorker.register('./sw.js').catch(err => console.warn('PWA service worker:', err));
        }
    });
})();
