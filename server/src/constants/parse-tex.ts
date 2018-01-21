export interface WebIllustration {
  width: number;
  filename: string;
  text: string; // description / citation link in HTML
}

export interface WebStatement {
  title: string;
  illustration?: WebIllustration;
  statement: string; // parsed statement in HTML
  subtasks: string[]; // subtask description in HTML, one for each subtask
}
