document.getElementById('dataForm').addEventListener('submit', fetchData);
document.getElementById('postForm').addEventListener('submit', postData);

async function fetchData(event) {
    event.preventDefault();
    
    const dataPath = document.getElementById('dataPath').value;
    // Ensure the path starts with /data/
    const url = new URL(`/data/${dataPath.replace(/^\/+/, '')}`, window.location.origin);
    
    const enableFilter = document.getElementById('enableFilter').checked;
    const filterValue = document.getElementById('filterValue').value;
    
    if (enableFilter && filterValue) {
        url.searchParams.set('filter', filterValue);
    }
    
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        
        // Display the data
        const dataDisplay = document.getElementById('dataDisplay');
        dataDisplay.innerHTML = `<pre>${JSON.stringify(data, null, 2)}</pre>`;
    } catch (error) {
        console.error('Error:', error);
        document.getElementById('dataDisplay').innerHTML = `<p style="color: red;">Error: ${error.message}</p>`;
    }
}

async function postData(event) {
    event.preventDefault();
    
    const postPath = document.getElementById('postPath').value;
    const postData = document.getElementById('postData').value;
    
    // Ensure the path starts with /data/
    const url = new URL(`/data/${postPath.replace(/^\/+/, '')}`, window.location.origin);
    
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: postData
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        const dataDisplay = document.getElementById('dataDisplay');
        dataDisplay.innerHTML = `<pre>${JSON.stringify(data, null, 2)}</pre>`;
    } catch (error) {
        console.error('Error:', error);
        document.getElementById('dataDisplay').innerHTML = `<p style="color: red;">Error: ${error.message}</p>`;
    }
}
