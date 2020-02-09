import extractCode from './extract-code'
import exportFiles from './export-files'
import runJavascript from './run-javascript'
import interpolateJavascript from './interpolate-javascript'
import runJSON from './run-json'
import { join } from 'path'
import { readFile } from 'fs-extra'

export default class Odd{
	constructor(config){
		this.config = {
			input: `./`,
			output: `./dist`,
			plugins: [],
			...config,
		}
		this.config.plugins.unshift(...[
			extractCode(),
			runJSON(),
			runJavascript(),
			interpolateJavascript(),
			exportFiles(),
		])
	}
	async processFile(path){
		const loc = join(this.config.input, path)
		let contents = await readFile(loc)
		contents = contents.toString()

		let data = {
			contents,
			config: this.config,
			path,
			_shared: {},
		}

		for(let plugin of this.config.plugins){
			let newData = await plugin(data)
			if(newData){
				data = newData
			}
		}

	}
}