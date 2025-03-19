document.getElementById('uploadForm').addEventListener('submit', async function(event) {
    event.preventDefault();
    
    const fileInput = document.getElementById('ctScan');
    const file = fileInput.files[0];
    
    if (!file) {
        alert('Please select a file to upload.');
        return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
        const response = await fetch('http://127.0.0.1:8000/analyze_ct/', {
            method: 'POST',
            body: formData
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();

        // Display the results
        document.getElementById('diagnosis').textContent = data.diagnosis;
        document.getElementById('accuracy').textContent = `Confidence: ${data.accuracy}`;
        document.getElementById('explanation').textContent = data.explanation;

        // Display PubMed information
        const medicalInfoList = document.getElementById('medicalInfo');
        medicalInfoList.innerHTML = '';
        if (data.medical_info && data.medical_info.PubMed) {
            data.medical_info.PubMed.forEach(info => {
                const li = document.createElement('li');
                const a = document.createElement('a');
                a.href = info.link;
                a.textContent = info.title;
                a.target = "_blank"; // Open link in a new tab
                li.appendChild(a);
                const p = document.createElement('p');
                p.textContent = info.abstract;
                li.appendChild(p);
                medicalInfoList.appendChild(li);
            });
        } else {
            medicalInfoList.innerHTML = '<li>No medical information found.</li>';
        }

        // Play the text-to-speech audio
        if (data.tts_audio) {
            const audio = new Audio(data.tts_audio);
            audio.play();
        }

        // Show the results section
        document.getElementById('results').classList.remove('hidden');
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred while analyzing the CT scan.');
    }
});
