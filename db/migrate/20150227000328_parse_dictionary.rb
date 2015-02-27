class ParseDictionary < ActiveRecord::Migration
  def up
	require 'kitParse'
	
	# Opens Devil's Dictionary and parses dictionary
	words = parseDictionary
	
	words.each{ |word|
		# Creates new word
		newWord = Word.new(:word=> word.title, :wordtype => word.wordType, :description => word.description)
		
		newWord.save
	}
	
	puts 'Added ' + words.length.to_s + ' definitions to database'
  end
  
  def down
	Word.delete_all
  end
end
