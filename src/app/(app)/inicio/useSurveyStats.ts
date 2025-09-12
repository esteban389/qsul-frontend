import backendClient from "@/services/backendClient";
import { useQuery } from "@tanstack/react-query";

 async function getData(timeFilter: string) {
    return (await backendClient.get(`/api/survey/stats?time_filter=${timeFilter}`)).data
 }

 function useSurveyStats(timeFilter: string) {
  return useQuery({
    queryKey: ["survey-stats", timeFilter],
    queryFn: async () => getData(timeFilter)
  });
}

export default useSurveyStats;