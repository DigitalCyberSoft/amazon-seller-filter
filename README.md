# Amazon Seller Filter Chrome Extension

A Chrome browser extension that filters Amazon search results to show only items sold by Amazon and optionally hides sponsored products.

## Features

- **Amazon-Only Filter**: Automatically adds Amazon's seller filter to search results
- **Multi-Region Support**: Works on Amazon US, CA, UK, MX, BR, FR, DE, IT, and ES
- **Sponsored Content Toggle**: Hide or show sponsored search results with a checkbox
- **Persistent Preferences**: Remembers your sponsored content visibility choice
- **Clean Interface**: Adds intuitive controls directly to Amazon's search results page

## Installation

### From Source (Developer Mode)

1. Clone this repository or download the ZIP file
   ```bash
   git clone https://github.com/yourusername/amazon-seller-filter.git
   ```

2. Open Chrome and navigate to `chrome://extensions/`

3. Enable "Developer mode" using the toggle in the top right corner

4. Click "Load unpacked" and select the extension directory

5. The extension is now installed and active!

## Usage

### Seller Filter
- Click **"Show Amazon Items Only"** to filter results to items sold by Amazon
- Click **"Clear Amazon Seller Filter"** to see all sellers again
- The filter persists as you navigate through search results

### Sponsored Content Toggle
- Check **"Hide sponsored items"** to remove sponsored products from view
- Uncheck to show sponsored items again
- Your preference is saved automatically

## How It Works

The extension modifies Amazon search URLs by adding specific parameters:
- Adds `&emi=SELLER_ID` parameter to filter by Amazon as the seller
- Adds seller ID to the `rh` (refinement) parameter
- Uses different seller IDs for each Amazon regional site

### Supported Amazon Domains

| Region | Domain | Seller ID |
|--------|--------|-----------|
| United States | amazon.com | ATVPDKIKX0DER |
| Canada | amazon.ca | A3DWYIK6Y9EEQB |
| United Kingdom | amazon.co.uk | A3P5ROKL5A1OLE |
| Mexico | amazon.com.mx | AVDBXBAVVSXLQ |
| Brazil | amazon.com.br | A1ZZFT5FULY4LN |
| France | amazon.fr | A1X6FK5RDHNB96 |
| Germany | amazon.de | A3JWKAKR8XB7XF |
| Italy | amazon.it | A11IL2PNWYJU7H |
| Spain | amazon.es | A1AT7YVPFBWXBL |

## Files Structure

```
amazon-seller-filter/
├── manifest.json       # Extension configuration
├── content.js         # Main logic for filtering and UI
├── style.css          # Styling for the control interface
├── icon16.png         # Extension icon (16x16)
├── icon48.png         # Extension icon (48x48)
├── icon128.png        # Extension icon (128x128)
└── README.md          # This file
```

## Permissions

The extension requires minimal permissions:
- **activeTab**: To interact with the current Amazon tab
- **storage**: To save your sponsored content visibility preference
- **Host permissions**: Access to Amazon domains for content script injection

## Privacy

This extension:
- Does not collect any personal data
- Does not track your browsing activity
- Does not send data to external servers
- Only stores your sponsored content preference locally

## Development

### Building Icons
If you need to regenerate the icons, use the included Python script:
```bash
python3 create_icons.py
```

### Modifying the Extension
1. Make your changes to the source files
2. Go to `chrome://extensions/`
3. Click the refresh button on the extension card
4. Test your changes on Amazon

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is open source and available under the [MIT License](LICENSE).

## Disclaimer

**This extension is NOT affiliated with, endorsed by, or sponsored by Amazon.com, Inc. or any of its subsidiaries.** Amazon is a registered trademark of Amazon.com, Inc. This is an independent tool created to enhance the user experience when browsing Amazon's website. Use at your own discretion.

## Support

If you encounter any issues or have suggestions, please [open an issue](https://github.com/yourusername/amazon-seller-filter/issues) on GitHub.