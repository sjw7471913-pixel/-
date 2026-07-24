/**
 * Convert a File object to base64 string (including data url header or raw)
 */
export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
}

/**
 * Capture frame from video element to Data URL (JPEG)
 */
export function captureVideoFrame(video: HTMLVideoElement): string {
  const canvas = document.createElement('canvas');
  canvas.width = video.videoWidth || 640;
  canvas.height = video.videoHeight || 480;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    return canvas.toDataURL('image/jpeg', 0.85);
  }
  return '';
}

/**
 * Clean base64 string by removing data URI scheme header if present
 */
export function stripBase64Header(dataUrl: string): { mimeType: string; base64Data: string } {
  if (dataUrl.includes(';base64,')) {
    const parts = dataUrl.split(';base64,');
    const mimeType = parts[0].replace('data:', '');
    return { mimeType, base64Data: parts[1] };
  }
  return { mimeType: 'image/jpeg', base64Data: dataUrl };
}

/**
 * Generate visual thumbnail color badge or SVG placeholder
 */
export function getCategoryBadgeColor(category: string): string {
  switch (category) {
    case 'top':
      return 'bg-amber-100 text-amber-800 border-amber-200';
    case 'bottom':
      return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'outer':
      return 'bg-stone-200 text-stone-800 border-stone-300';
    case 'shoes':
      return 'bg-emerald-100 text-emerald-800 border-emerald-200';
    case 'accessory':
      return 'bg-purple-100 text-purple-800 border-purple-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
}

export function translateCategory(category: string): string {
  switch (category) {
    case 'top': return '상의';
    case 'bottom': return '하의';
    case 'outer': return '아우터';
    case 'shoes': return '신발';
    case 'accessory': return '잡화/액세서리';
    default: return category;
  }
}
