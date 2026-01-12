export const DownloadData = (data, downloadFileBaseName, override = false) => {
    // 1. Convert the JavaScript object to a JSON string
    // The 'null, 2' arguments make the JSON "pretty-printed" and readable
    const jsonString = JSON.stringify(data, null, 2);
    // 2. Create a Blob with the JSON string and set the MIME type
    const blob = new Blob([jsonString], { type: 'application/json' });
    // 3. Create a temporary URL for the Blob
    const url = URL.createObjectURL(blob);
    // 4. Create a hidden <a> element
    const link = document.createElement('a');
    link.href = url;
    link.download = downloadFileBaseName;
    // 5. Append to the body, click it, and remove it
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    // 6. Clean up the URL to free up memory
    URL.revokeObjectURL(url);
};
//# sourceMappingURL=DownloadData.js.map