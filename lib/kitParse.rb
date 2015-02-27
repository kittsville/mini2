class ParsedWord
	def initialize(title)
		@word		= title
		@wordtype	= ''
		@description	= ''
	end
	
	# Adds more text to the current word's defininition
	def addToDescription(extraText)
		@description << extraText.gsub("\n", ' ')
	end
	
	def type=(wordType)
		@wordtype = wordType
	end
	
	def title
		return @word
	end
	
	def wordType
		return @wordtype
	end
	
	def description
		return @description
	end
end


def parseDictionary
	dicFile = File.open File.expand_path("../../parseFiles/dictionary.txt", __FILE__)

	# Current line being worked on
	currentLine = -1

	# Array of word objects, containing the word, type and definition
	words = Array.new

	wordTypes = {
		'poetry'=> 0,
		'n.'	=> 1,
		'adj.'	=> 2,
		'v.t.'	=> 3,
		'v.i.'	=> 4,
		'pp.'	=> 5
	}

	titleCheck = true

	# Iterates over lines of raw input, parsing words and their definitions
	while (line = dicFile.gets)
		currentLine += 1
		
		# Skips silly intro
		if currentLine < 320
			next
		end
		
		# Checks for a new word if the previous line indicated there might be one
		if titleCheck == true
			# Matches regular definitions
			possibleTitle = line.scan(/^([A-Z\s]*),\s{1}(.{2,4})\s{2}(.*)/)
			
			if possibleTitle.kind_of?(Array) and possibleTitle.length == 1 and possibleTitle[0].length == 3
				
				possibleTitle = possibleTitle[0]
				
				# Checks if input is a valid title
				if possibleTitle[0].upcase == possibleTitle[0] and possibleTitle[0].length > 2
					cWord			= ParsedWord.new(possibleTitle[0])
					cWord.type		= wordTypes[possibleTitle[1]]
					cWord.addToDescription(possibleTitle[2])
					words.push(cWord)
					titleCheck 		= false
					next
				end
			end
			
			# Poetry definitions
			possibleTitle = line.scan(/^([A-Z\s]*)\.$/)[0]
			
			if possibleTitle.kind_of?(Array) and possibleTitle.length == 1 and possibleTitle[0].length == 1
				possibleTitle = possibleTitle[0]
				
				if possibleTitle[0].upcase == possibleTitle[0] and possibleTitle[0].length > 2
					cWord			= ParsedWord.new(possibleTitle[0])
					cWord.type		= wordTypes['poetry']
					words.push(cWord)
					titleCheck		= false
					next
				end
			end
		end
		
		# If line is a blank line, ignore
		if line.strip == ''
			titleCheck = true
			next
		
		# If line is a single letter (e.g. A to denote all words beginining with A), ignore
		elsif line.length == 1
			next
		
		# Otherwise line is the continued definition of an existing word
		else
			cWord.addToDescription(line.lstrip)
		end
		
		
		
		currentLine += 1
	end

	dicFile.close
	
	return words
end
