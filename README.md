# Notijob

Notifies if there's a new opening on that company you want to keep your eye on

### Installation

You should have node installed, head over to node's [website](https://nodejs.org/en/) if you don't have it

Run the following:
`$ npm install`

And you're good to go.

As of this first commit, it doesn't keep looking for them openings

### Configuration

Edit the `input.json` file. I hope company, domain and path attributes are self-explanatory.
selectors should be a list with a css-selector for anchor tags that will provide the url for the opening information and (optionally) a second css-selector for any child that will give a more friendly name for the opening.

### Output

Will produce a sort of markup style'd html and trigger a system notification to claim your attention when any opening change.
