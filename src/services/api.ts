import axios from "axios";
import { dashboardName } from "../assets/dataMock";

interface getByDateProps extends getByDashboardProps {
  startDate: string;
  endDate: string;
}

export interface getByDashboardProps {
  project: string;
}

interface getByDashboardAndDateProps extends getByDateProps {
  dashboardName: string;
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

export async function getByDashboard({ project }: getByDashboardProps) {
  return getApi(`${baseUrl + project.toUpperCase()}/dashboardName`);
}

export async function getByDashboardAndDate({
  project,
  dashboardName,
  startDate,
  endDate,
}: getByDashboardAndDateProps) {
  return getApi(
    `${
      baseUrl + project.toUpperCase()
    }/${dashboardName}/${startDate}/${endDate}`
  );
}
