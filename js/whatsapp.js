// WhatsApp order logic
function sendOrderToWhatsApp() {
    const price = document.getElementById('total-price-display')?.innerText || 'Rp 0';

    let message = `Halo BandaAcehPrint.com,

Saya ingin memesan layanan cetak:

*Kategori:* ${currentTab.toUpperCase()}
*Total Estimasi:* ${price}`;

    if (uploadedFileName) {
        message += `\n*File Berkas:* ${uploadedFileName}`;
    }

    message += `

Mohon konfirmasi pembayaran dan waktu pengerjaan.`;

    const phone = '6281269000000';
    const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;

    window.open(url, '_blank', 'noopener,noreferrer');
}
