# FILterBot

FILterBot is a Slack bot that periodically checks GitHub repos, tallies issues,
and posts messages in Slack channels. FILterBot is used across multiple
workstreams, and it is configurable for different teams.

## Configuration

FILterBot is highly configurable. The configuration is stored as a YAML file in
this repository.

[:memo: Edit Config](edit/main/config.yml)

### `checks`

Each check is a repeating schedule which performs the following each time the
check is triggered:

1. Search GitHub issues and pull requests for a given query.
2. Compose a message with the resulting data.
3. Post the message to a given Slack channel.

Each check has the following configuration properties.

#### `checks[*].schedule`

> **Example:** `on Wednesday at 9:00`

The interval at which this check will be performed. The syntax used is the
[Later text format](https://breejs.github.io/later/parsers.html#text).

Here are some examples of schedule definitions supported by Later:

- `on the 15th day of the month at 13:15`
- `every weekday at 9:00`
- `on the last day of the month at 16:30`

Times are specified in UTC.

#### `checks[*].search`

The parameters that will be passed to the [GitHub Search
API](https://docs.github.com/en/rest/reference/search). The full set of
parameters is supported. Refer to the GitHub API documentation for the complete
documentation for each of these parameters.

The search will be limited to 1,000 results, which is a limitation of the
GitHub API.

##### `checks[*].search.q`

> **Example:** `"repo:filecoin-project/filecoin-plus-large-datasets is:issue is:open label:status:needsDiligence"`

See the [GitHub Search documentation][] for available search operators.

[GitHub Search documentation]: https://docs.github.com/en/github/searching-for-information-on-github/searching-on-github/searching-issues-and-pull-requests

##### `checks[*].search.sort` _(optional)_

> **Example:** `created`

Can be `comments`, `reactions`, `reactions-+1`, `reactions-smile`,
`reactions-thinking_face`, `reactions-heart`, `reactions-tada`, `interactions`,
`created`, or `updated`.

See [Searching Issues and Pull
Requests](https://docs.github.com/en/rest/reference/search#search-issues-and-pull-requests)
for complete documentation.

##### `checks[*].search.order` _(optional)_

> **Example:** `asc`

Can be `asc` or `desc`.

See [Searching Issues and Pull
Requests](https://docs.github.com/en/rest/reference/search#search-issues-and-pull-requests)
for complete documentation.

#### `checks[*].message`

> **Example:** `There are {{items.length}} open issues.`

A [Handlebars](https://handlebarsjs.com/guide/) template which controls the
text of the message that will be posted to Slack when this check is triggered.

The `items` variable is available in the context for the template. `items` is a list of search results from the GitHub API, in the form returned by GitHub. See [Searching Issues and Pull
Requests](https://docs.github.com/en/rest/reference/search#search-issues-and-pull-requests) for the complete form of each item.

It is recommended to use the multiline string syntax in YAML for composing message templates, for example:

```yaml
message: |
  There are {{items.length}} open issues:

  {{#each items}}• <{{this.html_url}}|{{this.title}} (#{{this.number}})>
  {{/each}}
```

#### `checks[*].channel`

> **Example:** `"#fil-plus-notaries"`

The channel to which the message will be posted. FILterBot must be invited to the channel (`/invite @FILterBot`) before it will be able to post messages to a channel.
