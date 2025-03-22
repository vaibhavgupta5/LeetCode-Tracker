import cron from "node-cron";
import axios from "axios";

const fetchAPI = async () => {
  try {
    const response = await axios.get("http://localhost:3001/updateAllStudentDataAtOnce/");
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
