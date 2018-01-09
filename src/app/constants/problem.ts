export interface ProblemInfo {
  number: string;
  id: string;
  title: string;
  subtasks: { subtask: string, score: number }[];
}
