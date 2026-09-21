// Order tracking logic
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
