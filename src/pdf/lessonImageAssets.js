function normalizeImagePath(path) {
  return path.startsWith('/') ? path : `/${path}`;
}

function loadImage(path) {
  return new Promise((resolve, reject) => {
    const image = new Image();

    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error(`Could not load image asset: ${path}`));
    image.src = path;
  });
}

function imageToPngDataUrl(image) {
  const canvas = document.createElement('canvas');
  const width = image.naturalWidth || image.width;
  const height = image.naturalHeight || image.height;
  const context = canvas.getContext('2d');

  canvas.width = width;
  canvas.height = height;
  context.drawImage(image, 0, 0, width, height);

  return canvas.toDataURL('image/png');
}

async function loadLessonImageAsset(path) {
  const normalizedPath = normalizeImagePath(path);
  const image = await loadImage(normalizedPath);

  return {
    dataUrl: imageToPngDataUrl(image),
    path: normalizedPath,
  };
}

export async function prepareLessonImageAssets(paths = []) {
  const uniquePaths = [...new Set(paths.map(normalizeImagePath))];
  const assets = await Promise.all(uniquePaths.map(loadLessonImageAsset));
  const assetsByPath = new Map(assets.map((asset) => [asset.path, asset]));

  return function getLessonImage(path) {
    const normalizedPath = normalizeImagePath(path);
    const asset = assetsByPath.get(normalizedPath);

    if (!asset) {
      throw new Error(
        `Image path "${normalizedPath}" is not available for this lesson. Add it to imagePaths first.`,
      );
    }

    return asset.dataUrl;
  };
}
