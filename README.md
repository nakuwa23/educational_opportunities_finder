# Educational Opportunities Finder

A web application developed to help students and professionals discover scholarships, grants, fellowships, and conferences. This tool aggregates opportunities from across the web using the Google Custom Search API, providing a centralized platform for educational funding search.

<img src="./assets/screenshot.png" alt="App Screenshot">

## Features
*   **Search**: Find opportunities by keyword (e.g., "Cybersecurity", "Women in STEM").
*   **Filter**: Categorize results by Scholarships, Grants, Fellowships, or Conferences.
*   **Location Support**: Optional filtering by country or region.
*   **Direct Access**: Links directly to the opportunity pages.
*   **Favorites System**: Users can save opportunities they are interested in, and view them later on the browser's localStorage.

## Prerequisites
To run this application locally, you need:
*   A modern web browser (Chrome, Firefox, Edge).
*   A text editor (VS Code, Sublime Text, Notepad++, and more).
*   **Google Custom Search API Key** and **Search Engine ID**.

## Local Setup Instructions
1.  **Clone the Repository**
    ```bash
    git clone <your-repo-url>
    cd educational_opportunities_finder
    ```

2.  **Configure API Keys**
    *   The `config.js` file is excluded from the repository for security.
    *   Create a file named `config.js` in the root directory.
    *   Add your keys in the following format:
        ```javascript
        const CONFIG = {
            API_KEY: 'YOUR_API_KEY',
            CX: 'YOUR_SEARCH_ENGINE_ID'
        };
        ```

3.  **Run the Application**
    *   Simply open `index.html` in your web browser.
    *   Alternatively, you can use a simple HTTP server (e.g., `python -m http.server` or VS Code Live Server) to serve the files.

## API Usage
This application uses the **Google Custom Search JSON API**.
*   **Documentation**: [Google Custom Search JSON API](https://developers.google.com/custom-search/v1/introduction)
*   **Attribution**: Search results are powered by Google.

## Deployment
This project includes scripts to automate the setup of your Web Servers and Load Balancer.

### 1. Web Server Deployment (Web01 & Web02)
Repeat these steps for **both** Web01 and Web02:

1.  **Transfer Files**: Copy the `deployment/setup_web.sh` script and your project files to the server.
    ```bash
    # Example using SCP (run from your local machine)
    scp -r . user@<WEB_SERVER_IP>:~/app
    ```
2.  **Run Setup Script**:
    ```bash
    cd ~/app/deployment
    chmod +x setup_web.sh
    sudo ./setup_web.sh
    ```
3.  **Deploy Code**:
    ```bash
    # Move files to the web root
    sudo cp -r ~/app/* /var/www/html/
    # IMPORTANT: Ensure config.js is present in /var/www/html/scripts/
    ```

### 2. Load Balancer Configuration (Lb01)
1.  **Transfer Script**: Copy `deployment/setup_lb.sh` to Lb01.
2.  **Run Setup Script**:
    ```bash
    chmod +x setup_lb.sh
    sudo ./setup_lb.sh <WEB01_IP> <WEB02_IP>
    # Example: sudo ./setup_lb.sh 194.162.1.18 194.162.1.19
    ```

### 3. Verification
*   Visit the Load Balancer's IP address in your browser.
*   The application should load.
*   Refreshing the page should distribute traffic between Web01 and Web02 (you can verify this by checking access logs on the web servers).

## Bonus: Performance Optimization
This application implements **Client-Side Caching** to improve performance and reduce API usage.
*   **Mechanism**: Search results are stored in the browser's `localStorage`.
*   **Benefit**: Repeating a search loads results instantly without a network request.

## Contact Information
*   **Name**: Brian Nakuwa
*   **Email**: [b.nakuwa@alustudent.com](b.nakuwa@alustudent.com)
*   **GitHub**: [github.com/nakuwa23](https://github.com/nakuwa23)
*   **Institution**: African Leadership University

## License
This project is for educational purposes as part of the Web Infrastructure module.


