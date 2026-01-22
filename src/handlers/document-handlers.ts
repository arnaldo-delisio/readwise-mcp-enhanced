import { CreateDocumentRequest, UpdateDocumentRequest, ListDocumentsParams } from '../types.js';
import { initializeClient } from '../utils/client-init.js';
import { convertUrlToText, extractTextFromHtml, processContentWithOptions } from '../utils/content-converter.js';

export async function handleSaveDocument(args: any) {
  const client = initializeClient();
  const data = args as unknown as CreateDocumentRequest;
  const response = await client.createDocument(data);

  let responseText = `Document saved successfully!\nID: ${response.data.id}\nTitle: ${response.data.title || 'Untitled'}\nURL: ${response.data.url}\nLocation: ${response.data.location}`;
  
  if (response.messages && response.messages.length > 0) {
    responseText += '\n\nMessages:\n' + response.messages.map(msg => `${msg.type.toUpperCase()}: ${msg.content}`).join('\n');
  }

  return {
    content: [
      {
        type: 'text',
        text: responseText,
      },
    ],
  };
}

export async function handleListDocuments(args: any) {
  const client = initializeClient();
  const params = args as ListDocumentsParams;
  
  // If withFullContent is true, we also need HTML content
  if (params.withFullContent === true) {
    params.withHtmlContent = true;
  }
  
  let response;
  let clientSideFiltered = false;
  
  // If addedAfter is specified, we need to fetch all documents and filter client-side
  if (params.addedAfter) {
    clientSideFiltered = true;
    const addedAfterDate = new Date(params.addedAfter);
    
    // Create params without addedAfter for the API call
    const apiParams = { ...params };
    delete apiParams.addedAfter;
    
    // Fetch all documents if no other pagination is specified
    if (!apiParams.pageCursor && !apiParams.limit) {
      const allDocuments: any[] = [];
      let nextPageCursor: string | undefined;
      
      do {
        const fetchParams = { ...apiParams };
        if (nextPageCursor) {
          fetchParams.pageCursor = nextPageCursor;
        }
        
        const pageResponse = await client.listDocuments(fetchParams);
        allDocuments.push(...pageResponse.data.results);
        nextPageCursor = pageResponse.data.nextPageCursor;
      } while (nextPageCursor);
      
      // Filter documents by addedAfter date
      const filteredDocuments = allDocuments.filter(doc => {
        if (!doc.saved_at) return false;
        const savedDate = new Date(doc.saved_at);
        return savedDate > addedAfterDate;
      });
      
      response = {
        data: {
          count: filteredDocuments.length,
          nextPageCursor: undefined,
          results: filteredDocuments
        },
        messages: []
      };
    } else {
      // If pagination is specified, just do a regular API call and filter the current page
      response = await client.listDocuments(apiParams);
      const filteredDocuments = response.data.results.filter(doc => {
        if (!doc.saved_at) return false;
        const savedDate = new Date(doc.saved_at);
        return savedDate > addedAfterDate;
      });
      
      response.data.results = filteredDocuments;
      response.data.count = filteredDocuments.length;
    }
  } else {
    response = await client.listDocuments(params);
  }

  // Convert content to LLM-friendly text for documents only if withFullContent is explicitly true
  const shouldIncludeContent = params.withFullContent === true; // Default to false for performance
  
  // Process documents with content if needed
  const documentsWithText = await Promise.all(
    response.data.results.map(async (doc) => {
      let content = '';
      let contentMetadata: any = {};
      
      if (shouldIncludeContent) {
        let rawContent = '';
        
        // Try to use HTML content first (from Readwise), fallback to URL fetching
        if (doc.html_content) {
          // Use HTML content from Readwise for non-jina content types
          const shouldUseJina = !doc.category || doc.category === 'article' || doc.category === 'pdf';
          if (shouldUseJina) {
            const urlToConvert = doc.source_url || doc.url;
            if (urlToConvert) {
              rawContent = await convertUrlToText(urlToConvert, doc.category);
            }
          } else {
            rawContent = await extractTextFromHtml(doc.html_content);
          }
        } else {
          // Fallback to URL fetching if no HTML content available
          const urlToConvert = doc.source_url || doc.url;
          if (urlToConvert) {
            rawContent = await convertUrlToText(urlToConvert, doc.category);
          }
        }
        
        // Process content with pagination and filtering options
        if (rawContent) {
          const processResult = processContentWithOptions(rawContent, {
            maxLength: params.contentMaxLength,
            startOffset: params.contentStartOffset,
            filterKeywords: params.contentFilterKeywords
          });
          
          content = processResult.content;
          contentMetadata = {
            contentTruncated: processResult.truncated,
            contentTotalLength: processResult.totalLength,
            contentExtractedSections: processResult.extractedSections?.length || 0,
            // Include debug info in response
            ...(processResult.debug && { contentDebug: processResult.debug })
          };
          
          // Add helpful metadata for users
          if (processResult.truncated) {
            contentMetadata.contentNote = `Content truncated. Original length: ${processResult.totalLength} chars. ` +
              `To get more content, use contentStartOffset=${(params.contentStartOffset || 0) + (params.contentMaxLength || 50000)}`;
          }
          
          if (params.contentFilterKeywords && params.contentFilterKeywords.length > 0) {
            contentMetadata.contentKeywordsUsed = params.contentFilterKeywords;
            
            // If no content found after filtering, add a helpful note
            if (!processResult.extractedSections || processResult.extractedSections.length === 0) {
              contentMetadata.contentFilterNote = `No content sections found containing the keywords: ${params.contentFilterKeywords.join(', ')}`;
            }
          }
        }
      }
      
      const result: any = {
        id: doc.id,
        url: doc.url,
        title: doc.title,
        author: doc.author,
        source: doc.source,
        category: doc.category,
        location: doc.location,
        tags: doc.tags,
        site_name: doc.site_name,
        word_count: doc.word_count,
        created_at: doc.created_at,
        updated_at: doc.updated_at,
        published_date: doc.published_date,
        summary: doc.summary,
        image_url: doc.image_url,
        source_url: doc.source_url,
        notes: doc.notes,
        parent_id: doc.parent_id,
        reading_progress: doc.reading_progress,
        first_opened_at: doc.first_opened_at,
        last_opened_at: doc.last_opened_at,
        saved_at: doc.saved_at,
        last_moved_at: doc.last_moved_at,
        ...contentMetadata, // Add content processing metadata
      };
      
      if (shouldIncludeContent) {
        result.content = content; // LLM-friendly text content instead of raw HTML
      }
      
      if (params.withHtmlContent && doc.html_content) {
        result.html_content = doc.html_content;
      }
      
      return result;
    })
  );

  // Create a summary response to avoid token limits
  let responseText = '';
  
  if (shouldIncludeContent && (params.contentMaxLength || params.contentFilterKeywords)) {
    // When content processing is involved, provide a more compact response
    responseText = `Found ${response.data.count} document(s).\n\n`;
    
    documentsWithText.forEach((doc, index) => {
      responseText += `Document ${index + 1}:\n`;
      responseText += `Title: ${doc.title || 'Untitled'}\n`;
      responseText += `Author: ${doc.author || 'Unknown'}\n`;
      responseText += `Category: ${doc.category || 'Unknown'}\n`;
      responseText += `URL: ${doc.url}\n`;
      
      if (doc.content) {
        responseText += `\nContent (${doc.content.length} characters):\n${doc.content}\n`;
      }
      
      if (doc.contentTruncated) {
        responseText += `\n[Content was truncated. Original length: ${doc.contentTotalLength} chars]\n`;
      }
      
      if (doc.contentFilterNote) {
        responseText += `\n[${doc.contentFilterNote}]\n`;
      }
      
      responseText += '\n' + '='.repeat(50) + '\n\n';
    });
    
    if (response.data.nextPageCursor) {
      responseText += `Next page cursor: ${response.data.nextPageCursor}\n`;
    }
  } else {
    // For non-content requests, return compact JSON
    responseText = JSON.stringify({
      count: response.data.count,
      nextPageCursor: response.data.nextPageCursor,
      documents: documentsWithText.map(doc => ({
        id: doc.id,
        title: doc.title,
        author: doc.author,
        category: doc.category,
        url: doc.url,
        summary: doc.summary,
        reading_progress: doc.reading_progress
      }))
    });
  }
  
  let allMessages = response.messages || [];
  
  // Add message about client-side filtering if it was performed
  if (clientSideFiltered) {
    allMessages.push({
      type: 'info',
      content: 'Documents were filtered client-side based on the addedAfter date. All documents were fetched from the API first, then filtered by their saved_at date.'
    });
  }
  
  // Add information about parameter usage
  if (params.limit && params.limit > 0) {
    allMessages.push({
      type: 'info',
      content: `Document limit of ${params.limit} was applied client-side after API response.`
    });
  }
  
  if (params.contentFilterKeywords && params.contentFilterKeywords.length > 0) {
    allMessages.push({
      type: 'info',
      content: `Content was filtered for keywords: ${params.contentFilterKeywords.join(', ')}. Check individual documents for contentFilterNote if no matches found.`
    });
  }
  
  if (allMessages.length > 0) {
    responseText += '\n\nMessages:\n' + allMessages.map(msg => `${msg.type.toUpperCase()}: ${msg.content}`).join('\n');
  }

  return {
    content: [
      {
        type: 'text',
        text: responseText,
      },
    ],
  };
}

export async function handleUpdateDocument(args: any) {
  const client = initializeClient();
  const { id, ...updateData } = args as unknown as { id: string } & UpdateDocumentRequest;
  const response = await client.updateDocument(id, updateData);

  let responseText = `Document updated successfully!\nID: ${response.data.id}\nReader URL: ${response.data.url}`;
  
  if (response.messages && response.messages.length > 0) {
    responseText += '\n\nMessages:\n' + response.messages.map(msg => `${msg.type.toUpperCase()}: ${msg.content}`).join('\n');
  }

  return {
    content: [
      {
        type: 'text',
        text: responseText,
      },
    ],
  };
}

export async function handleDeleteDocument(args: any) {
  const client = initializeClient();
  const { id } = args as { id: string };
  const response = await client.deleteDocument(id);

  let responseText = `Document ${id} deleted successfully!`;
  
  if (response.messages && response.messages.length > 0) {
    responseText += '\n\nMessages:\n' + response.messages.map(msg => `${msg.type.toUpperCase()}: ${msg.content}`).join('\n');
  }

  return {
    content: [
      {
        type: 'text',
        text: responseText,
      },
    ],
  };
}