import axios from "axios";

interface getDashboardNameProps {
  project: string;
}

interface getByFeatureAndDateProps extends getDashboardNameProps {
  dashboardName: string;
  startDate: string;
  endDate: string;
}

interface getFeaturesProps {
  project: string;
  execID: string;
}

interface getFeaturesByMonthProps {
  project: string;
  featureName: string;
  date: string;
  data: DataItem[];
}

interface Result {
  duration: string;
  scenariosPassed: number;
  scenariosSkipped: number;
  scenariosFailed: number;
  scenariosPending: number;
  scenariosUndefined: number;
  scenariosAmbiguous: number;
  scenariosTotal: number;
}

interface DataItem {
  execID: string;
  date: string;
  environ: string;
  version: string;
  module: string;
  result: Result;
  dashboardName: string;
}

const baseUrl = "https://devcukes.seg-social.pt/rest";

async function getApi(url: string) {
  const response = await axios.get(url);
  return response.data;
}

export async function getDashboardName({ ...props }: getDashboardNameProps) {
  return getApi(
    `${baseUrl}/dashboards${props.project.toUpperCase()}/dashboardName`
  );
}

export async function getByFeatureAndDate({ ...props }: getByFeatureAndDateProps) {
  return getApi(
    `${baseUrl}/dashboards${props.project.toUpperCase()}/${
      props.dashboardName
    }/${props.startDate}/${props.endDate}`
  );
}

// Método para buscar os Features com os resultados pelo execID
export async function getFeatures({ project, execID }: getFeaturesProps) {
  return getApi(`${baseUrl}/features${project.toUpperCase()}/${execID}`);
}

// Método para buscar os Features de acordo com o Mês selecionado
export async function getFeaturesByMonth({ ...props }: getFeaturesByMonthProps) {
  const execIDs = props.data.map(item => item.execID);
  const dates = props.data.map(item => item.date);
  const featuresResults: { date: string, data: any[] }[] = [];

  for (let i = 0; i < execIDs.length; i++) {
      const execID = execIDs[i];
      const date = dates[i];
      const featureData = await getFeatures({ project: props.project, execID });

      const filteredFeatureData = featureData.filter((data: any) => data.name === props.featureName);

      if (filteredFeatureData.length > 0) {
          const existingEntry = featuresResults.find(entry => entry.date === date);
          if (existingEntry) {
              existingEntry.data.push(filteredFeatureData);
          } else {
              featuresResults.push({ date, data: [filteredFeatureData] });
          }
      }
  }
console.log(JSON.stringify(featuresResults))
  return featuresResults;
}

/*
Fazer a lógica e chamada a API para buscar os valores por Ano. 
1. Buscar os features pelo range do ano.
2. Armazenar os execID pela data. 
3. Filtrar as datas por mês e somar os totais de cada cenario  armazenar a média do mês. Ex: total / dias (excluido se o dia = 0 scenarios)
4. Retornar os valores por mês (usando o code ja pronto no arquivo assets/data.ts) e as médias daquele mês
*/