export interface CompressImageOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
  format?: "image/webp" | "image/jpeg";
}

/**
 * Carrega e comprime uma imagem utilizando a API HTML5 Canvas.
 * Mantém a proporção da imagem e exporta em formato webp (ou jpeg como fallback).
 */
export function compressImage(
  file: File,
  options: CompressImageOptions = {}
): Promise<string> {
  const {
    maxWidth = 400,
    maxHeight = 400,
    quality = 0.7,
    format = "image/webp",
  } = options;

  return new Promise((resolve, reject) => {
    // Validar tipo de arquivo
    if (!file.type.startsWith("image/")) {
      reject(new Error("Tipo de arquivo inválido. Por favor, envie uma imagem."));
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        let width = img.width;
        let height = img.height;

        // Redimensionamento proporcional
        if (width > height) {
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");
        if (!ctx) {
          reject(new Error("Não foi possível criar o contexto do canvas."));
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);

        // Verifica suporte a WebP no navegador, senão cai para JPEG
        let finalFormat: string = format;
        try {
          const testCanvas = document.createElement("canvas");
          const testUrl = testCanvas.toDataURL("image/webp");
          if (!testUrl.startsWith("data:image/webp")) {
            finalFormat = "image/jpeg";
          }
        } catch {
          finalFormat = "image/jpeg";
        }

        const compressedBase64 = canvas.toDataURL(finalFormat, quality);
        resolve(compressedBase64);
      };
      img.onerror = () => {
        reject(new Error("Erro ao carregar a imagem."));
      };
      img.src = e.target?.result as string;
    };
    reader.onerror = () => {
      reject(new Error("Erro ao ler o arquivo."));
    };
    reader.readAsDataURL(file);
  });
}
