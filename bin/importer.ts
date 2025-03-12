import { APP_ROOT } from './constants.js'

/**
 * The importer is used to import files in context of the
 * application.
 */
export const IMPORTER = (filePath: string) => {
  if (filePath.startsWith('./') || filePath.startsWith('../')) {
    return import(new URL(filePath, APP_ROOT).href)
  }
  return import(filePath)
}
