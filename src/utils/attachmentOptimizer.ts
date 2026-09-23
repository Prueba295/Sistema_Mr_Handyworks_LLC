/**
 * Mr Handyworks LLC - Universal Client Attachment Optimizer & Classifier
 * Supports any file extension without restriction: Photos, Videos, PDFs,
 * Word documents, Spreadsheets, Archives, and CAD/Plans.
 * Automatically classifies formats, compresses standard web photos in-browser,
 * and maintains resilient DataURLs for cross-device preview.
 */

import { BookingAttachment } from '../types';

export function formatFileSize(bytes: number): string {
  if (!bytes || bytes <= 0) return '0 B';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

/**
 * Extracts a normalized lowercase file extension from a filename or path
 */
export function getFileExtension(filename: string): string {
  if (!filename) return '';
  const clean = filename.split('?')[0].split('#')[0];
  const parts = clean.split('.');
  if (parts.length <= 1) return '';
  return parts.pop()?.toLowerCase().trim() || '';
}

export const IMAGE_EXTENSIONS = new Set([
  'jpg', 'jpeg', 'png', 'webp', 'gif', 'svg', 'bmp', 'ico', 'jfif', 
  'tif', 'tiff', 'avif', 'heic', 'heif', 'dng', 'raw', 'cr2', 'nef'
]);

export const VIDEO_EXTENSIONS = new Set([
  'mp4', 'mov', 'webm', 'avi', 'mkv', '3gp', 'm4v', 'wmv', 'flv', 'ogv', 'ts', 'm2ts'
]);

export const PDF_EXTENSIONS = new Set(['pdf']);

export const SPREADSHEET_EXTENSIONS = new Set(['xls', 'xlsx', 'csv', 'ods', 'tsv']);

export const WORD_EXTENSIONS = new Set(['doc', 'docx', 'rtf', 'odt', 'pages']);

export const PRESENTATION_EXTENSIONS = new Set(['ppt', 'pptx', 'odp', 'key']);

export const ARCHIVE_EXTENSIONS = new Set(['zip', 'rar', '7z', 'tar', 'gz', 'bz2']);

export const TEXT_EXTENSIONS = new Set(['txt', 'log', 'md', 'json', 'xml', 'html', 'css', 'js', 'ts']);

/**
 * Determines primary attachment bucket ('image' | 'video' | 'document')
 */
export function classifyFileType(filename: string, mimeType = ''): 'image' | 'video' | 'document' {
  const ext = getFileExtension(filename);
  const mime = (mimeType || '').toLowerCase();

  if (IMAGE_EXTENSIONS.has(ext) || mime.startsWith('image/')) {
    return 'image';
  }
  if (VIDEO_EXTENSIONS.has(ext) || mime.startsWith('video/')) {
    return 'video';
  }
  return 'document';
}

/**
 * Detailed sub-category for rich UI icons and badges in the viewer
 */
export function getDetailedCategory(filename: string, mimeType = ''): 
  'image' | 'video' | 'pdf' | 'word' | 'spreadsheet' | 'presentation' | 'archive' | 'text' | 'document' {
  const ext = getFileExtension(filename);
  const mime = (mimeType || '').toLowerCase();

  if (IMAGE_EXTENSIONS.has(ext) || mime.startsWith('image/')) return 'image';
  if (VIDEO_EXTENSIONS.has(ext) || mime.startsWith('video/')) return 'video';
  if (PDF_EXTENSIONS.has(ext) || mime.includes('pdf')) return 'pdf';
  if (SPREADSHEET_EXTENSIONS.has(ext)) return 'spreadsheet';
  if (WORD_EXTENSIONS.has(ext)) return 'word';
  if (PRESENTATION_EXTENSIONS.has(ext)) return 'presentation';
  if (ARCHIVE_EXTENSIONS.has(ext)) return 'archive';
  if (TEXT_EXTENSIONS.has(ext) || mime.startsWith('text/')) return 'text';
  return 'document';
}

/**
 * Compresses a raster image file (JPG, PNG, WEBP) on an off-screen canvas to maximum 1280px dimension
 * and 0.75 JPEG quality, shrinking typical 5-10MB mobile photos down to ~90-140KB.
 * Gracefully rejects if canvas cannot decode (e.g. SVG or HEIC) so caller falls back to raw data URL.
 */
export async function compressImageFile(file: File, maxDim = 1280, quality = 0.75): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Failed to read image file.'));
    reader.onload = (e) => {
      const img = new Image();
      img.onerror = () => reject(new Error('Canvas cannot decode this image format natively.'));
      img.onload = () => {
        try {
          let width = img.naturalWidth || img.width;
          let height = img.naturalHeight || img.height;

          if (width > maxDim || height > maxDim) {
            if (width > height) {
              height = Math.round((height * maxDim) / width);
              width = maxDim;
            } else {
              width = Math.round((width * maxDim) / height);
              height = maxDim;
            }
          }

          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            resolve(e.target?.result as string);
            return;
          }

          ctx.drawImage(img, 0, 0, width, height);
          const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
          resolve(compressedDataUrl);
        } catch (canvasErr) {
          reject(canvasErr);
        }
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  });
}

/**
 * Reads any document, video or raw file into a standard Data URL for client-side preview
 */
export async function readFileAsDataURL(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error(`Failed to read file ${file.name}.`));
    reader.onload = () => resolve(reader.result as string);
    reader.readAsDataURL(file);
  });
}

/**
 * Validates and converts ANY uploaded file into a lightweight BookingAttachment object
 * Accepts any extension: photos, videos, PDFs, docx, xlsx, txt, zip, etc.
 */
export async function processUploadedFile(file: File): Promise<BookingAttachment> {
  const maxBytes = 40 * 1024 * 1024; // Generous 40 MB ceiling
  if (file.size > maxBytes) {
    throw new Error(`File "${file.name}" exceeds 40 MB. Please select a smaller file.`);
  }

  const ext = getFileExtension(file.name);
  const attachmentType = classifyFileType(file.name, file.type);

  let dataUrl: string;

  // Attempt canvas compression for standard web raster images
  const canCompressWithCanvas = ['jpg', 'jpeg', 'png', 'webp', 'bmp'].includes(ext);

  if (canCompressWithCanvas) {
    try {
      dataUrl = await compressImageFile(file);
    } catch {
      dataUrl = await readFileAsDataURL(file);
    }
  } else {
    // Other formats (PDF, DOCX, XLSX, MP4, MOV, SVG, HEIC, ZIP, TXT) read cleanly as DataURL
    dataUrl = await readFileAsDataURL(file);
  }

  const approxSize = Math.round((dataUrl.length * 3) / 4);

  return {
    id: `att_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    name: file.name,
    type: attachmentType,
    fileExt: ext,
    mimeType: file.type || undefined,
    sizeFormatted: formatFileSize(approxSize || file.size),
    dataUrl,
    createdAt: new Date().toISOString()
  };
}
