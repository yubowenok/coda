import { WebStatement, WebIllustration } from '../constants/parse-tex';

/**
 * Removes %...\n.
 */
const removeComments = (input: string): string => {
  return input.replace(/%.*\n/, '');
};

/**
 * Reads /problemname{.*}
 */
const parseProblemName = (input: string): { title: string, input: string } => {
  const title = input.match(/\\problemname{(.*)}/i)[1];
  input = input.replace(/\\problemname{.*}\s*\n/i, '');
  return { title, input };
};

/**
 * Replaces \begin{center}...\end{center} block by <center></center>.
 */
const parseCenter = (input: string): string => {
  const CENTER_BEGIN_PATTERN = '\\begin{center}';
  const CENTER_END_PATTERN = '\\end{center}';
  let centerStart = input.indexOf(CENTER_BEGIN_PATTERN);
  while (centerStart !== -1) {
    const centerEnd = input.indexOf(CENTER_END_PATTERN, centerStart);
    input = input.substring(0, centerStart) +
      `<center>${input.substring(centerStart + CENTER_BEGIN_PATTERN.length, centerEnd)}</center>` +
       input.substring(centerEnd + CENTER_END_PATTERN.length);
    centerStart = input.indexOf(CENTER_BEGIN_PATTERN, centerEnd);
  }
  return input;
};

/**
 * Replaces {\it } {\tt } blocks by <it></it> <tt></tt> tags.
 */
const parseFontStyle = (input: string): string => {
  // parse it
  const PARSE_IT = '{\\it';
  let it_start = input.indexOf(PARSE_IT);
  while (it_start !== -1) {
    const it_end = input.indexOf('}', it_start);
    input = input.substring(0, it_start) +
      `<it>${input.substring(it_start + PARSE_IT.length + 1, it_end)}</it>` +
      input.substring(it_end + 1);
    it_start = input.indexOf(PARSE_IT, it_end);
  }

  // parse tt
  const PARSE_TT = '{\\tt';
  let tt_start = input.indexOf(PARSE_TT);
  while (tt_start !== -1) {
    const tt_end = input.indexOf('}', tt_start);
    input = input.substring(0, tt_start) +
      `<tt>${input.substring(tt_start + PARSE_TT.length + 1, tt_end)}</tt>` +
      input.substring(tt_end + 1);
    tt_start = input.indexOf(PARSE_TT, tt_end);
  }

  return input;
};

/**
 * Replaces double quotes ``...'' by "..."
 * Replaces single quotes `...' by '...'
 */
