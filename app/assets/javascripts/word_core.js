function renderWord( rowIndex, record, columns, cellWriter ) {
	return $('<li/>', {
		'class'	: 'single-word',
		'id'	: 'word-' + record.id,
		'html'	: [
			$('<h4/>',{
				'class' : 'title',
				'html'	: $('<a/>',{
					'href'	: '/' + record.id,
					'html'	: record.word
				})
			}),
			$('<h5/>',{
				'class'	: 'type',
				'html'	: 'Type: ' + getWordType(record.wordtype)
			}),
			$('<p/>',{
				'class'	: 'description',
				'html'	: record.description
			})
		]
	}).prop('outerHTML');
}

function getWordType( wordType ) {
	return ['poetry','Noun','Adjective','Transitive Verb','Instransitive Verb','Prepositional Phrase','Pronoun'][wordType];
}

$( document ).ready(function() {
	if ($('div.dic-description').length == 1){
		$.ajax({
			type	: 'POST',
			url	: '/',
			dataType: 'json'
		}).success(function(data){
			var wordTable = $('ul#word-table').dynatable({
				table: {
					bodyRowSelector: 'li'
				},
				writers: {
					_rowWriter: renderWord
				},
				dataset: {
					records: data,
					perPageDefault: 20,
					perPageOptions: [20, 40, 60, 100]
				},
				params: {
					records: 'words'
				},
				features: {
					pushState: false
				},
				inputs: {
					processingText: '<div class="dtable-process-wrap"><div class="dtable-process-icon glyphicon glyphicon-refresh"></div></div>'
				}
			});
		}).fail(function(){
			console.log('Something went wrong :(');
		});
	} else {
		var wordType = $('h5');
		
		wordType.html('Type: '+getWordType(parseInt(wordType.html())));
		
		$.ajax({
			'type'		: 'POST',
			'url'		: 'https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=6625e6908d801278df4207c4e13cc6f3&tags='+$('h4').html()+'&format=json&nojsoncallback=1&per_page=1&license=4,5,6',
			'dataType'	: 'json'
		}).success(function(data){
			// If there are no photos to display, displays placeholder messages
			if ( data.photos.photo.length < 1 ) {
				$('div.flickr-photo').html($('<i/>',{html:'No Creative Commons image available'}));
				return;
			}
			
			var photo = data.photos.photo[0];
			
			$('div.flickr-photo').html(
				$('<img/>',{
					href	: 'http://www.flickr.com/photos/'+photo.owner+'/'+photo.id,
					src	: 'http://farm'+photo.farm+'.static.flickr.com/'+photo.server+'/'+photo.id+'_'+photo.secret+'_'+'z.jpg',
					alt	: photo.title
				})
			);
		}).fail(function(){
			console.log('Flickr API call failed :(');
		});
	}
});
