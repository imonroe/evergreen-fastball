# Project: Evergreen Fastball
I find myself working on several different projects at the same time and often get a bunch of requests. From different people for different projects, and it's hard to keep track of who told me what when. 

I also use Obsidian for keeping track of notes. It can be cumbersome to switch back and forth between the notes each time, so I often end up making notes in my daily notes and then they never get filed into the right places.

 So the idea for this project is a local Docker container that runs on "A local web page and provides a list of the current projects I'm working.  A small form that will let me add a quick note. Each project also has a button to the List all of the notes for the project, in cronological order with the newest note first.

 There should also be a journal functionality that lists all of the notes from all of the projects in chronological order, starting with the newest.
 
  It should be able to keep track of an arbitrary number of projects, and each project should have its own Obsidian page. 
  
  When a new note is added, it should be appended along with a date and timestamp to the corresponding Obsidian page. Essentially, we are using Obsidian as the back-end for this local web page. When it's time to display a list view or a journal view, it uses Obsidian notes as the source of truth.

  