import * as StatisticsModel from "../../../models/Statistics";

export class Statistics {

   constructor() {
      // Construtor da classe Statistics
   }

   private getTime(): number {
      // Função privada para obter o valor de tempo atual em milissegundos
      // Retorna o valor de tempo com horas, minutos, segundos e milissegundos zerados
      let date = new Date(Date.now());
      date.setHours(0);
      date.setMinutes(0);
      date.setSeconds(0);
      date.setMilliseconds(0);
      return date.getTime();
   }

   public async add(key: string, amount: number = 1) {
      // Função pública para adicionar uma estatística
      // Recebe a chave (key) da estatística e a quantidade (amount) a ser adicionada (padrão: 1)

      let statistic: any = {
         date: this.getTime(),
         key: key
      };

      if (key != "") {
         let stat = await StatisticsModel.default().findOne(statistic)
         if (stat) {
            // Se a estatística já existe, atualiza o valor incrementando a quantidade fornecida
            StatisticsModel.default().findOneAndUpdate({ _id: stat._id }, { value: (stat.value + amount) }).exec();
         } else {
            // Se a estatística não existe, cria uma nova com o valor igual à quantidade fornecida
            statistic.value = amount;
            await StatisticsModel.default().create(statistic);
         }
      }
   }

   public async find(key: string, period?: number) {
      // Função pública para buscar estatísticas
      // Recebe a chave (key) da estatística e o período (periodo) em dias (opcional)

      let time: Date = new Date(this.getTime());

      if (period) {
         // Se o período foi fornecido, subtrai o número de dias especificado do valor de tempo
         time.setDate(-period);
      }

      // Realiza a busca das estatísticas com base na chave e no período fornecidos
      return await StatisticsModel.default.find({
         ...(key == "*") ? {} : { key: new RegExp("^" + key) },
         date: {
            $gte: time.getTime()
         }
      }).sort({ date: "asc" });
   }

   public async findGraph(key: string, period?: number) {
      // Função pública para buscar estatísticas em formato de gráfico
      // Recebe a chave (key) da estatística e o período (periodo) em dias (opcional)

      let statisticsQuery = await this.find(key, period);

      if (statisticsQuery.length > 0) {
         let statsLabels: Array<string> = [];
         let statsData: Array<any> = [];
         let requestsTotal: number = 0;

         statisticsQuery.forEach((element: any) => {
            let date = new Date(element.date);
            let dateString: string = date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear();

            if (!statsLabels.includes(dateString)) {
               // Adiciona o rótulo da data no array de rótulos
               statsLabels.push(dateString);

               // Incrementa o total de requisições
               requestsTotal += element.value;

               // Adiciona o valor da estatística no array de dados
               statsData.push(element.value);
            }
         });

         // Retorna os dados do gráfico das estatísticas
         return {
            data: statsData,
            labels: statsLabels,
            total: requestsTotal
         };
      } else {
         // Retorna um objeto vazio caso não haja estatísticas encontradas
         return { labels: [], data: [] };
      }
   }
}