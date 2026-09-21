// General application logic
// Shared application state
let currentTab = 'dokumen';
let uploadedFileName = '';
let deferredPwaPrompt = null;


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

// Initialize calculator on page load
document.addEventListener('DOMContentLoaded', () => {
    if (typeof calculatePrice === 'function') calculatePrice();
});
