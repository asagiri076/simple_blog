import { JSDOM } from 'jsdom';

export interface TocItem {
  id: string;
  title: string;
  level: number;
  children?: TocItem[];
}

export function generateTableOfContents(content: string): TocItem[] {
  // Server-side processing with JSDOM
  const dom = new JSDOM(content);
  const doc = dom.window.document;
  const headings = doc.querySelectorAll('h2, h3, h4');
  
  const toc: TocItem[] = [];
  const stack: TocItem[] = [];

  headings.forEach((heading: Element) => {
    const level = parseInt(heading.tagName.substring(1));
    const title = heading.textContent?.trim() || '';
    
    if (!title) return;

    // Generate ID from title for fallback (supporting Japanese)
    const generateId = (text: string) => {
      return text
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^\w\u3040-\u309f\u30a0-\u30ff\u4e00-\u9faf-]/g, '')
        .substring(0, 50);
    };

    // Use existing ID or generate one
    let id = (heading as HTMLElement).id;
    if (!id) {
      id = generateId(title);
      (heading as HTMLElement).id = id;
    }

    const tocItem: TocItem = {
      id,
      title,
      level,
      children: []
    };

    // Clear stack of items with equal or higher level
    while (stack.length > 0 && stack[stack.length - 1].level >= level) {
      stack.pop();
    }

    if (stack.length === 0) {
      // Top level item
      toc.push(tocItem);
    } else {
      // Child item
      const parent = stack[stack.length - 1];
      if (!parent.children) {
        parent.children = [];
      }
      parent.children.push(tocItem);
    }

    stack.push(tocItem);
  });

  return toc;
}

export function renderTableOfContents(tocItems: TocItem[]): string {
  if (tocItems.length === 0) {
    return '';
  }

  function renderTocList(items: TocItem[], level = 0): string {
    const listClass = level === 0 ? 'toc-list' : 'toc-sublist';
    const listItems = items.map(item => {
      const hasChildren = item.children && item.children.length > 0;
      const childrenHtml = hasChildren ? renderTocList(item.children!, level + 1) : '';
      
      return `
        <li class="toc-item toc-level-${item.level}">
          <a href="#${item.id}" class="toc-link" data-level="${item.level}">
            ${item.title}
          </a>
          ${childrenHtml}
        </li>
      `;
    }).join('');

    return `<ul class="${listClass}">${listItems}</ul>`;
  }

  const tocHtml = `
    <nav class="table-of-contents">
      <div class="toc-header">
        <h2>目次</h2>
      </div>
      <div class="toc-content">
        ${renderTocList(tocItems)}
      </div>
    </nav>
  `;

  return tocHtml;
}

export function replaceTocPlaceholders(content: string): string {
  // Generate ToC from headings
  const tocItems = generateTableOfContents(content);
  const tocHtml = renderTableOfContents(tocItems);
  
  // Replace all <p>[toc]</p> with the generated ToC
  let processedContent = content;
  
  // Pattern to match <p>[toc]</p> with optional whitespace
  const tocPattern = /<p\s*[^>]*>\s*\[toc\]\s*<\/p>/gi;
  
  if (tocHtml && processedContent.match(tocPattern)) {
    processedContent = processedContent.replace(tocPattern, tocHtml);
  }
  
  return processedContent;
}