function getPdfLib() {
  const lib = window.pdfjsLib;
  if (!lib) {
    throw new Error("PDF.js n'est pas charge dans index.html.");
  }
  return lib;
}

export async function loadPDF(file, pageNumber = 1) {
  const pdfjsLib = getPdfLib();
  const arrayBuffer = await file.arrayBuffer();
  const pdfDoc = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  const pageData = await renderPage(pdfDoc, pageNumber);

  return {
    pdfDoc,
    sourceName: file.name,
    ...pageData,
  };
}

export async function renderPage(pdfDoc, pageNumber) {
  const page = await pdfDoc.getPage(pageNumber);
  const viewport = page.getViewport({ scale: (window.devicePixelRatio || 1) * 2 });
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");

  canvas.width = viewport.width;
  canvas.height = viewport.height;

  await page.render({ canvasContext: context, viewport }).promise;
  const bitmap = await createImageBitmap(canvas);

  return {
    bitmap,
    pageCount: pdfDoc.numPages,
    currentPage: pageNumber,
    nativeW: viewport.width,
    nativeH: viewport.height,
  };
}
