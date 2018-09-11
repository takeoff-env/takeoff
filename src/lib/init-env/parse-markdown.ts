import MarkdownIt, { Token } from 'markdown-it';
import rexrex from 'rexrex';
import { Task, TaskEvent } from 'task';
import { ParsedCommand, When } from 'takeoff';

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
  const taskNames = v.match(commandsRe).map(v => /`(.+)`/.exec(v)[1]);
  return {
    taskNames,
    when,
    inParallel: Boolean(inParallel),
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
  let tokens = md.parse(content, null);

  const tasks: Task[] = [];

  for (const [index, token] of tokens.entries()) {
    if (isOpenHeader(token, 'h2')) {
      const task: Partial<Task> = {
        name: tokens[index + 1].content,
        before: [],
        after: [],
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
              taskNames,
              inParallel,
            });
          }
          return !isCommandBool;
        })
        .join('\n\n');

      // Get task script from the tokens' code fences
      // Currently only use the first one
      for (const token of sectionTokens) {
        if (token.type === 'fence') {
          task.script = token.content;
          task.type = token.info;
          break;
        }
      }

      tasks.push(<Task>task);
    }
  }

  return tasks;
};
