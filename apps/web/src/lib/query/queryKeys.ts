export const queryKeys = {
  dashboard: () => ["dashboard"] as const,
  exercises: () => ["exercises"] as const,

  journalLists: () => ["journals", "index"] as const,

  workouts: () => ["workouts"] as const,
  workoutDetail: (workoutId: number) => ["workouts", workoutId] as const,
  workoutEntries: (workoutId: number) =>
    ["workouts", workoutId, "entries"] as const,

  journalDetail: (journalId: number) => ["journals", journalId] as const,
  journalWorkouts: (journalId: number) =>
    ["journalWorkouts", journalId] as const,
  journalTemplates: (journalId: number) =>
    ["journalTemplates", journalId] as const,
  journalImageLists: (journalId: number) =>
    ["journals", journalId, "images"] as const,
  journalImages: (journalId: number, page: number) =>
    ["journals", journalId, "images", page] as const,
  galleryImageLists: () => ["galleryImages"] as const,
  galleryImages: (page: number) => ["galleryImages", page] as const,
  journalImageDetail: (imageId: number) =>
    ["journalImages", imageId] as const,
};
