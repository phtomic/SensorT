export function parseObject(obj: any, path: string) {
    // Função para percorrer um objeto aninhado com base em um caminho especificado
    // O caminho é uma string com as propriedades separadas por ponto (por exemplo, "prop1.prop2.prop3")
    // Retorna o valor da propriedade especificada pelo caminho ou undefined se não existir
    path.split(".").forEach((item) => {
        obj = (obj != undefined && obj[item] != undefined) ? obj[item] : undefined;
    });
    return obj;
}