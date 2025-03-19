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
        const response = await fetch('/analyze_ct/', {
            method: 'POST',
            body: formData
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();

        document.getElementById('diagnosis').textContent = data.diagnosis;
        document.getElementById('accuracy').textContent = data.accuracy;
        document.getElementById('explanation').textContent = data.explanation;

        const medicalInfoList = document.getElementById('medicalInfo');
        medicalInfoList.innerHTML = '';
        data.medical_info.PubMed.forEach(info => {
            const li = document.createElement('li');
            const a = document.createElement('a');
            a.href = info.link;
            a.textContent = info.title;
            li.appendChild(a);
            const p = document.createElement('p');
            p.textContent = info.abstract;
            li.appendChild(p);
            medicalInfoList.appendChild(li);
        });

        document.getElementById('results').classList.remove('hidden');
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred while analyzing the CT scan.');
    }
});
