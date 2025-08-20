// Amazon seller IDs for different regions
const SELLER_IDS = {
  'amazon.com': 'ATVPDKIKX0DER',
  'amazon.ca': 'A3DWYIK6Y9EEQB',
  'amazon.co.uk': 'A3P5ROKL5A1OLE',
  'amazon.com.mx': 'AVDBXBAVVSXLQ',
  'amazon.com.br': 'A1ZZFT5FULY4LN',
  'amazon.fr': 'A1X6FK5RDHNB96',
  'amazon.de': 'A3JWKAKR8XB7XF',
  'amazon.it': 'A11IL2PNWYJU7H',
  'amazon.es': 'A1AT7YVPFBWXBL'
};

// Global variables
let hideSponsoredEnabled = true;
let mutationObserver = null;

// Get the current Amazon domain
function getCurrentDomain() {
  const hostname = window.location.hostname;
  for (const domain in SELLER_IDS) {
    if (hostname.includes(domain)) {
      return domain;
    }
  }
  return null;
}

// Check if the current URL has the seller filter
function hasSellerFilter() {
  const urlParams = new URLSearchParams(window.location.search);
  const rhParam = urlParams.get('rh');
  const emiParam = urlParams.get('emi');
  const domain = getCurrentDomain();
  if (!domain) return false;
  
  const sellerId = SELLER_IDS[domain];
  return (rhParam && rhParam.includes(`p_6:${sellerId}`)) || emiParam === sellerId;
}

// Add seller filter to the current URL
function addSellerFilter() {
  const domain = getCurrentDomain();
  if (!domain) return;
  
  const sellerId = SELLER_IDS[domain];
  const url = new URL(window.location.href);
  
  // Add to rh parameter
  let rhParam = url.searchParams.get('rh') || '';
  if (!rhParam.includes(`p_6:${sellerId}`)) {
    if (rhParam) {
      rhParam += ',';
    }
    rhParam += `p_6:${sellerId}`;
    url.searchParams.set('rh', rhParam);
  }
  
  // Add emi parameter
  url.searchParams.set('emi', sellerId);
  
  // Redirect to the new URL
  window.location.href = url.toString();
}

// Remove seller filter from the current URL
function removeSellerFilter() {
  const domain = getCurrentDomain();
  if (!domain) return;
  
  const sellerId = SELLER_IDS[domain];
  const url = new URL(window.location.href);
  
  // Remove from rh parameter
  let rhParam = url.searchParams.get('rh') || '';
  rhParam = rhParam.split(',').filter(part => !part.includes(`p_6:${sellerId}`)).join(',');
  if (rhParam) {
    url.searchParams.set('rh', rhParam);
  } else {
    url.searchParams.delete('rh');
  }
  
  // Remove emi parameter
  url.searchParams.delete('emi');
  
  // Redirect to the new URL
  window.location.href = url.toString();
}

// Toggle sponsored items visibility
function toggleSponsoredItems() {
  hideSponsoredEnabled = !hideSponsoredEnabled;
  
  // Save preference
  chrome.storage.local.set({ hideSponsoredEnabled: hideSponsoredEnabled });
  
  // Update checkbox
  const checkbox = document.getElementById('hide-sponsored-checkbox');
  if (checkbox) {
    checkbox.checked = hideSponsoredEnabled;
  }
  
  // Apply the change
  if (hideSponsoredEnabled) {
    applySponsoredHiding();
  } else {
    showSponsoredResults();
  }
}

// Apply sponsored hiding
function applySponsoredHiding() {
  // Hide sponsored products from search results
  const sponsoredItems = document.querySelectorAll('[data-component-type="sp-sponsored-result"]');
  sponsoredItems.forEach(item => {
    const parent = item.closest('[data-asin]') || item.closest('[data-component-type="s-search-result"]');
    if (parent) {
      parent.classList.add('sponsored-hidden');
      parent.style.display = 'none';
    }
  });
  
  // Hide items with "Sponsored" label
  const sponsoredLabels = document.querySelectorAll('span.s-label-popover-default, span.puis-label-popover-default');
  sponsoredLabels.forEach(label => {
    if (label.textContent.includes('Sponsored')) {
      const parent = label.closest('[data-asin]') || label.closest('[data-component-type="s-search-result"]');
      if (parent) {
        parent.classList.add('sponsored-hidden');
        parent.style.display = 'none';
      }
    }
  });
  
  // Hide sponsored carousel sections
  const sponsoredSections = document.querySelectorAll('.s-result-item:has(.s-sponsored-label-text)');
  sponsoredSections.forEach(section => {
    section.classList.add('sponsored-hidden');
    section.style.display = 'none';
  });
}

