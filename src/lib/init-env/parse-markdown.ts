import MarkdownIt, { Token } from 'markdown-it';
import rexrex from 'rexrex';
import { ParsedCommand, When } from 'takeoff';
import { Task, TaskEvent } from 'task';

const md = new MarkdownIt({
  // Enable HTML so that we can ignore it later
  html: true,
});

const space = rexrex.extra(rexrex.matchers.WHITE_SPACE);

const isCommandReTemplate = rexrex.and(
  rexrex.matchers.START, // ^
  rexrex.wildcard(rexrex.matchers.WHITE_SPACE),
  ['Runs' + rexrex.matchers.LAZY, 'tasks' + rexrex.matchers.LAZY].join(space),
);

const isCommandRe = new RegExp(isCommandReTemplate, rexrex.flags.INSENSITIVE);
const commandsRe = new RegExp(/`([^`]+)`/g);

const isCommand = (v: string) => Boolean(v.match(isCommandRe)) && Boolean(v.match(commandsRe));

const parseCommand = (v: string): ParsedCommand => {
  const inParallel = Boolean(v.match(/in\s+parallel/i));
  const when = (v.match(/before|after/i) || ['before'])[0] as When;
  const taskNames = v.match(commandsRe).map(c => /`(.+)`/.exec(c)[1]);
  return {
    inParallel: Boolean(inParallel),
    taskNames,
    when,
  };
};

const extractParagraphs = (tokens: Token[]): string[] => {
  const paragraphs = [];
  for (const [index, token] of tokens.entries()) {
    if (token.type === 'paragraph_open') {
      paragraphs.push(tokens[index + 1].content);
    }
  }
  return paragraphs;
};

const isOpenHeader = (token: Token, tag = 'h2') => token.type === 'heading_open' && token.tag === tag;

const selectSubset = (tokens: Token[], firstIndex: number, tag = 'h2') => {
  const remaining = tokens.slice(firstIndex + 1);

  const next = remaining.findIndex((t: Token) => t.type === 'heading_open' && t.tag === tag);

  return remaining.slice(0, next === -1 ? undefined : next);
};

export = (content: string): Task[] => {
  const tokens = md.parse(content, null);

  const tasks: Task[] = [];

  for (const [index, token] of tokens.entries()) {
    if (isOpenHeader(token, 'h2')) {
      const task: Partial<Task> = {
        after: [],
        before: [],
        name: tokens[index + 1].content,
      };

      const sectionTokens = selectSubset(tokens, index, 'h2');

      // Get paragraphs from the tokens of this h2 section
      const paragraphs = extractParagraphs(sectionTokens);
      // Set paragraph contents as task description
      // Except for special commands
      task.description = paragraphs
        .filter(p => {
          const isCommandBool = isCommand(p);
          if (isCommandBool) {
            const { taskNames, when, inParallel } = parseCommand(p);
            (task[when] as TaskEvent[]).push({
              inParallel,
              taskNames,
            });
          }
          return !isCommandBool;
        })
        .join('\n\n');

      // Get task script from the tokens' code fences
      // Currently only use the first one
      for (const sectionToken of sectionTokens) {
        if (sectionToken.type === 'fence') {
          task.script = sectionToken.content;
          task.type = sectionToken.info;
          break;
        }
      }

      tasks.push(task as Task);
    }
  }

  return tasks;
};
