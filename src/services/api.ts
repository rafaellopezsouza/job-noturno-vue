import axios from "axios";
import { featureData } from "../assets/dataMock";
interface getByDateProps {
  project: string;
  dashboardName: string;
  startDate: string;
  endDate: string;
}
interface getFeaturesProps {
  project: string;
  execID: string;
}

interface getDashboardNameProps {
  project: string;
}

const baseUrl = "https://devcukes.seg-social.pt/rest";

async function getApi(url: string) {
  console.log("url: " + url);
  const response = await axios.get(url);
  console.log(JSON.stringify(response.data));
  return response.data;
}

export async function getFeatures({ ...props }: getFeaturesProps) {
  return getApi(
    `${baseUrl}/features${props.project.toUpperCase()}/${props.execID}`
  );
}

export async function getDashboardName({ ...props }: getDashboardNameProps) {
  return getApi(
    `${baseUrl}/dashboards${props.project.toUpperCase()}/dashboardName`
  );
}

export async function getByFeatureAndDate({ ...props }: getByDateProps) {
  return getApi(
    `${baseUrl}/dashboards${props.project.toUpperCase()}/${
      props.dashboardName
    }/${props.startDate}/${props.endDate}`
  );
}
