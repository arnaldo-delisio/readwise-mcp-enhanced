import { initializeClient } from '../utils/client-init.js';

export async function handleListHighlights(args: any) {
  const client = await initializeClient();
  
  const params = {
    page_size: args.page_size,
    page: args.page,
    book_id: args.book_id,
    updated__lt: args.updated__lt,
    updated__gt: args.updated__gt,
    highlighted_at__lt: args.highlighted_at__lt,
    highlighted_at__gt: args.highlighted_at__gt,
  };
  
  const response = await client.listHighlights(params);
  
  // Strip to essentials
  const minimal = {
    count: response.data.count,
    results: response.data.results.map(h => ({
      id: h.id,
      text: h.text,
      note: h.note || undefined,
      book_id: h.book_id
    }))
  };
  
  return {
    content: [
      {
        type: 'text',
        text: JSON.stringify(minimal),
      },
    ],
  };
}

export async function handleCreateHighlight(args: any) {
  const client = await initializeClient();
  
  const response = await client.createHighlight(args);
  
  return {
    content: [
      {
        type: 'text',
        text: JSON.stringify(response.data),
      },
    ],
  };
}

export async function handleExportHighlights(args: any) {
  const client = await initializeClient();
  
  const params = {
    updatedAfter: args.updatedAfter,
    ids: args.ids,
    includeDeleted: args.includeDeleted,
    pageCursor: args.pageCursor,
  };
  
  const response = await client.exportHighlights(params);
  
  return {
    content: [
      {
        type: 'text',
        text: JSON.stringify(response.data),
      },
    ],
  };
}

export async function handleGetDailyReview(args: any) {
  const client = await initializeClient();
  
  const response = await client.getDailyReview();
  
  // Strip to essentials for daily review
  const minimal = {
    review_id: response.data.review_id,
    review_url: response.data.review_url,
    highlights: response.data.highlights.map(h => ({
      text: h.text,
      title: h.title,
      author: h.author,
      note: h.note || undefined
    }))
  };
  
  return {
    content: [
      {
        type: 'text',
        text: JSON.stringify(minimal),
      },
    ],
  };
}

export async function handleListBooks(args: any) {
  const client = await initializeClient();
  
  const params = {
    page_size: args.page_size,
    page: args.page,
    category: args.category,
    source: args.source,
    updated__lt: args.updated__lt,
    updated__gt: args.updated__gt,
    last_highlight_at__lt: args.last_highlight_at__lt,
    last_highlight_at__gt: args.last_highlight_at__gt,
  };
  
  const response = await client.listBooks(params);
  
  // Strip to essentials
  const minimal = {
    count: response.data.count,
    results: response.data.results.map(b => ({
      id: b.id,
      title: b.title,
      author: b.author,
      category: b.category,
      num_highlights: b.num_highlights
    }))
  };
  
  return {
    content: [
      {
        type: 'text',
        text: JSON.stringify(minimal),
      },
    ],
  };
}

export async function handleGetBookHighlights(args: any) {
  const client = await initializeClient();
  
  const response = await client.getBookHighlights(args.bookId);
  
  // Strip to essentials
  const minimal = response.data.map(h => ({
    id: h.id,
    text: h.text,
    note: h.note || undefined
  }));
  
  return {
    content: [
      {
        type: 'text',
        text: JSON.stringify(minimal),
      },
    ],
  };
}

export async function handleSearchHighlights(args: any) {
  const client = await initializeClient();
  
  const params = {
    textQuery: args.textQuery,
    fieldQueries: args.fieldQueries,
    bookId: args.bookId,
    limit: args.limit,
  };
  
  const response = await client.searchHighlights(params);
  
  // Strip to essentials
  const minimal = response.data.map(result => ({
    text: result.highlight.text,
    note: result.highlight.note || undefined,
    book: result.book.title,
    author: result.book.author,
    score: result.score
  }));
  
  return {
    content: [
      {
        type: 'text',
        text: JSON.stringify(minimal),
      },
    ],
  };
}

// Enhanced topic search handler that replaces the existing one
export async function handleEnhancedTopicSearch(args: any) {
  const client = await initializeClient();
  
  const response = await client.searchDocumentsAndHighlights(args.searchTerms);
  
  // Strip to essentials
  const minimal = {
    documents: response.data.documents.map(d => ({
      id: d.id,
      title: d.title,
      author: d.author,
      url: d.url
    })),
    highlights: response.data.highlights?.map(result => ({
      text: result.highlight.text,
      book: result.book.title,
      author: result.book.author
    })),
    books: response.data.books?.map(b => ({
      id: b.id,
      title: b.title,
      author: b.author,
      num_highlights: b.num_highlights
    }))
  };
  
  return {
    content: [
      {
        type: 'text',
        text: JSON.stringify(minimal),
      },
    ],
  };
}