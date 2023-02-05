import express from "express";
import { calculateBmi } from "./bmiCalculator";
import {
  calculateExercises,
  parseExerciseArguments,
} from "./exerciseCalculator";

const app = express();
app.use(express.json());

app.get("/", (_req, res) => {
  res.send("Hello Full Stack!");
});

app.get("/bmi", (req, res) => {
  const { height, weight } = req.query;

  try {
    const bmi = calculateBmi(Number(height), Number(weight));
    return res.json({ weight, height, bmi });
  } catch (error) {
    return res.status(400).json({ error: "malformatted parameters" });
  }
});

app.post("/exercises", (req, res) => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const { daily_exercises, target } = req.body;
  if (!daily_exercises || !target) {
    return res.status(400).json({ error: "parameters missing" });
  }

  try {
    const { dailyExercises, targetHours } = parseExerciseArguments(
      daily_exercises,
      target
    );
    const result = calculateExercises(dailyExercises, targetHours);
    return res.json(result);
  } catch (error: unknown) {
    if (error instanceof Error) {
      return res.status(400).json({ error: error.message });
    }
    return res.status(400).json({ error: "something went wrong" });
  }
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Serving running on port ${PORT}: http://localhost:${PORT}`);
});
