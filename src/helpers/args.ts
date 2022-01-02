//  ====
//  ARGS
//  ====

/**
 * Retrieves the cli-arguments from process.argv
 * @returns The array of cli arguments
 */
 export const getArguments = () => process.argv.slice(2)

 type ParsedArguments = {
     arguments: string[],
     flags: { [key: string]: any }
 }
 
 /**
  * Parses the command line arguments
  * @param args Array of CLI arguments
  */
 export const parseArguments = (...args: string[]): ParsedArguments => {
 
     //  Get arguments from process.argv if none are passed int
     if (!args || !args.length) {
         args = getArguments()
     }
 
     //  Handle variadic arguments as well as a single array
     if (args.length === 1 && Array.isArray(args[0])) {
         args = args[0]
     }
 
     const result: ParsedArguments = { arguments: [], flags: {} }
 
     //  Iterate over all arguments
     for (let i = 0; i < args.length; i++) {
 
         //  If the argument is not a flag...
         if (!args[i].startsWith('-')) {
             result.arguments.push(args[i])  //  ... add it to the arguments array
         }
 
         //  If the argument starts with --
         if (args[i].startsWith('--')) {
             //  Extract key=value using regex
             let match = args[i].substring(2).match(/^([\w\-]+)=?(\w*)$/im)
 
             if (!match) { continue }  //  Return if match is not found
 
             let [, key, value] = match as [input: string, key: string, value?: string | boolean]
 
             //  If the value is not defined and the next argument exists and is not a flag...
             if (!value && args.length > i + 1 && !args[i + 1].startsWith('-')) {
                 value = args[i + 1] //  ... assign it as the value for the current flag
                 i = i + 1   //  Skip the next iteration
             }
 
             value = value || true   //  Default to true if value is undefined
             result.flags[key] = value   //  Set flag
         }
 
         //  If the argument starts with -
         else if (args[i].startsWith('-')) {
             //  Extract k=value using regex
             let match = args[i].substring(1).match(/([\w\-]{1})=?(\w*)/im)
 
             if (!match) { continue }  //  Return if match is not found
 
             let [, key, value] = match as [input: string, flagName: string, value?: string | boolean]
 
             //  If the value is not defined and the next argument exists and it is not a flag...
             if (!value && args.length > i + 1 && !args[i + 1].startsWith('-')) {
                 value = args[i + 1] //  ...assign it as the value to the current flag
                 i = i + 1   //  Skip the next iteration
             }
 
             value = value || true   //  Default to true if value is undefined
             result.flags[key] = value   //  Set flag
         }
 
     }
 
     return result
 
 }