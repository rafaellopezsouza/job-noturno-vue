import axios from "axios";
interface getByDateProps extends getByFeatureProps {
  startDate: string;
  endDate: string;
}

export interface getByFeatureProps {
  project: string;
}

interface getByFeatureAndDateProps extends getByDateProps {
  featureName: string;
}
const baseUrl = "https://devcukes.seg-social.pt/rest/dashboards";

async function getApi(url: string) {
  console.log("url: " + url);
  const response = await axios.get(url);
  console.log(JSON.stringify(response.data));
  return response.data;
}

export function getByDate({ project, startDate, endDate }: getByDateProps) {
  return getApi(`${baseUrl + project.toUpperCase()}/${startDate}/${endDate}`);
}

export async function getFeatures({ project }: getByFeatureProps) {
  return getApi(`${baseUrl + project.toUpperCase()}/dashboardName`);
}

export async function getByFeatureAndDate({
  project,
  featureName,
  startDate,
  endDate,
}: getByFeatureAndDateProps) {
  return getApi(
    `${
      baseUrl + project.toUpperCase()
    }/${featureName}/${startDate}/${endDate}`
  );
}
