import cron from "node-cron";
import axios from "axios";

const fetchAPI = async () => {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000';
    const response = await axios.get(`/api/updateAllStudentDataAtOnce/`);
    console.log("Fetched data:", response.data);
  } catch (error) {
    console.error("Error fetching API:", (error as Error).message);
  }
};

cron.schedule("25 13 * * *", () => {
  console.log("Running cron job at 1:25 PM...");
  fetchAPI();
});

console.log("Cron job scheduled.");
