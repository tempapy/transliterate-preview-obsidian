import { Plugin } from "obsidian";

import { MarkdownRenderChild } from "obsidian";

export class Transliterate extends MarkdownRenderChild {
	static iast2slp1_table: Record<any, any> = {
		"3c": {
			"aü":"au",
			"aï":"ai",
			"kḧ":"kh",
			"gḧ":"gh",
			"cḧ":"ch",
			"jḧ":"jh",
			"ṭḧ":"wh",
			"ḍḧ":"qh",
			"łḧ":"Lh",
			"tḧ":"th",
			"dḧ":"dh",
			"pḧ":"ph",
			"bḧ":"bh"
		},
		"2c": {
			"ai": "E",
			"au": "O",
			"kh": "K",
			"gh": "G",
			"ch": "C",
			"jh": "J",
			"ṭh": "W",
			"ḍh": "Q",
			"łh": "|",
			"th": "T",
			"dh": "D",
			"ph": "P",
			"bh": "B"
		},
		"1c": {
			"a": "a",
			"ā": "A",
			"i": "i",
			"ī": "I",
			"u": "u",
			"ū": "U",
			"ṛ": "f",
			"ṝ": "F",
			"ḷ": "x",
			"ḹ": "X",
			"e": "e",
			"o": "o",
			"k": "k",
			"g": "g",
			"ṅ": "N",
			"c": "c",
			"j": "j",
			"ñ": "Y",
			"ṭ": "w",
			"ḍ": "q",
			"ṇ": "R",
			"ł": "L",
			"t": "t",
			"d": "d",
			"n": "n",
			"p": "p",
			"b": "b",
			"m": "m",
			"y": "y",
			"r": "r",
			"l": "l",
			"v": "v",
			"ś": "S",
			"ṣ": "z",
			"s": "s",
			"h": "h",
			"ḥ": "H",
			"ẖ": "Z",
			"ḫ": "V",
			"ṃ": "M",
			"̐": "~",
			"'": "'"
		}

	}
	static slp12deva_table: Record<any, any> = {
		
		"vowels":{
			"a": ["अ",""],
			"A": ["आ", "ा"],
			"i": ["इ", "ि"],
			"I": ["ई", "ी"],
			"u": ["उ", "ु"],
			"U": ["ऊ", "ू"],
			"f": ["ऋ", "ृ"],
			"F": ["ॠ", "ॄ"],
			"x": ["ऌ", "ॢ"],
			"X": ["ॡ", "ॣ"],
			"e": ["ए", "े"],
			"E": ["ऐ", "ै"],
			"o": ["ओ", "ो"],
			"O": ["औ", "ौ"]},
		"consonants": {
			"k": "क्",
			"K": "ख्",
			"g": "ग्",
			"G": "घ्",
			"N": "ङ्",
			"c": "च्",
			"C": "छ्",
			"j": "ज्",
			"J": "झ्",
			"Y": "ञ्",
			"w": "ट्",
			"W": "ठ्",
			"q": "ड्",
			"Q": "ढ्",
			"R": "ण्",
			"L": "ळ्",
			"|": "ळ्ह्",
			"t": "त्",
			"T": "थ्",
			"d": "द्",
			"D": "ध्",
			"n": "न्",
			"p": "प्",
			"P": "फ्",
			"b": "ब्",
			"B": "भ्",
			"m": "म्",
			"y": "य्",
			"r": "र्",
			"l": "ल्",
			"v": "व्",
			"S": "श्",
			"z": "ष्",
			"s": "स्",
			"h": "ह्"
		},
		"others":{
			"'": "ऽ",
			"H": "ः",
			"Z": "ᳵ",
			"V": "ᳶ",
			"M": "ं",
			"~": "ँ"
		}
	}
	static slp1_vowels = "aAiIuUfFxXeEoO";
	static slp1_consonants = "kKgGNcCjJYwWqQRL|tTdDnpPbBmyrlvSzsh";
	static slp1_others = "'HZVM~";
	
	text: string;

	constructor(containerEl: HTMLElement, textinput: string) {
	super(containerEl);

	this.text = textinput;
	}

