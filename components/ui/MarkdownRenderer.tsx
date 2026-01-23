import React from 'react';
import Markdown from 'react-markdown';
import { ChevronRight } from 'lucide-react';

interface MarkdownRendererProps {
  content: string;
}

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content }) => {
  return (
    <Markdown
      className="markdown-content space-y-3"
      components={{
        strong: ({ node, ...props }) => (
          <strong className="font-bold text-accent dark:text-[#8b5cf6]" {...props} />
        ),
        ul: ({ node, ...props }) => (
          <ul className="space-y-1 my-2" {...props} />
        ),
        ol: ({ node, ...props }) => (
          <ol className="list-decimal pl-5 space-y-1 text-light-text dark:text-dark-text marker:text-brand marker:font-bold" {...props} />
        ),
        li: ({ node, ...props }) => {
           // Check if parent is UL to add custom icon
           const isUl = node?.parent?.tagName === 'ul';
           return (
             <li className={`flex items-start gap-2 ${isUl ? '' : 'pl-1'}`} {...props}>
                {isUl && <span className="mt-1.5 flex-shrink-0 w-1.5 h-1.5 bg-brand rounded-full"></span>}
                <span>{props.children}</span>
             </li>
           );
        },
        blockquote: ({ node, ...props }) => (
          <blockquote className="border-l-4 border-accent bg-slate-50 dark:bg-slate-900/50 pl-4 py-3 italic my-4 rounded-r-lg shadow-sm" {...props} />
        ),
        a: ({ node, ...props }) => (
            <a 
                className="text-brand dark:text-blue-400 font-medium relative hover:text-accent transition-colors no-underline group" 
                {...props} 
            >
                {props.children}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-accent transition-all duration-300 group-hover:w-full"></span>
            </a>
        ),
        code: ({ node, ...props }) => {
          const isInline = !String(props.children).includes('\n');
          return isInline ? (
             <code className="bg-[#0A0A0B] border border-green-900/50 px-1.5 py-0.5 rounded text-sm font-mono text-[#00FF41] shadow-[0_0_10px_rgba(0,255,65,0.2)]" {...props} />
          ) : (
             <code className="block bg-[#0A0A0B] text-[#00FF41] p-3 rounded-lg text-xs font-mono overflow-x-auto border border-green-900/50 shadow-inner" {...props} />
          );
        },
        pre: ({ node, ...props }) => (
            <pre className="not-prose my-2" {...props} />
        )
      }}
    >
      {content}
    </Markdown>
  );
};