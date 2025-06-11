// BlogManagerActions.js
// This script adds custom action buttons to the blog manager table
// DISABLED to prevent console spam when not on blog manager page

/*
document.addEventListener('DOMContentLoaded', function() {
  // Only run this script on the blog manager page
  if (!window.location.pathname.includes('/admin') || !window.location.pathname.includes('blog')) {
    return;
  }

  let retryCount = 0;
  const maxRetries = 3;
  
  // Function to add action buttons
  function addActionButtons() {
    retryCount++;
    
    // Find the blog manager table
    const table = document.querySelector('.blog-manager-table');
    if (!table) {
      if (retryCount < maxRetries) {
        console.log(`Blog manager table not found, retry ${retryCount}/${maxRetries}`);
      }
      return false;
    }
    
    // Find all rows in the table body
    const rows = table.querySelectorAll('tbody tr');
    if (rows.length === 0) {
      if (retryCount < maxRetries) {
        console.log('No rows found in the table, will try again later');
      }
      return false;
    }
    
    console.log(`Found ${rows.length} rows in the blog manager table`);
    
    // Process each row
    rows.forEach((row, index) => {
      // Get the post ID and slug from data attributes or other elements
      const titleCell = row.querySelector('td:first-child');
      if (!titleCell) return;
      
      const title = titleCell.querySelector('.text-sm.font-medium')?.textContent || `Post ${index + 1}`;
      const excerpt = titleCell.querySelector('.text-sm.text-gray-500')?.textContent || '';
      
      // Get the URL cell to extract the slug
      const urlCell = row.querySelector('td:nth-child(5)');
      const slugElement = urlCell?.querySelector('.text-xs.text-gray-500');
      const slug = slugElement?.textContent?.replace('/blog/', '') || `post-${index + 1}`;
      
      // Check if the last cell exists and if it already has action buttons
      const actionsCell = row.querySelector('td:last-child');
      if (!actionsCell) {
        console.log(`No actions cell found for row ${index + 1}`);
        return;
      }
      
      // Check if action buttons already exist
      if (actionsCell.querySelector('.blog-manager-actions')) {
        console.log(`Action buttons already exist for row ${index + 1}`);
        return;
      }
      
      // Create action buttons container
      const actionsContainer = document.createElement('div');
      actionsContainer.className = 'blog-manager-actions';
      
      // Create view button
      const viewButton = document.createElement('button');
      viewButton.className = 'text-blue-600 hover:text-blue-900 view-button';
      viewButton.title = 'View Post';
      viewButton.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"></path><circle cx="12" cy="12" r="3"></circle></svg>';
      viewButton.onclick = () => {
        window.open(`/blog/${slug}`, '_blank');
      };
      
      // Create edit button
      const editButton = document.createElement('button');
      editButton.className = 'text-indigo-600 hover:text-indigo-900 edit-button';
      editButton.title = 'Edit Post';
      editButton.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"></path><path d="m15 5 4 4"></path></svg>';
      editButton.onclick = () => {
        window.location.href = `/admin/blog-editor/${slug}`;
      };
      
      // Create delete button
      const deleteButton = document.createElement('button');
      deleteButton.className = 'text-red-600 hover:text-red-900 delete-button';
      deleteButton.title = 'Delete Post';
      deleteButton.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path><line x1="10" x2="10" y1="11" y2="17"></line><line x1="14" x2="14" y1="11" y2="17"></line></svg>';
      deleteButton.onclick = () => {
        if (confirm(`Are you sure you want to delete "${title}"?`)) {
          console.log(`Delete post: ${title}`);
          // The actual delete functionality will be handled by the React component
          // This is just a UI enhancement
        }
      };
      
      // Add buttons to container
      actionsContainer.appendChild(viewButton);
      actionsContainer.appendChild(editButton);
      actionsContainer.appendChild(deleteButton);
      
      // Add container to cell
      actionsCell.appendChild(actionsContainer);
      
      console.log(`Added action buttons to row ${index + 1}: ${title}`);
    });
    
    console.log('Finished adding custom action buttons');
    return true;
  }
  
  // Try to add action buttons immediately
  if (addActionButtons()) {
    return; // Success, no need to retry
  }
  
  // Only set up retries if initial attempt failed
  if (retryCount < maxRetries) {
    setTimeout(() => {
      if (retryCount < maxRetries) addActionButtons();
    }, 1000);
  }
});
*/

// Script disabled to prevent console spam. 
// Re-enable by uncommenting the code above when on the blog manager page.
console.log('BlogManagerActions.js loaded but disabled');
