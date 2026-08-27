export const IMAGE_COMPRESSION_DEFAULTS = {
  maxWidth: 1200,
  maxHeight: 1200,
  quality: 0.8,
  outputType: 'image/jpeg',
};

export async function compressImage(file, options = {}) {
  const config = { ...IMAGE_COMPRESSION_DEFAULTS, ...options };
  
  return new Promise((resolve, reject) => {
    const img = new Image();
    const reader = new FileReader();
    
    reader.onload = (e) => {
      img.src = e.target.result;
    };
    
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      let { width, height } = img;
      
      if (width > config.maxWidth || height > config.maxHeight) {
        const ratio = Math.min(config.maxWidth / width, config.maxHeight / height);
        width *= ratio;
        height *= ratio;
      }
      
      canvas.width = width;
      canvas.height = height;
      
      ctx.drawImage(img, 0, 0, width, height);
      
      canvas.toBlob(
        (blob) => {
          if (!blob) {
            reject(new Error('Compression failed'));
            return;
          }
          
          const compressedFile = new File([blob], file.name.replace(/\.[^.]+$/, '.jpg'), {
            type: config.outputType,
            lastModified: Date.now(),
          });
          
          resolve({
            file: compressedFile,
            originalSize: file.size,
            compressedSize: compressedFile.size,
            width,
            height,
            compressionRatio: (compressedFile.size / file.size * 100).toFixed(1),
          });
        },
        config.outputType,
        config.quality
      );
    };
    
    img.onerror = () => reject(new Error('Failed to load image'));
    reader.onerror = () => reject(new Error('Failed to read file'));
    
    reader.readAsDataURL(file);
  });
}

export async function compressMultipleImages(files, options = {}) {
  const results = [];
  
  for (const file of files) {
    try {
      const result = await compressImage(file, options);
      results.push({ file, ...result, success: true });
    } catch (error) {
      results.push({ file, error: error.message, success: false });
    }
  }
  
  return results;
}

export function createImagePreview(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target.result);
    reader.onerror = () => reject(new Error('Failed to create preview'));
    reader.readAsDataURL(file);
  });
}

export function validateImageFile(file, maxSizeMB = 5) {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
  const maxSize = maxSizeMB * 1024 * 1024;
  
  if (!allowedTypes.includes(file.type)) {
    return { valid: false, error: 'Tipe file tidak didukung. Gunakan JPEG, PNG, atau WebP' };
  }
  
  if (file.size > maxSize) {
    return { valid: false, error: `Ukuran file melebihi ${maxSizeMB}MB` };
  }
  
  return { valid: true };
}