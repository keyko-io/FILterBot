import * as path from "path"
import * as fs from "fs"
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

// async function runCheck() {
async function runCheck(check: Check, thread_ts: any) {
  const items = await octokit.paginate(octokit.search.issuesAndPullRequests, check.search)



  if (items.length) {
    const textTemplate = Handlebars.compile(check.message)
    console.log(textTemplate({ items }))
    await slack.chat.postMessage({
      channel: '#fil-plus-notaries',
      // channel: check.channel,
      text: textTemplate({ items }),
      thread_ts,
      unfurl_links: false,
      unfurl_media: false,
    })
  }


}



const run = async () => {
  try {
    const threadMessage = await slack.chat.postMessage({
      channel: "#fil-plus-notaries",
      text: 'Heads up! Those in thread are issues that need diligence/signatures',
      unfurl_links: false,
      unfurl_media: false,
    })
    const thread_ts = threadMessage.ts
    if (threadMessage.ok) {
      config.checks.forEach(check => {
        runCheck(check, thread_ts).catch(e => {
          console.error('Error while running check:', e)
        })
      })
    }
  } catch (error) {
    console.log(error)
  }

  
}

run()
