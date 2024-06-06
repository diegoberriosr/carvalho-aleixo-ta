# Amazon Product Listings Scraper

## Objective
This project aims to create a simple script to scrape Amazon product listings from the first page of search results for a given keyword.

## Features
- **Backend/API (Node.js)**:
  - Fetches the contents of the Amazon search results page for a given keyword.
  - Parses the HTML content using JSDOM.
  - Extracts details such as Product Title, Rating, Number of reviews, and Product image URL.
  - Provides an endpoint `/api/scrape` that initiates the scraping process and returns the extracted data in JSON format.
  - Provides an endpoint `/` that sends the UI's HTML file.

- **Frontend (HTML, CSS, Vanilla JavaScript)**:
  - Simple and user-friendly webpage.
  - Input field to enter the search keyword.
  - Button to initiate the scraping process.
  - Displays the results formatted cleanly on the page.

## Technologies Used
- **Backend**:
  - Node.js
  - Express
  - Axios
  - JSDOM

- **Frontend**:
  - HTML
  - CSS
  - Vanilla JavaScript

## Setup Instructions

### Prerequisites
- Node.js and npm installed on your machine.

### Backend Setup
1. Clone the repository:
    ```sh
    git clone https://github.com/diegoberriosr/carvalho-aleixo-ta.git
    cd carvalho-aleixo-ta
    ```

2. Install dependencies:
    ```sh
    npm install
    ```

3. Start the server:
    ```sh
    node server.js
    ```

### Frontend Setup
1. Open `index.html` in your web browser or visit http://localhost:3000/ if the server is already running.

## Usage
1. Enter a search keyword in the input field.
2. Click the "Fetch Data" button to the right of the input field.
3. The page will display the product listings from the first page of Amazon search results for the given keyword.

## API Endpoints

- **GET** `/`
  - Returns index.html file.

- **GET** `/api/scrape?keyword=yourKeyword`
  - Initiates the scraping process for the given keyword.
  - Returns the extracted data in JSON format.
  - **Parameters**:
    - `keyword` (string): The search keyword.

## Example Response
```json
[
    {
        "title": "Product Title 1",
        "url": "http://example.com/url1",
        "image": {
            "url": "http://example.com/image1.jpg",
            "alt": "alt number 1"
        },
        "avgRating" : 4.5,
        "ratings" : 1000,
        "price" : {
            "integer": 3,
            "decimal": 0.99
        }
    }
]
