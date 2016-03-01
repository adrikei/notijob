# Notijob

Notifies if there's a new opening on that company you want to keep your eyes on.

### Installation

You should have node installed, head over to node's [website](https://nodejs.org/en/) if you don't have it.

Run the following:
`$ npm install`

And you're good to go. `$ node app <time>` to run it!
time is the amount of time in which you want the script to look for openings, in minutes
`$ node app 60` will make it check for openings every 60 minutes.

### Configuration

Edit the `input.json` file. I hope company, domain and path attributes are self-explanatory.
selectors should be an object with a 'container', 'title' and 'link' css-selectors for the elements that will provide the information for the opening. 'title' and 'link' selectors should be children of 'container' selector.

### Output

Will produce a markup styled html and trigger a system notification to claim your attention ~~when any opening change~~ if current openings are different from the last ones that showed up on last execution.
