// WhatsApp order logic
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
