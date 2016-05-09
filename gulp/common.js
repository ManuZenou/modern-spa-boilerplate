/* eslint no-console: 0 */

/*
========================================================================
   Common API / Constants
========================================================================
*/

import path from "path"
import process from "process"
import notify from "node-notifier"
import loadPlugins from "load-plugins"
import browserSync from "browser-sync"

export const devServer = browserSync.create()

export const $ = loadPlugins("gulp-*")

export const AppShortTitle = "MSB"

export const sourceMapOptions = {
  includeContent: false,
  destPath: "src"
}

export const CWD = process.cwd()

export function logError(err)
{
  console.error(err.message)

  notify.notify({
    title: `${AppShortTitle}: Error`,
    message: err.message
  });

  // Display error in the browser
  browserSync.notify(err.message, 3000)

  // Prevent gulp from catching the error and exiting the watch process
  this.emit("end")
}

export function getPath(event)
{
  return path.relative(CWD, event.path)
}

export function logChange(event)
{
  var cleanPath = getPath(event);

  $.util.log(
    $.util.colors.green("Changed: ") +
    $.util.colors.magenta(cleanPath)
  )

  notify.notify(
  {
    title: `${AppShortTitle}: File was changed`,
    message: cleanPath
  })
}
