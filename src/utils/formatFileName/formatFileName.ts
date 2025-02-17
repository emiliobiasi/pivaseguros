export const formatFileName = (fileName: string | undefined): string => {
    if (!fileName) return "";

    const lastUnderscoreIndex = fileName.lastIndexOf("_"); // Identifica o último "_"
    if (lastUnderscoreIndex !== -1) {
        const nameWithoutSuffix = fileName.substring(0, lastUnderscoreIndex); // Pega tudo antes do último "_"
        const extension = fileName.substring(fileName.lastIndexOf(".")); // Mantém a extensão
        return nameWithoutSuffix + extension; // Junta o nome correto com a extensão
    }

    return fileName; // Se não tiver "_", retorna o nome original
};
