function PdfPreview({ pdfUrl }) {
  const previewUrl = pdfUrl ? `${pdfUrl}#page=1&zoom=100` : null;

  if (!pdfUrl) {
    return (
      <div className="previewPlaceholder" role="img" aria-label="PDF preview placeholder">
        <div className="paperMock">
          <span>PDF preview will render here</span>
        </div>
      </div>
    );
  }

  return (
    <div className="pdfPreviewSurface">
      <iframe className="pdfFrame" src={previewUrl} title="Generated PDF preview" />
    </div>
  );
}

export default PdfPreview;
