// This sets up Handlebars to escape strings for Slack, rather than for HTML.
// See https://api.slack.com/reference/surfaces/formatting#escaping
import Handlebars from 'handlebars'

const escape: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
};
function escapeChar(chr: string) {
  return escape[chr];
}

const possible = /[&<>]/
const badChars = /[&<>]/g
export function escapeExpression(string: string | Handlebars.SafeString) {
  if (typeof string !== 'string') {
    // don't escape SafeStrings, since they're already safe
    if (string && string.toHTML) {
      return string.toHTML();
    } else if (string == null) {
      return '';
    } else if (!string) {
      return string + '';
    }

    // Force a string conversion as this will be done by the append regardless and
    // the regex test will do this transparently behind the scenes, causing issues if
    // an object's to string has escaped characters in it.
    string = '' + string;
  }

  if (!possible.test(string)) {
    return string;
  }
  return string.replace(badChars, escapeChar);
}

Handlebars.Utils.escapeExpression = escapeExpression
