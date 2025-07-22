import FingerprintJS from '@fingerprintjs/fingerprintjs';

// Function to get the device fingerprint
async function getFingerPrint() {
    const fp = await FingerprintJS.load();  // Load the FingerprintJS agent
    const result = await fp.get();          // Get the fingerprint data
    return result.visitorId.slice(0,19);                // Unique device ID
}

export default getFingerPrint;