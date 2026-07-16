export const CURRICULUM = [
  {
    id: 1,
    title: "Lesson 1: The Building Blocks",
    description: "HTML (HyperText Markup Language) is the skeleton of the web. It uses 'tags' to structure content. Let's create a heading and a button.",
    tasks: [
      {
        id: "task1",
        text: "Create an <h1> tag with some text.",
        check: (files) => /<h1.*>.*<\/h1>/i.test(files.html)
      },
      {
        id: "task2",
        text: "Create a <button> with the id 'btn'.",
        check: (files) => /<button[^>]*id=["']btn["'][^>]*>.*<\/button>/i.test(files.html)
      }
    ]
  },
  {
    id: 2,
    title: "Lesson 2: Painting the Canvas",
    description: "CSS (Cascading Style Sheets) makes the web beautiful. Let's grab that button you made and give it some style.",
    tasks: [
      {
        id: "task1",
        text: "Target your button in CSS using '#btn'.",
        check: (files) => /#btn\s*{/i.test(files.css)
      },
      {
        id: "task2",
        text: "Give the button a 'background' color.",
        check: (files) => /#btn\s*{[^}]*background\s*:/i.test(files.css)
      },
      {
        id: "task3",
        text: "Change the text 'color' to white.",
        check: (files) => /#btn\s*{[^}]*color\s*:\s*(white|#fff|#ffffff)/i.test(files.css)
      }
    ]
  },
  {
    id: 3,
    title: "Lesson 3: Making it Alive",
    description: "JavaScript (JS) is the brain of the web. It lets you add logic and interactivity. Let's make your button actually do something when clicked.",
    tasks: [
      {
        id: "task1",
        text: "Select the button using document.getElementById('btn')",
        check: (files) => /document\.getElementById\(['"]btn['"]\)/i.test(files.js)
      },
      {
        id: "task2",
        text: "Add an 'addEventListener' for a 'click' event.",
        check: (files) => /\.addEventListener\(['"]click['"]/i.test(files.js)
      },
      {
        id: "task3",
        text: "Trigger an alert() inside the click function.",
        check: (files) => /alert\(/i.test(files.js)
      }
    ]
  },
  {
    id: 4,
    title: "Lesson 4: Graduation",
    description: "You've mastered the holy trinity of web development! You can now freely build in this sandbox, or try loading some Templates from the header.",
    tasks: [] // Free play mode
  }
];
