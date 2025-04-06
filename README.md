## Inspiration

We built this app to make code easier to understand, especially for complex projects. By converting code into a directed graph with named nodes, inputs, descriptions, and clear connections, we help users visualize how everything fits together. It’s a powerful way to simplify, explore, and truly grasp the structure of any codebase.

## What it does

There are two main functionalities to the program. Firstly, the user can create their own directive graphs for a program they want to make, which is then converted to code the user can use. This allows programmers worry more about the software design and structure itself rather than the implementation details. You can also select a project from the computer or even using a GitHub link to automatically generate a graph and visualize. Additionally, users can jump to actual code blocks in VSCode from the nodes allowing for better code navigation.

## How we built it

We used NextJS and JavaScript as the main programming language. We also used Tailwind CSS to style the app. The beautiful node editor was implemented entirely through the JavaScript Canvas API and we used clever prompting and graph traversing with the Gemini API to convert from graph to code and vice versa.

## Challenges we ran into

Oh boy.

The entire graph viewer was created using no libraries and only canvas API therefore it was a difficult to implement. The hardest features to implement included the node connections and laying out the nodes in a appealing manner as they used to just overlap and required the user to manually organize. Starting off, the node connections are actually Bezier curves and we applied Calculus to get the arrow pointing in the right direction. 

Initially, we would have to manually move the nodes once they were generated as they were all on top of each other. To solve this issue, we looked into force-directed layout algorithms like the Fruchterman-Reingold Algorithm but found it quite tedious to balance the forces. Instead, we ended up with a basic collision resolution algorithm that prevents overlaps. 

Another challenge was implementing graph to code. To optimize our Gemini API usage, we wanted to convert each node individually, only adding first level dependencies as context. To convert the entire code optimally, we ended up with a reverse BFS algorithm, traversing through the graph, adding each node to a list, and then looping backwards.

## Accomplishments that we're proud of

We're proud of the app itself. Being our first 1-day hackathon, we wanted to create something challenging but also useful. We thought about what we ourselves would use. We're ultimately happy with our project as it captures the essence and vision of our idea despite sometimes goofing up.

## What we learned

We all came in with different strengths and weaknesses so therefore learned different things. For example, Ankit learned about frontend development using NextJS and asynchronous programming in JavaScript. Sri learned about HTTP requests and using a GitHub API to pull code with code. Adrian learned about Bezier curves and applying LLM's to real-world problems. Kishore learned more about CSS and the Canvas API.

As a team, we learned how to efficiently plan and delegate tasks while also adapting in real-time to project needs. And of course, we all got better at resolving pesky merge conflicts!