// Show sponsored results
function showSponsoredResults() {
  const hiddenItems = document.querySelectorAll('.sponsored-hidden');
  hiddenItems.forEach(item => {
    item.classList.remove('sponsored-hidden');
    item.style.display = '';
  });
}

// Remove/manage sponsored results based on preference
function manageSponsoredResults() {
  // Function to check and handle sponsored items
  const handleSponsored = () => {
    if (hideSponsoredEnabled) {
      applySponsoredHiding();
    }
  };
  
  // Initial handling
  handleSponsored();
  
  // Watch for dynamically loaded content
  if (mutationObserver) {
    mutationObserver.disconnect();
  }
  
  mutationObserver = new MutationObserver(handleSponsored);
  mutationObserver.observe(document.body, {
    childList: true,
    subtree: true
  });
}

// Add filter control button to the page
function addFilterControl() {
  // Wait for the results info bar to load
  const observer = new MutationObserver((mutations, obs) => {
    const resultsInfo = document.querySelector('[data-component-type="s-result-info-bar"]') || 
                        document.querySelector('.s-breadcrumb') ||
                        document.querySelector('.sg-col-14-of-20');
    
    if (resultsInfo && !document.getElementById('amazon-filter-control')) {
      const hasFilter = hasSellerFilter();
      
      // Create control container
      const controlDiv = document.createElement('div');
      controlDiv.id = 'amazon-filter-control';
      controlDiv.className = 'amazon-filter-control';
      
      // Left section - Seller filter controls
      const sellerSection = document.createElement('div');
      sellerSection.className = 'control-section';
      
      if (hasFilter) {
        // Add clear filter button
        const clearButton = document.createElement('button');
        clearButton.className = 'filter-button clear-filter';
        clearButton.textContent = 'Clear Amazon Seller Filter';
        clearButton.onclick = removeSellerFilter;
        sellerSection.appendChild(clearButton);
        
        const filterStatus = document.createElement('span');
        filterStatus.className = 'filter-status active';
        filterStatus.textContent = 'Amazon items only';
        sellerSection.appendChild(filterStatus);
      } else {
        // Add apply filter button
        const applyButton = document.createElement('button');
        applyButton.className = 'filter-button apply-filter';
        applyButton.textContent = 'Show Amazon Items Only';
        applyButton.onclick = addSellerFilter;
        sellerSection.appendChild(applyButton);
        
        const filterStatus = document.createElement('span');
        filterStatus.className = 'filter-status inactive';
        filterStatus.textContent = 'Showing all sellers';
        sellerSection.appendChild(filterStatus);
      }
      
      controlDiv.appendChild(sellerSection);
      
      // Separator
      const separator = document.createElement('div');
      separator.className = 'control-separator';
      controlDiv.appendChild(separator);
      
      // Right section - Sponsored toggle
      const sponsoredSection = document.createElement('div');
      sponsoredSection.className = 'control-section sponsored-toggle';
      
      const checkboxContainer = document.createElement('label');
      checkboxContainer.className = 'checkbox-container';
      
      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.id = 'hide-sponsored-checkbox';
      checkbox.checked = hideSponsoredEnabled;
      checkbox.onchange = toggleSponsoredItems;
      
      const checkboxLabel = document.createElement('span');
      checkboxLabel.textContent = 'Hide sponsored items';
      
      checkboxContainer.appendChild(checkbox);
      checkboxContainer.appendChild(checkboxLabel);
      sponsoredSection.appendChild(checkboxContainer);
      
      controlDiv.appendChild(sponsoredSection);
      
      // Insert after results info
      resultsInfo.parentNode.insertBefore(controlDiv, resultsInfo.nextSibling);
      obs.disconnect();
    }
  });
  
  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
}

// Load saved preferences
async function loadPreferences() {
  try {
    const result = await chrome.storage.local.get(['hideSponsoredEnabled']);
    if (result.hideSponsoredEnabled !== undefined) {
      hideSponsoredEnabled = result.hideSponsoredEnabled;
    }
  } catch (error) {
    // Default to true if storage access fails
    hideSponsoredEnabled = true;
  }
}

// Auto-apply filter if not present (optional - comment out if not wanted)
function autoApplyFilter() {
  if (window.location.pathname.includes('/s') && !hasSellerFilter()) {
    // Uncomment the line below to auto-apply the filter
    // addSellerFilter();
  }
}

// Initialize when page loads
async function initialize() {
  await loadPreferences();
  addFilterControl();
  manageSponsoredResults();
  autoApplyFilter();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initialize);
} else {
  initialize();
}