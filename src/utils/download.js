/**
 * Downloads a PDF file from a URL as a Blob, revokes the temporary URL after triggering download,
 * and falls back to window.open if blocked or errored.
 * 
 * @param {string} url - The URL of the PDF file to download
 * @param {string} filename - The default file name for saving the download
 */
export const downloadPdf = async (url, filename) => {
  if (!url) return;

  try {
    const response = await fetch(url);
    const blob = await response.blob();
    const blobUrl = window.URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = blobUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();

    document.body.removeChild(link);
    window.URL.revokeObjectURL(blobUrl);
  } catch (error) {
    console.error("Blob download failed, falling back to direct window open:", error);
    window.open(url, "_blank");
  }
};
