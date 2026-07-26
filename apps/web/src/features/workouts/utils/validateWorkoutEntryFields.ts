export type WorkoutEntryFieldValues = {
  exerciseId: string;
  sets: string;
  reps: string;
  weight: string;
};

export type WorkoutEntryFieldErrors = Partial<
  Record<keyof WorkoutEntryFieldValues, string>
>;

export function validateWorkoutEntryFields(
  values: WorkoutEntryFieldValues
): WorkoutEntryFieldErrors {
  const errors: WorkoutEntryFieldErrors = {};
  const exerciseId = Number(values.exerciseId);

  if (!values.exerciseId.trim()) errors.exerciseId = "Choose an exercise.";
  else if (!Number.isFinite(exerciseId) || exerciseId <= 0) {
    errors.exerciseId = "Invalid exercise.";
  }

  const validateWholeNumber = (value: string) => {
    const number = Number(value);
    if (!value.trim()) return "Required.";
    if (!Number.isFinite(number)) return "Must be a number.";
    if (!Number.isInteger(number)) return "Must be a whole number.";
    if (number < 1) return "Must be at least 1.";
    return null;
  };

  const setsError = validateWholeNumber(values.sets);
  if (setsError) errors.sets = setsError;

  const repsError = validateWholeNumber(values.reps);
  if (repsError) errors.reps = repsError;

  const weight = Number(values.weight);
  if (!values.weight.trim()) errors.weight = "Required.";
  else if (!Number.isFinite(weight)) errors.weight = "Must be a number.";
  else if (weight < 0) errors.weight = "Must be 0 or more.";

  return errors;
}
