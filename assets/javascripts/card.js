(function () {

	/**
	* Use to filter assigned list
	*/
	var groupId=null;
	
	var showLinkedTicket=true;

	var opt={
		type:"GET"
	};

	relativeUrl=null;
	var apiKey=null;
	
	/**
	 * Fonction qui permet de faire un requête Ajax en gérant l'authentification
	 */
	function getJson(url,callback){
		var json2={
			url:relativeUrl+url
		};
		if(apiKey!=null){
			json2.data={
				key:apiKey
			}
		}
		var json1= jQuery.extend(opt,json2);
		jQuery.ajax(json1).done(callback).fail(function( jqXHR, textStatus ) {
		  alert( "Please check if you enable rest and jsonp in Administration > Settings > Authentication\n\nDetails : " + textStatus );
		});

	}
	

	jQuery(window).load(function(){
		relativeUrl=jQuery('#relativeUrl').val();
		apiKey=jQuery('#apiKey').val();
	
			jQuery('.ticket-modele').hide();
			jQuery('#buttonLoad').click(function(){
				var url = null;
				if (jQuery('#search-id').val()!=''){
					//Recherche par id
					url = '/issues/'+jQuery('#search-id').val()+'.json?t';
				} else {
					//Recherche sur une liste
					url = '/issues.json?limit=5000';
					if (jQuery('#tracker').val() !== ''){
						url = url + '&tracker_id=' + jQuery('#tracker').val();
					}
					if (jQuery('#status').val() !== ''){
						url = url + '&status_id=' + jQuery('#status').val();
					}
					if (jQuery('#date-since').val() !== '') {
						url = url + '&created_on=%3E%3D' + jQuery('#date-since').val();
					}
				}
				
				if (showLinkedTicket){
					url = url + '&include=relations';
				}
			
				getJson(url,function(data){
					var ticketCardModele=jQuery('.ticket-modele');
					var tickets=jQuery('#tickets');
					if(data.issues){
						for(i=0;i<data.issues.length;i++){
							var issue=data.issues[i];					
							tickets.append(getDivPostIssue(ticketCardModele,issue));
						}
						if(data.total_count>data.limit){
							alert(data.limit+"/"+data.total_count);
						}
					}else{
						tickets.append(getDivPostIssue(ticketCardModele,data.issue));
					}
				})
			});
		
			jQuery('#buttonClear').click(function(){
				jQuery('#tickets').empty();
			});

	});
	
	/**
	 * 
	 * Fonction qui 
	 */
	function getDivPostIssue(ticketCardModele,issue){
		var ticketCard=ticketCardModele.clone().removeClass('ticket-modele').addClass('project'+issue.project.id).show();
		jQuery('.id',ticketCard).html(issue.id);
		jQuery('.subject',ticketCard).html(issue.subject);
		//jQuery('.status',ticketCard).html(issue.status.name);
		jQuery('.project',ticketCard).html(issue.project.name);
		jQuery('.author',ticketCard).html(issue.author.name);
		if(issue.category){
			jQuery('.category',ticketCard).html(issue.category.name);
		}else{
			jQuery('.category',ticketCard).closest('.line').hide();
		}
		
		jQuery('.createdOn',ticketCard).html(dateFormat(new Date(issue.created_on),"yyyy-mm-dd"));
		
		if(issue.due_date){
			jQuery('.commitedDate',ticketCard).html(dateFormat(new Date(issue.due_date),"yyyy-mm-dd"));
		}else{
			jQuery('.commitedDate',ticketCard).html();
		}
		
		if(issue.estimated_hours){
			jQuery('.estimatedHour',ticketCard).html(issue.estimated_hours);
		}else{
			jQuery('.estimatedHour',ticketCard).html();
		}

		if (issue.spent_hours) {
			jQuery('.spendTime',ticketCard).html(issue.spent_hours);
		} else {
			jQuery('.spendTime',ticketCard).html();
		}

		if (showLinkedTicket && issue.relations && issue.relations.length>0) {
			var text="";
			for (var i=0; i<issue.relations.length-1; i++) {
				text=text+issue.relations[i].id+"-";
			}
			jQuery('.linked span',ticketCard).html(text);
			jQuery('.linked',ticketCard).show();
		} else {
			jQuery('.linked',ticketCard).hide();
		}
		
		if(issue.custom_fields){
			for (var i=0;i<issue.custom_fields.length;i++){
				if(issue.custom_fields[i].id==12){
					//Nom du demandeur
					if(issue.custom_fields[i].value=="Moi"){
						jQuery('.demandeur',ticketCard).html(issue.author.name);
					}else{
						jQuery('.demandeur',ticketCard).html(issue.custom_fields[i].value);
					}
				}
				if(issue.custom_fields[i].id==13){
					//Date souhaité
					if(issue.custom_fields[i].value){
						jQuery('.requestedDate',ticketCard).html(dateFormat(new Date(issue.custom_fields[i].value),"yyyy-mm-dd"));
					}
				}
			}
		}
		
		ticketCard.addClass("priority"+issue.priority.id);
		return ticketCard;
	}

}());

			
			
			
