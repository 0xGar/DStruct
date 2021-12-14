# DStruct
(BETA, early draft and buggy; not suitable). 

Vanilla JavaScript single-page application library based on web components, with basic state and external data handling. 

The motivation behind this project larglely came from React / Redux's handing of data as it didn't fit my needs at the time, and to offer a faster, JavaScript-pure solution alternative to React rendering. As an example, instead of a global store or the such, this library "glues" and "unglues" data (intended to be from an API) to web components, somewhat like a feed. When the data is updated, all relevant "glued" web components will be notified and updated (somewhat like React states).

*** This project may or may not be updated in the future. It was drafted as an idea, but at the end of the day many great solutions already exist. React is most definitely worthwhile, and when used in combination with something like Next.js, it's fantastic. ***