	onload() {
		var text = this.text;
		function transcode_vowels(capture: string, match: string){
			var output = match;
			if (output == ""){
			  
			  return output;
			}
			else{
			  return Transliterate.slp12deva_table.vowels[output][0];
			}
		  }
		  function transcode_consonants(capture: string, match: string){
			var output = match;
			if (output == ""){
			  
			  return output;
			}
			else{
			  return Transliterate.slp12deva_table.consonants[output];
			}
		  }
		  
		  function transcode_syllables(capture: string, match: string){
			var output = match;
			if (output == ""){
			  
			  return output;
			}
			else{
			  return Transliterate.slp12deva_table.consonants[output[0]].slice("0", "-1")+Transliterate.slp12deva_table.vowels[output[1]][1];
			}
		  }
		  
		  function transcode_others(capture: string, match: string){
			var output = match;
			
			if (output == ""){
			  
			  return output;
			}
			else{
			
			  return Transliterate.slp12deva_table.others[output];
			}
		  }
		
		
		for (var i = 0; i < Transliterate.slp1_consonants.length; i++){
			var c = Transliterate.slp1_consonants[i];
			var regex = new RegExp("("+c+")"+"(?!["+Transliterate.slp1_vowels+"])", "g");
			text = text.replace(regex, transcode_consonants);
		}
		
		
		for (var i = 0; i < Transliterate.slp1_consonants.length; i++){
			var c = Transliterate.slp1_consonants[i];
			var regex = new RegExp("("+c+"["+Transliterate.slp1_vowels+"])", "g");
			text = text.replace(regex, transcode_syllables);
		}
		
		for (var i = 0; i < Transliterate.slp1_vowels.length; i++){
			var c = Transliterate.slp1_vowels[i]
			
			var regex = new RegExp("("+c+")", "g");
			
			text = text.replace(regex, transcode_vowels);
			
		}
		
		for (var i = 0; i < Transliterate.slp1_others.length; i++){
			var c = Transliterate.slp1_others[i];
			var regex = new RegExp("("+c+")", "g");
			text = text.replace(regex, transcode_others);
		}
		

		const emojiEl = this.containerEl.createSpan({
			text: text
		});
		this.containerEl.replaceWith(emojiEl);
	}
}

export default class ExamplePlugin extends Plugin {

	async onload() {
		this.registerMarkdownPostProcessor((element, context) => {
			const codeblocks = element.querySelectorAll("code.language-sk");
	  
			for (let index = 0; index < codeblocks.length; index++) {
				const codeblock = codeblocks.item(index) as HTMLElement;
				const text = codeblock.innerText;
				context.addChild(new Transliterate(codeblock, text));
			}
		  });
		/*
		
		this.registerMarkdownCodeBlockProcessor("sk", (source, el, ctx) => {

		function transcode_vowels(capture: string, match: string){
			var output = match;
			if (output == ""){
			  
			  return output;
			}
			else{
			  return ExamplePlugin.slp12deva_table.vowels[output][0];
			}
		  }
		  function transcode_consonants(capture: string, match: string){
			var output = match;
			if (output == ""){
			  
			  return output;
			}
			else{
			  return ExamplePlugin.slp12deva_table.consonants[output];
			}
		  }
		  
		  function transcode_syllables(capture: string, match: string){
			var output = match;
			if (output == ""){
			  
			  return output;
			}
			else{
			  return ExamplePlugin.slp12deva_table.consonants[output[0]].slice("0", "-1")+ExamplePlugin.slp12deva_table.vowels[output[1]][1];
			}
		  }
		  
		  function transcode_others(capture: string, match: string){
			var output = match;
			
			if (output == ""){
			  
			  return output;
			}
			else{
			
			  return ExamplePlugin.slp12deva_table.others[output];
			}
		  }
		  
		  
		var text = source;
		
		
		for (var i = 0; i < ExamplePlugin.slp1_consonants.length; i++){
			var c = ExamplePlugin.slp1_consonants[i];
			var regex = new RegExp("("+c+")"+"(?!["+ExamplePlugin.slp1_vowels+"])", "g");
			text = text.replace(regex, transcode_consonants);
		}
		
		
		for (var i = 0; i < ExamplePlugin.slp1_consonants.length; i++){
			var c = ExamplePlugin.slp1_consonants[i];
			var regex = new RegExp("("+c+"["+ExamplePlugin.slp1_vowels+"])", "g");
			text = text.replace(regex, transcode_syllables);
		}
		
		for (var i = 0; i < ExamplePlugin.slp1_vowels.length; i++){
			var c = ExamplePlugin.slp1_vowels[i]
			
			var regex = new RegExp("("+c+")", "g");
			
			text = text.replace(regex, transcode_vowels);
			
		}
		
		for (var i = 0; i < ExamplePlugin.slp1_others.length; i++){
			var c = ExamplePlugin.slp1_others[i];
			var regex = new RegExp("("+c+")", "g");
			text = text.replace(regex, transcode_others);
		}
		
		el.innerText = text+"\n";

		}); */
	}
}
