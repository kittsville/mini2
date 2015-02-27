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
});
