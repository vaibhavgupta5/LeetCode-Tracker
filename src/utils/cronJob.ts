import cron from "node-cron";
import axios from "axios";

const fetchAPI = async () => {
  try {
    const response = await axios.get("http://localhost:3000/pratyush-who/");
    console.log("Fetched data:", response.data);
  } catch (error) {
    console.error("Error fetching API:", (error as Error).message);
  }
};

cron.schedule("0 9 * * *", () => {
  console.log("Running cron job at 9 AM...");
  fetchAPI();
});

console.log("Cron job scheduled.");
