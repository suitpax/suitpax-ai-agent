# Suitpax AI Agent

## Overview

Suitpax AI Agent is an innovative artificial intelligence-powered assistant tailored for business travel management. This solution empowers employees and organizations to streamline their travel planning processes by leveraging AI capabilities to provide real-time recommendations for flights, hotels, and other travel-related services. By interpreting user queries and utilizing advanced AI-driven logic, Suitpax AI Agent ensures that travel arrangements are efficient, cost-effective, and personalized.

The Suitpax AI Agent is designed to act as a virtual travel assistant, capable of analyzing user preferences, executing function calls to gather relevant travel data, and presenting organized, actionable options. It seamlessly integrates with external systems and APIs to enhance user experience and deliver high-quality results.

---

## Key Features

### AI-Powered Travel Assistance
- **Dynamic Query Interpretation**: Understands and analyzes complex travel queries to extract actionable details, such as destination, travel dates, number of travelers, and preferences.
- **Automated Recommendations**: Provides curated options for flights and hotels based on user-provided information and real-time data.

### Function-Oriented Data Processing
- **API Integration**: Communicates with external travel APIs to fetch accurate flight and hotel information.
- **Function Call Execution**: Utilizes predefined functions to process user requests, refine search parameters, and gather relevant data.

### Organized Results Presentation
- **Clear Output Format**: Presents top travel options in an easy-to-read format, including details like airline, departure and arrival times, pricing, hotel ratings, and location.
- **Summary and Recommendations**: Offers summaries and additional advice to help users make informed decisions.

### Error Handling and Refinement
- **Robust Logic**: Identifies and addresses insufficient query details, suggests refinements, and ensures reliable output.
- **User Guidance**: Provides feedback when results cannot be found or when additional information is needed.

---

## How It Works

1. **Travel Query Analysis**:
   - The AI Agent processes user queries to extract essential travel details.
   - It identifies required parameters, such as destination, dates, and traveler preferences, and determines the functions to be executed.

2. **Function Calls**:
   - Executes function calls to external APIs or internal systems to gather information about flights and hotels.
   - Adjusts parameters dynamically based on feedback or errors from the function results.

3. **Result Compilation**:
   - Compiles the gathered data into a structured format.
   - Presents top travel options in categories (flights and hotels) along with additional recommendations.

4. **User Interaction**:
   - Provides a summary of the results and allows users to refine their queries for better outcomes.
   - Offers guidance on next steps if insufficient information is provided.

---

## Functional Workflow

### Query Analysis
- Extracts information such as:
  - **Destination**: Where the user intends to travel.
  - **Travel Dates**: Departure and return dates.
  - **Traveler Preferences**: Budget, preferred airlines, hotel ratings, and other custom requirements.

### Data Retrieval
- Executes function calls with extracted parameters to search for:
  - **Flights**: Includes airline name, departure and arrival times, pricing, and layover details.
  - **Hotels**: Includes name, location, price per night, star rating, and amenities.

### Result Processing
- Assesses and compiles the data received from function calls.
- Filters and ranks options based on relevance and user preferences.

### Output Presentation
- Organizes results into clear sections:
  - **Flights**: Lists top options with detailed information.
  - **Hotels**: Highlights best accommodations available.
  - **Summary**: Provides an overview of the options and any recommendations.

---

## Example Query Flow

### Input
A user submits the following query:  
*"Find a flight from New York to London on June 15th, returning June 20th. I need a hotel close to the city center with a budget of $200 per night."*

### AI Agent Workflow
1. **Analyze Query**:
   - Extracts details: destination (New York to London), dates (June 15th to June 20th), and hotel budget ($200 per night).
   - Identifies required functions: flight search and hotel search.

2. **Execute Function Calls**:
   - Calls APIs to retrieve flight options and hotel details matching the criteria.

3. **Process Results**:
   - Filters and ranks flights by price, duration, and layovers.
   - Sorts hotels by proximity to the city center, price, and ratings.

4. **Present Results**:
   \`\`\`plaintext
   <response>
   <flights>
   - Airline: British Airways, Departure: 10:00 AM, Price: $450, Non-stop
   - Airline: American Airlines, Departure: 2:00 PM, Price: $420, 1 Layover
   </flights>

   <hotels>
   - Name: City Center Hotel, Price: $190/night, Rating: 4.5 stars
   - Name: Downtown Inn, Price: $200/night, Rating: 4 stars
   </hotels>

   <summary>
   Two flight options and two hotel options have been found matching your criteria. Both hotels are close to the city center and within your budget.
   </summary>
   </response>
   \`\`\`

---

## Installation and Setup

1. Clone the repository:
   \`\`\`bash
   git clone https://github.com/suitpax/suitpax-ai-agent.git
   \`\`\`

2. Install dependencies:
   \`\`\`bash
   npm install
   \`\`\`

3. Set up environment variables:
   - Create a `.env` file in the root directory.
   - Add your Anthropic API key:
     \`\`\`env
     ANTHROPIC_API_KEY=your_api_key_here
     \`\`\`

4. Start the application:
   \`\`\`bash
   npm start
   \`\`\`

---

## Contribution Guidelines

We welcome contributions to enhance the functionality of Suitpax AI Agent. To contribute:

1. Fork the repository.
2. Create a new branch for your feature or fix.
3. Submit a pull request with detailed explanations of your changes.

---

## License

This project is licensed under the [MIT License](https://opensource.org/licenses/MIT). See the LICENSE file for more details.

---

If any additional sections are needed, let me know!
