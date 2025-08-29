// Utilitários de Download para Android e iOS
export const isIOS = () => /iPhone|iPad|iPod/i.test(navigator.userAgent);
export const isAndroid = () => /Android/i.test(navigator.userAgent);

export const universalDownload = async (data, filename, type = 'application/pdf') => {
  const blob = new Blob([data], { type });
  const url = URL.createObjectURL(blob);
  
  if (isIOS()) {
    window.open(url, '_blank');
  } else {
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
  
  setTimeout(() => URL.revokeObjectURL(url), 10000);
};

export const generateSampleData = () => JSON.stringify({
  relatorio: "Teste de download",
  data: new Date().toLocaleString('pt-BR'),
  status: "Funcionando!"
}, null, 2);
