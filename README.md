# Notijob

Notifies if there's a new opening on that company you want to keep your eyes on.

### Installation

You should have node installed, head over to node's [website](https://nodejs.org/en/) if you don't have it.

Run the following:
`$ npm install`

And you're good to go. `$ node app` to run it!

As of this latest commit, it still doesn't keep looking for them openings, in the future, it will look for openings every x amount of time

### Configuration

Edit the `input.json` file. I hope company, domain and path attributes are self-explanatory.
selectors should be an object with a 'container', 'title' and 'link' css-selectors for the elements that will provide the information for the opening.

### Output

Will produce a markup styled html and trigger a system notification to claim your attention ~when any opening change~ if current openings are different from the last ones that showed up on last execution.
