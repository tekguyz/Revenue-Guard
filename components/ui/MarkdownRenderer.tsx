
import React from 'react';
import Markdown from 'react-markdown';
import { ChevronRight } from 'lucide-react';

interface MarkdownRendererProps {
  content: string;
}

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content }) => {
  return (
    // Wrap Markdown in a div to apply container styling since className is not a valid prop on the Markdown component itself
    <div className="markdown-content space-y-3">
      <Markdown
        components={{
          strong: ({ node, ...props }) => (
            <strong className="font-black text-current underline decoration-current/20" {...props} />
          ),
          ul: ({ node, ...props }) => (
            <ul className="space-y-1 my-2" {...props} />
          ),
          ol: ({ node, ...props }) => (
            <ol className="list-decimal pl-5 space-y-1 text-inherit marker:text-inherit marker:font-bold" {...props} />
          ),
          li: ({ node, ...props }) => {
             // Accessing parent property may require type assertion depending on react-markdown version
             const isUl = (node as any)?.parent?.tagName === 'ul';
             return (
               <li className={`flex items-start gap-2 ${isUl ? '' : 'pl-1'}`} {...props}>
                  {isUl && <span className="mt-1.5 flex-shrink-0 w-1.5 h-1.5 bg-current opacity-50 rounded-full"></span>}
                  <span>{props.children}</span>
               </li>
             );
          },
          blockquote: ({ node, ...props }) => (
            <blockquote className="border-l-4 border-current/30 bg-black/5 dark:bg-white/5 pl-4 py-3 italic my-4 rounded-r-lg shadow-sm" {...props} />
          ),
          a: ({ node, ...props }) => (
              <a 
                  className="font-bold underline decoration-current/40 hover:decoration-current transition-all" 
                  {...props} 
              >
                  {props.children}
              </a>
          ),
          code: ({ node, ...props }) => {
            const isInline = !String(props.children).includes('\n');
            return isInline ? (
               <code className="bg-black/20 px-1.5 py-0.5 rounded text-sm font-mono text-current" {...props} />
            ) : (
               <code className="block bg-black/30 p-3 rounded-lg text-xs font-mono overflow-x-auto border border-white/10" {...props} />
            );
          },
          pre: ({ node, ...props }) => (
              <pre className="not-prose my-2" {...props} />
          )
        }}
      >
        {content}
      </Markdown>
    </div>
  );
};
