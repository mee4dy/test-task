import './style.scss'

var modal = {
	open: function(){
		$('.modal-window-body').find('label[data-error]').attr('data-error', '')
		$('.modal-window-container').fadeIn(300); 
	},
	close: function(){
		$('.modal-window-container').fadeOut(300);
	}
}


$(function(){
	var $languageForm = $('#language-form');
	var $languagesBlock = $('#languages');
	var $languagesTable = $('#languages-table');
	var $tableTbody = $languagesTable.find('tbody');

	
	var languages = {
		items: [],
		addItem: function(data){
			languages.items.push(data);
			languages.renderLanguages();
		},
		deleteItem: function(_id){
			languages.items = languages.items.filter(function( obj ) {
			  return obj._id !== _id;
			});
			languages.renderLanguages();
		},
		updateItem: function(_id, data){
			$.each(languages.items, function(i, item){
				if(item._id==_id){
					item.name = data.name;
					item.releaseYear = data.releaseYear;
					item.designer = data.designer;
					item.website = data.website;
				}
			})
			languages.renderLanguages();
		},
		getItem: function(_id){
			var res = languages.items.filter(function( obj ) {
			  return obj._id == _id;
			});
			return res[0];
		},
		renderLanguages: function(){
			$('#count-items').text(languages.items.length)
			$tableTbody.html('');
			$.each(languages.items, function(i,val){
				$tableTbody.append('<tr data-id="'+val._id+'">'+
					'	<td>'+val.name+'</td>'+
					'	<td>'+val.releaseYear+'</td>'+
					'	<td>'+val.designer+'</td>'+
					'	<td>'+val.website+'</td>'+
					'	<td><input type="button" class="btn-edit" value="Edit"></td>'+
					'	<td><input type="button" class="btn-delete" value="Delete"></td>'+
				'</tr>')
			})
		}
	}

	//добавить язык
	$('#btn-addLanguage').on('click', function(){
		$languageForm[0].reset();
		$languageForm.find('[name="action"]').val('add')
		$('.modal-window-container').find('.head-title').text('Add language')
		modal.open()
	});

	//редактировать язык
	$tableTbody.on('click', '.btn-edit', function(){
		var id = $(this).parents('tr').attr('data-id'); 
		var itemData = languages.getItem(id);
		console.log(itemData)
		$languageForm[0].reset();
		$languageForm.find('[name="action"]').val('edit')
		$languageForm.find('[name="id"]').val(id)
		$languageForm.find('[name="name"]').val(itemData.name)
		$languageForm.find('[name="releaseYear"]').val(itemData.releaseYear)
		$languageForm.find('[name="designer"]').val(itemData.designer)
		$languageForm.find('[name="website"]').val(itemData.website)
		$('.modal-window-container').find('.head-title').text('Edit language')
		modal.open()
	})

	//скрыть окно
	$('.btn-cancel, .head-closeBtn').on('click', function(){
		modal.close()
	});

	$(document).mouseup(function(e) {
	    var container = $(".modal-window-body");
		if(!container.is(e.target) && container.has(e.target).length === 0) modal.close()
	});
	//скрыть окно

	//add new
	$languageForm.on('submit', function(){
		var formData = $(this).serializeArray();
		console.log(formData)
		var item = {};
		jQuery.each(formData, function(i, field) {
			item[field.name] = field.value;	
		});

		if(item.action=='add'){
			$.post('https://obscure-brushlands-44257.herokuapp.com/languages', formData, function(){
				//
			}).done(function() {
				console.log('ok')
				languages.addItem(item);
				modal.close();
			}).fail(function(result) {
				console.log('error')
				$.each(result.responseJSON, function(name, val){
					$languageForm.find('.fblock-row[data-name="'+name+'"]').find('label').attr('data-error', val)
				})
			}, 'json')	
		}
		else if(item.action=='edit'){
			$.ajax({
				url: 'https://obscure-brushlands-44257.herokuapp.com/languages/'+item.id,
				type: 'PUT',
				data: formData,
				success: function(result) {
					languages.updateItem(item.id, item)
					modal.close();
				},
				error: function(result){
					console.log('error')
					$.each(result.responseJSON, function(name, val){
						$languageForm.find('.fblock-row[data-name="'+name+'"]').find('label').attr('data-error', val)
					})
				}
			});
		}

	})

	//delete item
	$tableTbody.on('click', '.btn-delete', function(){
		var id = $(this).parents('tr').attr('data-id'); 
		languages.deleteItem(id);
		$.ajax({
			url: 'https://obscure-brushlands-44257.herokuapp.com/languages/'+id,
			type: 'DELETE',
			success: function(result) {

			}
		});
	})

	
	//get items
	$.get('https://obscure-brushlands-44257.herokuapp.com/languages', {}, function(items){
		$languagesBlock.fadeIn(200)
		languages.items = items;
		console.log(items)
		languages.renderLanguages();
	}, 'json')
})