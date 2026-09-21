// PWA installation logic
function dismissPwaBanner() {
            document.getElementById('pwa-banner').classList.add('hidden');
        }

function triggerPwaInstall() {
            if (deferredPwaPrompt) {
                deferredPwaPrompt.prompt();
                deferredPwaPrompt.userChoice.then((choiceResult) => {
                    if (choiceResult.outcome === 'accepted') {
                        console.log('User accepted PWA installation');
                    }
                    deferredPwaPrompt = null;
                    dismissPwaBanner();
                });
            }
        }
