---
status: published
category: mcp-server
author: arnaldo-delisio
published_npm: true
npm_package: readwise-mcp-enhanced
published_directories: []
production_url: null
last_active: 2026-01-26
---

# Readwise MCP Enhanced

[![npm version](https://badge.fury.io/js/readwise-mcp-enhanced.svg)](https://badge.fury.io/js/readwise-mcp-enhanced)
[![npm downloads](https://img.shields.io/npm/dm/readwise-mcp-enhanced.svg)](https://www.npmjs.com/package/readwise-mcp-enhanced)

A comprehensive Model Context Protocol (MCP) server that unifies **Readwise Reader** document management with **full Readwise highlights** functionality. Works with Claude Desktop, Continue, and any MCP-compatible AI tool. Built with TypeScript, featuring advanced text processing, smart content controls, and context-optimized responses.

## 🚀 What This Is

**The first unified MCP** that combines:
- **Complete Readwise Reader API** - Save, manage, and search documents
- **Full Readwise Highlights API** - Access all your highlights, books, and daily reviews  
- **AI-Powered Text Processing** - Intelligent word segmentation and content extraction
- **Context Optimization** - 94% reduction in token usage while maintaining full functionality
- **Smart Content Controls** - Prevent context explosion with advanced filtering and pagination

**Equivalent to the official Readwise MCP** but more efficient and feature-complete. Compatible with all MCP clients.

---

## ✨ Key Features

### 📚 **Enhanced Reader Management**
- **Smart Content Extraction**: Pagination, keyword filtering, length limits
- **AI-Powered Text Processing**: Automatic word segmentation fixes merged words
- **Performance Controls**: Built-in warnings and guidance for expensive operations
- **Flexible Filtering**: By location, category, tags, dates, and custom criteria

### 🎯 **Complete Highlights Ecosystem**  
- **Daily Reviews**: Spaced repetition learning system
- **Advanced Search**: Field-specific queries with relevance scoring
- **Book Management**: Full metadata with highlight counts and filtering
- **Export & Backup**: Bulk highlight analysis and incremental sync
- **Manual Creation**: Add highlights with full metadata support

### ⚡ **Production Excellence**
- **Context Optimized**: 94% reduction in token usage (25,600 → 1,600 tokens)
- **Dual API Architecture**: Seamless v2 (highlights) + v3 (Reader) integration
- **Unlimited Results**: No artificial limits, just efficient data per item
- **MCP Protocol Compliant**: Proper logging, error handling, and rate limiting

---

## 🛠️ Installation

### Option 1: NPX - No Installation Required! (Recommended)

No installation needed! Any MCP client will automatically download and run the package using npx.

### Option 2: Global NPM Installation

```bash
npm install -g readwise-mcp-enhanced
```

### Option 3: From Source

```bash
git clone https://github.com/arnaldo-delisio/readwise-mcp-enhanced.git
cd readwise-mcp-enhanced
npm install
npm run build
```

## 🔧 Configuration

### With Any MCP-Compatible Tool

1. **Get your Readwise token:** https://readwise.io/access_token

2. **Add to your MCP client configuration:**

   **Claude Desktop:**  
   - **macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`  
   - **Windows**: `%APPDATA%\Claude\claude_desktop_config.json`

   **Continue IDE Extension:**  
   - Add to your Continue configuration file

   **Other MCP Tools:**  
   - Follow your tool's MCP server configuration instructions

   #### Option A - Using npx (Recommended):
   ```json
   {
     "mcpServers": {
       "readwise-mcp-enhanced": {
         "command": "npx",
         "args": ["readwise-mcp-enhanced"],
         "env": {
           "READWISE_TOKEN": "your_readwise_access_token_here"
         }
       }
     }
   }
   ```

   #### Option B - If installed globally via npm:
   ```json
   {
     "mcpServers": {
       "readwise-mcp-enhanced": {
         "command": "readwise-mcp-enhanced",
         "env": {
           "READWISE_TOKEN": "your_readwise_access_token_here"
         }
       }
     }
   }
   ```

   #### Option C - If installed from source:
   ```json
   {
     "mcpServers": {
       "readwise-mcp-enhanced": {
         "command": "node",
         "args": ["/path/to/readwise-mcp-enhanced/dist/index.js"],
         "env": {
           "READWISE_TOKEN": "your_readwise_access_token_here"
         }
       }
     }
   }
   ```

3. **Restart your MCP client** (Claude Desktop, Continue, etc.)

---

## 📖 Available Tools (13 Total)

### 📚 **Reader Tools (6) - Enhanced**

#### `readwise_save_document`
Save documents with full metadata control.
```json
{
  "url": "https://example.com/article",
  "tags": ["ai", "productivity"],
  "location": "later",
  "category": "article"
}
```

#### `readwise_list_documents` 
**⭐ Enhanced with Smart Content Controls**
```json
{
  "withFullContent": true,
  "contentMaxLength": 10000,
  "contentStartOffset": 0,
  "contentFilterKeywords": ["AI", "machine learning"],
  "limit": 10
}
```

**Smart Content Parameters:**
- **`contentMaxLength`**: Limit content per document (default: 50,000 chars)
- **`contentStartOffset`**: Start extraction from specific position (pagination)
- **`contentFilterKeywords`**: Extract only sections containing keywords
- **Performance warnings** for expensive operations

#### `readwise_update_document`
Update document metadata (title, author, summary, location, etc.)

#### `readwise_delete_document`  
Remove documents from your Reader library

#### `readwise_list_tags`
Get all your document tags

#### `readwise_topic_search`
**⭐ Enhanced with AI-powered text processing**
- Regex-based search across title, summary, notes, tags
- Automatic word segmentation for better matching
- Distributed keyword finding throughout content

---

### 🎯 **Highlights Tools (7) - New**

#### `readwise_list_highlights`
List highlights with advanced filtering:
```json
{
  "book_id": 12345,
  "highlighted_at__gt": "2024-01-01T00:00:00Z",
  "page_size": 100
}
```

#### `readwise_get_daily_review`
Get your spaced repetition highlights:
```json
{
  "review_id": 168844911,
  "highlights": [
    {
      "text": "Strategic wisdom quote...",
      "title": "The Art of War",
      "author": "Sun Tzu"
    }
  ]
}
```

#### `readwise_search_highlights`
**⭐ Advanced search with field-specific queries:**
```json
{
  "textQuery": "strategy tactics",
  "fieldQueries": [
    {
      "field": "document_title",
      "searchTerm": "Art of War"
    }
  ],
  "limit": 20
}
```

#### `readwise_list_books`
Get books with highlight metadata:
```json
{
  "category": "books", 
  "last_highlight_at__gt": "2024-01-01T00:00:00Z"
}
```

#### `readwise_get_book_highlights`
Get all highlights from a specific book:
```json
{
  "bookId": 53827741
}
```

#### `readwise_export_highlights`
Bulk export for analysis and backup:
```json
{
  "updatedAfter": "2024-01-01T00:00:00Z",
  "includeDeleted": false
}
```

#### `readwise_create_highlight`
Manually add highlights with metadata:
```json
{
  "highlights": [
    {
      "text": "Important insight...",
      "title": "Book Title",
      "author": "Author Name",
      "note": "My thoughts on this",
      "category": "books"
    }
  ]
}
```

---

## 🎯 Context Optimization

**94% Token Reduction** while maintaining full functionality:

| Tool | Before | After | Savings |
|------|--------|-------|---------|
| List Highlights (32 items) | ~25,600 tokens | ~1,600 tokens | 94% |
| Daily Review (5 items) | ~5,000 tokens | ~400 tokens | 92% |
| List Books (10 items) | ~8,000 tokens | ~600 tokens | 93% |

**Optimized Fields:**
- **Highlights**: `id`, `text`, `note`, `book_id` only
- **Books**: `id`, `title`, `author`, `category`, `num_highlights` only
- **Search**: `text`, `book`, `author`, `score` only

---

## 🧠 AI-Powered Features

### **Intelligent Word Segmentation**
Automatically fixes common text extraction issues:
- `whatyou` → `what you`
- `fromdissatisfaction` → `from dissatisfaction`  
- `timeago` → `time ago`

### **Smart Content Processing**
- **Sentence-based chunking** for YouTube transcripts
- **Distributed keyword filtering** throughout content
- **Context-aware text extraction** with proper spacing

### **Advanced Search Algorithm**
- **Multi-field search** with relevance scoring
- **Export-based comprehensive search** equivalent to official MCP
- **Field-specific filtering** (title, author, text, notes, tags)

---

## 📊 Technical Architecture

### **Dual API Client System**
```typescript
// Seamless API switching
v2 API: Highlights, books, daily review, export
v3 API: Reader documents, tags, search
```

### **Context-Efficient Design**
- **Unlimited results** with minimal data per item
- **LLM-optimized responses** for efficient parsing
- **Structured JSON** maintains full reasoning capabilities

### **Production Ready**
- **ES Module standard** with proper TypeScript definitions
- **MCP protocol compliant** logging and error handling
- **Comprehensive rate limiting** and graceful fallbacks

---

## ⚙️ API Coverage

### **Readwise Reader API (v3)**
- ✅ Documents: Save, list, update, delete
- ✅ Tags: List and filter
- ✅ Content: Smart extraction with controls
- ✅ Search: Enhanced topic search

### **Readwise Highlights API (v2)**  
- ✅ Highlights: List, create, search, export
- ✅ Books: List with metadata and filtering
- ✅ Daily Review: Spaced repetition system
- ✅ Advanced Search: Field-specific queries

---

## 🔐 Authentication & Security

- **Single Token**: One Readwise token for both APIs
- **Environment Variable**: Secure token storage via `READWISE_TOKEN`
- **No Token Exposure**: Never exposed through MCP clients or tools interface

---

## 📈 Rate Limits

- **Reader API**: 20 requests/minute (default), 50/minute (CREATE/UPDATE)
- **Highlights API**: Standard Readwise limits with automatic retry-after handling
- **Smart Handling**: 429 responses include "Retry-After" header processing

---

## 🚀 Usage Examples

### **Smart Content Extraction**
```typescript
// Paginate through large document
readwise_list_documents({
  withFullContent: true,
  contentMaxLength: 5000,
  contentStartOffset: 0,
  contentFilterKeywords: ["machine learning", "AI"]
})
```

### **Comprehensive Search**
```typescript
// Search across documents and highlights
readwise_search_highlights({
  textQuery: "productivity habits",
  fieldQueries: [
    { field: "document_author", searchTerm: "James Clear" }
  ],
  limit: 10
})
```

### **Daily Learning Workflow**
```typescript
// Get daily review for spaced repetition
readwise_get_daily_review()

// Search related highlights for deeper study
readwise_search_highlights({
  textQuery: "from daily review topics",
  limit: 20
})
```

---

## 📦 Dependencies

```json
{
  "@modelcontextprotocol/sdk": "^1.0.0",
  "dotenv": "^16.3.0", 
  "node-html-parser": "^7.0.1",
  "wordsninja": "^1.0.0"
}
```

**Key Addition**: `wordsninja` for AI-powered word segmentation

---

## 🔄 Migration from Basic Reader MCP

This unified MCP is **fully backward compatible**. All existing Reader tools work unchanged while adding 7 new highlights tools.

**No breaking changes** - just enhanced functionality and better performance.

---

## 🌟 Why This MCP?

### **vs. Official Readwise MCP**
- ✅ **More context efficient** (94% reduction)
- ✅ **Unified interface** (Reader + Highlights)
- ✅ **Smart content controls** (pagination, filtering)
- ✅ **AI-powered text processing**
- ✅ **Unlimited results** with minimal verbosity

### **vs. Basic Reader MCPs**  
- ✅ **Complete highlights ecosystem** (7 new tools)
- ✅ **Advanced search capabilities**
- ✅ **Production-ready performance**
- ✅ **Context optimization**

---

## 📄 License

MIT

---

## 🙏 Acknowledgments

Built upon the foundation of [edricgan/Readwise-Reader-MCP](https://github.com/edricgsh/Readwise-Reader-MCP) with significant enhancements:

- **Enhanced Reader functionality** with smart content controls
- **Complete highlights integration** equivalent to official MCP
- **AI-powered text processing** with word segmentation
- **Context optimization** for production efficiency
- **Unified architecture** combining dual APIs seamlessly

**This represents a complete evolution from basic document management to a comprehensive, production-ready Readwise platform.** 🚀