interface IValidate {
  valid: boolean;
  message: any;
}
export function isValid(object: any, check: any, sub?: any): IValidate | any {
  let valid: boolean = true;
  let messages: Array<any> = [];

  if (Array.isArray(check)) {
    let validate = Object.keys(object);

    check.forEach((key: any, index: number) => {
      if (Array.isArray(check[index])) {
        // Se o elemento do array for um array, trata-se de uma validação recursiva
        let v = isValid(
          object[key[0]],
          key[1],
          sub ? sub.concat(key[0]) : key[0],
        );

        if (!v.valid) {
          // Se a validação falhar, define a flag de validade como falsa
          valid = false;

          v.forEach((message: any) => {
            messages.push(sub ? sub.concat(message) : message);
          });
        }
      } else if (typeof key == 'object') {
        // Se o elemento do array for um objeto, trata-se de uma validação condicional
        if (valid) {
          Object.keys(key).forEach((type: any) => {
            let i = key[type];

            switch (type.toLowerCase()) {
              case 'or':
                let validations: Array<any> = [];
                i.forEach((value: any) => {
                  validations.push(
                    !value
                      .map((item: any) => validate.includes(item))
                      .includes(false),
                  );
                });
                valid = validations.includes(true);
                break;
            }
          });
        }
      } else {
        // Se o elemento do array for uma chave de validação simples
        if (!validate.includes(key) || object[key] == null) {
          // Se a chave não estiver presente no objeto ou o valor for nulo, define a flag de validade como falsa
          valid = false;
          messages.push(sub ? sub.concat(key) : key);
        }
      }
    });
  } else if (typeof check == 'string') {
    // Se a validação for uma string, trata-se de uma validação de existência de propriedades
    check = check.split('.');
    let exist = true;
    let dt: any = {};

    if (Array.isArray(check)) {
      check.forEach((value, index) => {
        dt = JSON.parse(JSON.stringify(index == 0 ? object : dt));

        if (exist) {
          if (index == check.length - 1) {
            if (sub) {
              switch (sub[0]) {
                case 'is':
                  // Se a validação for 'is', compara o valor da propriedade com o valor fornecido
                  valid = dt[value] == sub[1];
                  break;
                default:
                  valid = true;
                  break;
              }
            }
          } else if (!Object.keys(dt).includes(value)) {
            // Se a propriedade não existir no objeto, define a flag de existência como falsa
            exist = false;
          }

          if (exist && valid) {
            dt = dt[value];
          }
        }
      });
      valid = exist && valid;
    }
  }

  return { valid: valid, message: messages };
}

export function test(object: any, check: any, sub?: any): Boolean {
  return isValid(object, check, sub).valid;
}