const parseQuotes = (input: string): string => {
  // parse double and single quotes
  input = input.replace(/``/g, '\"');
  input = input.replace(/''/, '\"');
  input = input.replace(/`/g, '\'');
  return input;
};

/**
 * Replaces two slashes \\ by <br> (explicit newline).
 * Considers two (or more) consecutive blank lines as paragraph ends. Places each paragraph in <p></p>
 */
const parseParagraphs = (input: string): string => {
  input = input.replace(/\\\\/g, '<br>');
  input = input.replace(/(\n|(\r\n)){2,}/g, '</p><p>');
  input = input.replace(/(<p><\/p>)+/g, ''); // remove unnecessary p's
  return input;
};

/**
 * Reads \illustration macro.
 */
const parseIllustration = (input: string): { illustration?: WebIllustration, input: string } => {
  const PROBLEM_ILLUSTRATION_PATTERN = 'illustration{';
  const FIGURE_SOURCE_PATTEN = '\\href{';
  const patternStart = input.indexOf(PROBLEM_ILLUSTRATION_PATTERN);
  let width, filename, text;
  if (patternStart === -1) {
    return { input };
  }

  let href = '', credit = '';
  const sizeStart = patternStart + PROBLEM_ILLUSTRATION_PATTERN.length;
  const sizeEnd = input.indexOf('}', sizeStart);
  const sourceStart = sizeEnd + 2;
  const sourceEnd = input.indexOf('}', sourceStart);

  let illustrationCloseBrace = sourceEnd; // illustration end should be the last '}'

  width = Number(input.substring(sizeStart, sizeEnd));
  filename = input.substring(sourceStart, sourceEnd);

  if (input.charAt(sourceEnd + 1) === '{') {
    const hrefStart = input.indexOf(FIGURE_SOURCE_PATTEN);
    const hrefEnd = input.indexOf('}', hrefStart);
    href = input.substring(hrefStart + FIGURE_SOURCE_PATTEN.length, hrefEnd);

    const creditStart = hrefEnd + 2;
    const creditEnd = input.indexOf('}', creditStart);
    credit = input.substring(creditStart, creditEnd);
    illustrationCloseBrace = creditEnd + 1;
  }
  input = input.substring(illustrationCloseBrace + 1);
  text = `Image by <a href="${href}">${credit}</a>`;
  return {
    illustration: { width, filename, text },
    input: input
  };
};

/**
 * Parses \section*{Subtasks} into a list of HTML. Describes each subtask with one HTML string.
 */
const parseSubtasks = (input: string): string[] => {
  const SUBTASK_PATTERN = 'Subtasks';
  const TASK_PATTERN = '\\item ';
  const SUBTASK_END = '\\end{itemize}';
  const subtaskStart = input.indexOf(SUBTASK_PATTERN);
  const subtaskEnd = input.indexOf(SUBTASK_END, subtaskStart);
  const taskString = input.substring(subtaskStart, subtaskEnd);
  const taskArray = [];

  let nextTaskIndex = taskString.indexOf(TASK_PATTERN);
  while (nextTaskIndex !== -1) {
    const start = nextTaskIndex + TASK_PATTERN.length;
    nextTaskIndex = taskString.indexOf(TASK_PATTERN, nextTaskIndex + 1);

    if (nextTaskIndex !== -1) {
      taskArray.push(taskString.substring(start, nextTaskIndex));
    } else {
      taskArray.push(taskString.substring(start, subtaskEnd));
    }
  }
  return taskArray;
};

/**
 * Parses \begin{itemize} \item ... \end{\itemize} in <ul> and <li>.
 */
export const parseItemize = (input: string): string => {
  input = input.replace(/\\begin{itemize}/g, '<ul><li>');
  input = input.replace(/\\end{itemize}/g, '</li></ul>');
  input = input.replace(/\\item/g, '</li><li>');
  const ITEM_BEGIN_PATTERN = '<ul>';
  const ITEM_END_pattern = '</ul>';
  const ITEM_PATTERN = '</li><li>';

  let itemStart = input.indexOf(ITEM_BEGIN_PATTERN);
  while (itemStart !== -1) {
    const first_item = input.indexOf(ITEM_PATTERN, itemStart);
    input = input.substring(0, first_item) + input.substring(first_item + ITEM_PATTERN.length);
    const itemEnd = input.indexOf(ITEM_END_pattern, itemStart);
    itemStart = input.indexOf(ITEM_BEGIN_PATTERN, itemEnd);
  }
  return input;
};

/**
 * Parses \section*{.*}.
 */
export const parseSection = (input: string): string => {
  // remove spaces before and after the input
  input = input.replace(/(^\s*)|(\s*$)/g, '');

  const SECTION_PATTERN = '\\section*{';
  const SECTION_SUBTASK_PATTERN = '\\section*{Subtasks';

  let sectionStart = input.indexOf(SECTION_PATTERN);
  let sectionSubtask = input.indexOf(SECTION_SUBTASK_PATTERN);

  while (sectionStart !== -1 && sectionStart !== sectionSubtask) {
    const titleEnd = input.indexOf('}', sectionStart);
    input = input.substring(0, sectionStart) + '</p></div><div class="section"><h3>' +
      input.substring(sectionStart + SECTION_PATTERN.length, titleEnd) +
      '</h3><p>' + input.substring(titleEnd + 1);
    sectionStart = input.indexOf(SECTION_PATTERN, sectionStart + 1);
    sectionSubtask = input.indexOf(SECTION_SUBTASK_PATTERN);
  }
  if (sectionSubtask !== -1) {
    input = input.substring(0, sectionSubtask);
  }
  // add <p> tag to the first paragraph without section name
  input = `<div class="section"><p>${input}</p></div>`;
  return input;
};

/**
 * Parses problem.en.tex in to HTML display.
 */
export const parseStatement = (input: string): WebStatement => {
  input = removeComments(input);

  const parsedSubtasks = parseSubtasks(input);
  const parsedTitle = parseProblemName(input);
  input = parsedTitle.input;
  const parsedIllustration: { illustration?: WebIllustration, input: string } = parseIllustration(input);
  input = parsedIllustration.input;
  let parsedStatement = parseSection(input);
  parsedStatement = parseCenter(parsedStatement);
  parsedStatement = parseItemize(parsedStatement);
  parsedStatement = parseFontStyle(parsedStatement);
  parsedStatement = parseQuotes(parsedStatement);
  parsedStatement = parseParagraphs(parsedStatement);

  return {
    title: parsedTitle.title,
    illustration: parsedIllustration.illustration,
    statement: parsedStatement,
    subtasks: parsedSubtasks
  };
};
