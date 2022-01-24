import * as path from "path"
import * as fs from "fs"
import later from "@breejs/later"
import { ProbotOctokit } from "probot"
import { Endpoints } from "@octokit/types"
import yaml from "js-yaml"
import { slack } from "./slack-client"
import Handlebars from "handlebars"
import "./handlebars-slack-escape"

const configPath = path.join(path.dirname(__dirname), 'config.yml')

type Check = {
  schedule: string
  channel: string
  search: Endpoints["GET /search/issues"]['parameters']
  message: string
}
type Config = {
  checks: Check[]
}

const config = yaml.load(fs.readFileSync(configPath, 'utf8')) as Config

const octokit = new ProbotOctokit

async function runCheck(check: Check) {
  const items = await octokit.paginate(octokit.search.issuesAndPullRequests, check.search)
  if (items.length) {
    const textTemplate = Handlebars.compile(check.message)
    await slack.chat.postMessage({
      channel: check.channel,
      text: textTemplate({ items }),
      unfurl_links: false,
      unfurl_media: false,
    })
  }
}

config.checks.forEach(check => {
  console.log(`Bot will run ${check.schedule}`)
  later.setInterval(
    () => {
      runCheck(check).catch(e => {
        console.error('Error while running check:', e)
      })
    },
    later.parse.text(check.schedule)
  )
})
