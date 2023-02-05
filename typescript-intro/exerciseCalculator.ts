interface ExerciseResults {
  periodLength: number;
  trainingDays: number;
  success: boolean;
  rating: number;
  ratingDescription: string;
  target: number;
  average: number;
}

interface ExerciseArguments {
  dailyExercises: Array<number>;
  targetHours: number;
}

export const parseExerciseArguments = (
  daily_exercises: unknown,
  target: unknown
): ExerciseArguments => {
  if (isNaN(Number(target))) throw new Error("malformatted parameters");

  if (!Array.isArray(daily_exercises))
    throw new Error("malformatted parameters");

  if (daily_exercises.length === 0) throw new Error("parameters missing");

  if (daily_exercises.some((x) => isNaN(Number(x)))) {
    throw new Error("malformatted parameters");
  }

  return {
    dailyExercises: daily_exercises.map((x) => Number(x)),
    targetHours: Number(target),
  };
};

export function calculateExercises(
  dailyExerciseHours: Array<number>,
  targetHours: number
): ExerciseResults {
  const average =
    dailyExerciseHours.reduce((acc, current) => acc + Number(current), 0) /
    dailyExerciseHours.length;
  const target = Number(targetHours);

  const score = average / target;
  let rating = { score: 1, description: "You suck!" };
  if (score > 0.5)
    rating = { score: 2, description: "Not too bad but could be better" };
  if (score > 1) rating = { score: 3, description: "You don't suck" };

  return {
    periodLength: dailyExerciseHours.length,
    trainingDays: dailyExerciseHours.filter((x) => x > 0).length,
    success: average >= target,
    rating: rating.score,
    ratingDescription: rating.description,
    target,
    average,
  };
}
