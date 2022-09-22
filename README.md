

<h3 align="center">WiSo-OCR-App</h3>

<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
      <li><a href="#usage">Usage</a></li>
      <li><a href="#our-journey">Our journey</a></li>
      <li><a href="#license">License</a></li>
      <li><a href="#contact">Contact</a></li>
    </li>
  </ol>
</details>



<!-- ABOUT THE PROJECT -->
## About The Project

This webapp was developed to help students find their way around at the WiSo faculty of the Friedrich-Alexander-University Erlangen-Nürnberg. 
It's purpose is to retrieve relevant UniVIS data so that students can get an idea of what is being worked on in which area of the faculty.








### Built With

This section lists all major frameworks/libraries used to bootstrap the project.

* <ins>HTML, CSS, Javascript</ins>
* <ins>Node.js:</ins> Open-source, cross-platform, JavaScript runtime environment that is primarily used for non-blocking, event-driven servers, due to its single-threaded nature. It's used for traditional web sites and back-end API services, but was designed with real-time, push-based architectures in mind. We use node.js to handle serverside rendered tasks and serve the result to the frontend. 
* <ins>Express.js:</ins> Node.js web application framework that provides broad features for building web and mobile applications. It is used to build a single page, multipage, and hybrid web application. It's a layer built on the top of the Node js that helps manage servers and routes.
* <ins>cors:</ins>Node.js package for providing a Connect/Express middleware that can be used to enable CORS (Cross-origin resource sharing) with various options.
* <ins>Tesseract.js:</ins> Tesseract.js is a pure Javascript port of the popular Tesseract OCR engine. It supports automatic text orientation and script detection, a simple interface for reading paragraph, word, and character bouncing boxes. This library is used to recognize the names of the WiSo staff by pointing a camera to the name tag that is hanging in front of every office.  
* <ins>Puppeteer.js:</ins> Headless browser that provides a high-level API to control Chrome or Chromium over the DevTools Protocol. Puppeteer is used on the server side to crawl the UniVis website and return all relevant information to a specific person working at the university.
* <ins>node-cron:</ins> Task scheduler for node.js. We use it to automatically crawl univis once a day to make sure the list with people working at the university is up-to-date in any given point in time. 






<!-- GETTING STARTED -->
## Getting Started


### Prerequisites

Make sure you have Node.js and the Node Package Manager (npm) installed. 
* check if node is installed
```sh
  node --version
  ```
if node is not installed you can download it at https://nodejs.org/en/


* to install the newest version of npm, simply run the following command
  ```sh
  npm install npm@latest -g
  ```

### Installation

1. Clone the repo
   ```sh
   git clone https://github.com/wintechis/WiSo-OCR-App
   ```
2. Install NPM packages
   ```sh
   npm install
   ```
3. Start the webapp
    ```sh
   npm run start
   ```
After starting the project you can find the webapp at http://localhost:8383/




<!-- USAGE EXAMPLES -->
## Usage

Link Youtube Video here when filmed

Demo <a href="https://fau-ocr-app.herokuapp.com/">here</a> 



<!--Learnings-->
## Our journey

This is the first time we have dealt with websites that should provide a more complex logic.<br>
While we had to do a lot of research to get to our goal, we often encountered problems during development that unfortunately could not often be fixed by a quick Google search.<br> 
But this also forced us to understand what exactly our code was doing in order to find solutions to the challenges that arose and thus we were able to learn a lot about web development.<br>
At university we had already worked with http requests in one or the other module, but here we could deepen our knowledge very well and practice it on a practical example.<br> 
Example problems that arose while developement were: 
* Communication: Sending JSON files without any issues from backend to frontend and process the contained information properly in order to display the content on the frontend
* Performance: How can we speedup the univis crawling process when information about a specific person is requested? 
* Text recognition: Tesseract.js, the library we used for OCR, seemed to didn't do the job as expected at the beginning. This was mainly because the signs at wiso often contain unnecessary information or shadows that were thrown by the light were misinterpreted as characters from the library.

To summarize what could be learned while working on this project:
* Setup a backend with node.js 
* Let backend and frontend communicate with each other
* Handle the asynchronous nature of the web
* Send and receive HTTP - Requests
* Build a deployment pipeline on Heroku to serve the project on the web

<!-- LICENSE -->
## License

Distributed under the MIT License. See `LICENSE.txt` for more information.





<!-- CONTACT -->
## Contact

Alexander Kröker - https://www.linkedin.com/in/alexander-kr%C3%B6ker-33a332206/ <br>
Tobias Fleming - https://www.linkedin.com/in/tobias-fleming/



Project Link: https://github.com/wintechis/WiSo-OCR-App

