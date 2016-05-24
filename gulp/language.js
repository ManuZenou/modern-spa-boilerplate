import jsdom from "jsdom"
import fileSystem from "fs"
import { serializeDocument } from "jsdom"
import esprima from "esprima"
import escodegen from "escodegen"
import estraverse from "estraverse"

function parseHtml(htmlContent)
{
  return new Promise((resolve, reject) =>
  {
    jsdom.env({
      html: htmlContent,
      done: (err, window) =>
      {
        if (err)
          return reject(err)

        return resolve({
          window,
          document: window.document
        })
      }
    })
  })
}

function parseLanguages(dom)
{
  const {
    window, document
  } = dom

  const locales = document.querySelectorAll('[data-type="locale"]')
  const localesMap = {}
  for (let i = 0; i < locales.length; i++)
  {
    localesMap[locales[i].getAttribute("data-lang")] = locales[i].getAttribute("src")
    locales[i].remove()
  }

  return {
    window,
    document,
    localesMap
  }
}

function matchPattern(script, regexPattern)
{
  return script.split("\n").filter((item) => regexPattern.test(item)).length > 0
}

function findLanguagePattern(document, pattern)
{
  const selectors = document.querySelectorAll("script")
  for (let i = 0; i < selectors.length; i++)
  {
    const selector = selectors[i]
    if (matchPattern(selector.text, pattern))
      return selector
  }

  return null
}

function astArgumentToString(node, defaultValue = "")
{
  if (node.type === "Literal")
    return node.value

  if (node.type === "BinaryExpression")
    return astArgumentToString(node.left, "_") + astArgumentToString(node.right, "_")

  return defaultValue
}

function astArgumentsToString(nodes)
{
  return Array.prototype.slice.call(nodes).map((node) => astArgumentToString(node)).join("")
}

function getMapAst(map)
{
  const mapStr = `a=${JSON.stringify(map)}`
  const htmlMapAst = esprima.parse(mapStr)

  return htmlMapAst.body[0].expression.right
}

function patchAst(ast, localesMap, languagePattern, languageSelector)
{
  const parsedLanguageSelector = esprima.parse(`map[${languageSelector}]`).body[0].expression.property

  const languageArgument = {
    type: "MemberExpression",
    computed: true,
    object: getMapAst(localesMap),
    property: parsedLanguageSelector
  }

  estraverse.traverse(ast, {
    enter: (node) =>
    {
      if (node.type === "CallExpression" &&
        node.callee.type === "MemberExpression" &&
        node.callee.object.name === "System" &&
        node.callee.property.name === "import")
      {
        const argString = astArgumentsToString(node.arguments)
        if (languagePattern.test(argString))
          node.arguments = [ languageArgument ]
      }
    }
  })

  return ast
}

function patchLanguageMap(scriptTag, localesMap, languagePattern, languageSelector)
{
  const ast = patchAst(esprima.parse(scriptTag.text), localesMap, languagePattern, languageSelector)

  scriptTag.text = escodegen.generate(ast)
}

function injectLanguageMapFactory(languagePattern, languageSelector)
{
  return (dom) =>
  {
    const {
      document, localesMap
    } = dom

    const languagePatternRegExp = new RegExp(languagePattern)

    const languagePatternScript = findLanguagePattern(document, languagePatternRegExp)
    patchLanguageMap(languagePatternScript, localesMap, languagePatternRegExp, languageSelector)

    return dom
  }
}

function writeHtml(dom)
{
  const {
    window, document
  } = dom
  fileSystem.writeFileSync("dist/index.html", serializeDocument(document))
  window.close()
}

function patchLanguage(indexFile, languagePattern, languageSelector)
{
  const indexHtmlContent = fileSystem.readFileSync("dist/index.html")

  return parseHtml(indexHtmlContent).
  then(parseLanguages).
  then(injectLanguageMapFactory(languagePattern, languageSelector)).
  then(writeHtml)
}

export default patchLanguage
