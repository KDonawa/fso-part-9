export function calculateBmi(heightInCm: number, weightInKg: number) {
  if (
    isNaN(heightInCm) ||
    isNaN(weightInKg) ||
    heightInCm === 0 ||
    weightInKg === 0
  ) {
    throw new Error();
  }

  const heightInMeters = heightInCm / 100;
  const bmi = weightInKg / (heightInMeters * heightInMeters);

  if (bmi < 16.0) return "Underweight (Severe thinness)";
  if (bmi < 17.0) return "Underweight (Moderate thinness)";
  if (bmi < 18.5) return "Underweight (Mild thinness)";
  if (bmi < 25.0) return "Normal (Healthy weight)";
  if (bmi < 30.0) return "Overweight (Pre-obese)";
  if (bmi < 35.0) return "Obese (Class I)";
  if (bmi < 40.0) return "Obese (Class II)";
  return "Obese (Class III)";
}
