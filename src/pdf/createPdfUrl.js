export function createPdfUrl(doc) {
  if (!doc || typeof doc.output !== 'function') {
    throw new Error('Cannot create a PDF URL because no jsPDF document was provided.');
  }

  const blob = doc.output('blob');

  if (!(blob instanceof Blob)) {
    throw new Error('Could not create a PDF blob from the jsPDF document.');
  }

  return URL.createObjectURL(blob);
}
