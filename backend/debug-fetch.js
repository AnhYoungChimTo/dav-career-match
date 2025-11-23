const fetch = require('node-fetch');

async function checkBackend() {
    try {
        const response = await fetch('http://localhost:4000/matching/test/1');
        console.log('Status:', response.status);
        const data = await response.json();
        console.log('Is Array?', Array.isArray(data));
        if (Array.isArray(data) && data.length > 0) {
            console.log('First Item Keys:', Object.keys(data[0]));
            console.log('First Item Sample:', JSON.stringify(data[0], null, 2));

            // Check for potential nulls in critical fields
            data.forEach((job, i) => {
                if (!job.responsibilities) console.warn(`Job ${i} missing responsibilities`);
                if (!job.hardSkills) console.warn(`Job ${i} missing hardSkills`);
            });
        } else {
            console.log('Data:', data);
        }
    } catch (error) {
        console.error('Fetch Error:', error);
    }
}

checkBackend();
